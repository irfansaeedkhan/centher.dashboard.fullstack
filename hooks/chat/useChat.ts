/**
 * Phase 5: chat data layer. Replaces the dead ProductLive websocket hook
 * (`useProductLive`) with same-origin REST. Polls the open thread for new
 * messages; the conversation list refreshes on focus and after mutations.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { chatApi } from "@/lib/chat/api";
import { mergeMessages, prependOlder } from "@/lib/chat/merge";
import type {
  ChatConversation,
  ChatMessage,
  TypingUser,
} from "@/lib/chat/types";
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

  const deleteConversation = useCallback(async (id: string) => {
    await chatApi.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    toast.success("Conversation deleted");
  }, []);

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

/**
 * Chat completeness Q24 (presence): heartbeat while the chat UI is open.
 * Fires immediately on mount, then every 60s; the server throttles the
 * actual write to one per user per ~60s, so this stays a single cheap
 * request — never a write storm. Failures are silent (presence is a
 * nice-to-have; the global 401 handler heals dead sessions).
 */
export const usePresenceHeartbeat = () => {
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
    const beat = () => {
      chatApi.sendPresence().catch(() => {});
    };
    beat();
    const t = setInterval(beat, 60_000);
    return () => clearInterval(t);
  }, [user]);
};

const POLL_MS = 5000;

export const useChatMessages = (chatId: string | undefined) => {
  const { user } = useUser();
  const myId = user?._id ?? "";
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingThrottleRef = useRef(0);
  // Chat-grill Q19: newest message id we've already marked read. The poll
  // used to POST markAsRead every 5s even with zero new messages (~24
  // pointless writes/min per idle open chat). Now it only fires when the
  // newest message actually changed.
  const markedNewestIdRef = useRef<string | null>(null);
  const oldestIdRef = useRef<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId || !user) return;
    try {
      const { messages: list, has_more } = await chatApi.listMessages(chatId, {
        limit: 100,
      });
      // Chat-grill Q7: merge by id instead of full-replacing — a poll
      // response that started before my send completed no longer wipes
      // the optimistically appended message.
      setMessages((prev) => mergeMessages(prev, list, myId));
      if (list.length > 0) {
        oldestIdRef.current = list[0].id;
        if (typeof has_more === "boolean") setHasMore(has_more);
      }
      // Bulk-mark others' messages as read (single request) instead of
      // one POST per message. The API returns messages chronological ASC
      // (oldest first), so list[list.length - 1] is the newest — the
      // correct inclusive boundary.
      const newest = list.length > 0 ? list[list.length - 1] : null;
      if (newest && newest.id !== markedNewestIdRef.current) {
        markedNewestIdRef.current = newest.id;
        chatApi
          .markAsRead(chatId, { upToMessageId: newest.id })
          .catch(() => {});
      }
    } catch {
      // keep the last good list
    } finally {
      setLoading(false);
    }
  }, [chatId, user, myId]);

  const fetchTyping = useCallback(async () => {
    if (!chatId || !user) return;
    try {
      const { typing } = await chatApi.getTyping(chatId);
      setTypingUsers(typing);
    } catch {
      // ignore
    }
  }, [chatId, user]);

  // Chat-grill Q13: scroll-up pagination. The client never sent `before`
  // before — threads over 100 messages were silently truncated.
  const loadOlder = useCallback(async () => {
    if (!chatId || loadingOlder || !hasMore) return;
    const oldestId = oldestIdRef.current;
    if (!oldestId) return;
    setLoadingOlder(true);
    try {
      const { messages: older, has_more } = await chatApi.listMessages(chatId, {
        before: oldestId,
        limit: 50,
      });
      if (older.length > 0) {
        oldestIdRef.current = older[0].id;
        setMessages((prev) => prependOlder(prev, older));
      }
      if (typeof has_more === "boolean") setHasMore(has_more);
      else if (older.length < 50) setHasMore(false);
    } catch {
      // keep what we have
    } finally {
      setLoadingOlder(false);
    }
  }, [chatId, loadingOlder, hasMore]);

  // Throttled typing ping (max once per 3s).
  const sendTypingPing = useCallback(() => {
    if (!chatId) return;
    const now = Date.now();
    if (now - typingThrottleRef.current < 3000) return;
    typingThrottleRef.current = now;
    chatApi.sendTyping(chatId).catch(() => {});
  }, [chatId]);

  useEffect(() => {
    setMessages([]);
    setTypingUsers([]);
    setLoading(true);
    setHasMore(true);
    setLoadingOlder(false);
    markedNewestIdRef.current = null;
    oldestIdRef.current = null;
    fetchMessages();
    if (chatId) {
      chatApi.markAsRead(chatId).catch(() => {});
      pollRef.current = setInterval(() => {
        fetchMessages();
        fetchTyping();
      }, POLL_MS);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [chatId, fetchMessages, fetchTyping]);

  // Chat-grill Q25: the old sendMessage here was dead — the composer sends
  // through chatApi directly (divergent double-send guards). One send path:
  // the composer's. Deleted instead of "fixed".
  const editMessage = useCallback(async (messageId: string, body: string) => {
    const msg = await chatApi.editMessage(messageId, body.trim());
    setMessages((prev) => prev.map((m) => (m.id === messageId ? msg : m)));
    toast.success("Message updated");
  }, []);

  // Chat-grill Q16: soft delete — mark the placeholder instead of dropping
  // the row from the list (the server keeps the row with is_deleted).
  const deleteMessage = useCallback(async (messageId: string) => {
    await chatApi.deleteMessage(messageId);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, is_deleted: true, body: "" } : m
      )
    );
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

  const appendMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  return {
    messages,
    loading,
    hasMore,
    loadingOlder,
    loadOlder,
    typingUsers,
    editMessage,
    deleteMessage,
    toggleReaction,
    refresh: fetchMessages,
    appendMessage,
    sendTypingPing,
  };
};
