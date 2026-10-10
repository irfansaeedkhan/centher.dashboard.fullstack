/**
 * Phase 5: chat data layer. Replaces the dead ProductLive websocket hook
 * (`useProductLive`) with same-origin REST. Polls the open thread for new
 * messages; the conversation list refreshes on focus and after mutations.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { chatApi } from "@/lib/chat/api";
import type { ChatConversation, ChatMessage } from "@/lib/chat/types";
import useUser from "../use.user";

export const useChatConversations = () => {
  const { user } = useUser();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const { conversations: list } = await chatApi.listConversations();
      setConversations(list);
    } catch {
      // keep the last good list; the global 401 handler heals sessions
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const createConversation = useCallback(
    async (userId: string) => {
      const convo = await chatApi.createConversation([userId]);
      await refresh();
      return convo.id;
    },
    [refresh]
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      await chatApi.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      toast.success("Conversation deleted");
    },
    []
  );

  const togglePin = useCallback(async (convo: ChatConversation) => {
    if (convo.is_pinned) {
      await chatApi.unpinConversation(convo.id);
    } else {
      await chatApi.pinConversation(convo.id);
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convo.id ? { ...c, is_pinned: !convo.is_pinned } : c
      )
    );
  }, []);

  const unreadTotal = conversations.reduce((n, c) => n + c.unread_count, 0);

  return {
    conversations,
    loading,
    refresh,
    createConversation,
    deleteConversation,
    togglePin,
    unreadTotal,
  };
};

const POLL_MS = 5000;

export const useChatMessages = (chatId: string | undefined) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId || !user) return;
    try {
      const { messages: list } = await chatApi.listMessages(chatId, {
        limit: 100,
      });
      setMessages(list);
    } catch {
      // keep the last good list
    } finally {
      setLoading(false);
    }
  }, [chatId, user]);

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    fetchMessages();
    if (chatId) {
      chatApi.markAsRead(chatId).catch(() => {});
      pollRef.current = setInterval(fetchMessages, POLL_MS);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [chatId, fetchMessages]);

  const sendMessage = useCallback(
    async (body: string) => {
      if (!chatId || !body.trim()) return;
      setSending(true);
      try {
        const msg = await chatApi.sendMessage(chatId, body.trim());
        setMessages((prev) => [...prev, msg]);
        chatApi.markAsRead(chatId).catch(() => {});
      } catch (e: any) {
        toast.error(e?.message || "Could not send message");
        throw e;
      } finally {
        setSending(false);
      }
    },
    [chatId]
  );

  const editMessage = useCallback(async (messageId: string, body: string) => {
    const msg = await chatApi.editMessage(messageId, body.trim());
    setMessages((prev) => prev.map((m) => (m.id === messageId ? msg : m)));
    toast.success("Message updated");
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    await chatApi.deleteMessage(messageId);
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    toast.success("Message deleted");
  }, []);

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      await chatApi.toggleReaction(messageId, emoji);
      // Refetch to get accurate grouped counts.
      fetchMessages();
    },
    [fetchMessages]
  );

  return {
    messages,
    loading,
    sending,
    sendMessage,
    editMessage,
    deleteMessage,
    toggleReaction,
    refresh: fetchMessages,
  };
};
