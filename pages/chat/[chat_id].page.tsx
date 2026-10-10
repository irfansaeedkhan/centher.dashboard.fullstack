import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import clsx from "clsx";
import toast from "react-hot-toast";
import { NextPageWithLayout } from "@/pages/_app.page";
import { ChatPagesWrapper } from "@/components/all.pages.wrapper/chat.pages.wrapper";
import { BackButton } from "@/components/button/back-button";
import { useChatMessages } from "@/hooks/chat/useChat";
import { chatApi } from "@/lib/chat/api";
import {
  conversationAvatar,
  conversationDisplayName,
  type ChatConversation,
  type ChatMessage,
} from "@/lib/chat/types";
import { getMessageTime } from "@/lib/chat/utils";
import useUser from "@/hooks/use.user";
import { customLog } from "@/utils/custom.log";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const SingleChat: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useUser();
  const chatId = router.query.chat_id as string | undefined;

  const [convo, setConvo] = useState<ChatConversation | null>(null);
  const {
    messages,
    loading,
    sending,
    sendMessage,
    editMessage,
    deleteMessage,
    toggleReaction,
  } = useChatMessages(chatId);

  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<ChatMessage | null>(null);
  const [reactionFor, setReactionFor] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ChatMessage | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const myId = user?._id ?? "";

  useEffect(() => {
    if (!chatId) return;
    chatApi
      .listConversations()
      .then(({ conversations }) => {
        const found = conversations.find((c) => c.id === chatId) ?? null;
        setConvo(found);
        if (!found) router.push("/chat");
      })
      .catch((e) => customLog(["development", "staging"], e));
  }, [chatId, router]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    if (editing) {
      try {
        await editMessage(editing.id, text);
        setEditing(null);
        setDraft("");
      } catch (e: any) {
        toast.error(e?.message || "Could not update message");
      }
      return;
    }
    setDraft("");
    try {
      await sendMessage(text);
    } catch {
      setDraft(text);
    }
  };

  const name = convo ? conversationDisplayName(convo, myId) : "Chat";
  const avatar = convo ? conversationAvatar(convo, myId) : null;

  return (
    <div className="flex h-[calc(100vh-60px)] w-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-shade-3 px-4 py-3">
        <BackButton className="flg:hidden" />
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-elevation-2">
          {avatar ? (
            <Image src={avatar} alt={name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          {convo && convo.members.length > 2 && (
            <p className="truncate text-xs text-gray-shade-7">
              {convo.members.length} members
            </p>
          )}
        </div>
      </div>

      <div className="customScrollbar flex-1 overflow-y-auto bg-[url(/images/chat-bg-with-centher-logo.png)] bg-cover bg-center px-4 py-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Image
              src="/images/preloader.png"
              alt="Loading"
              width={48}
              height={48}
              className="h-12 w-12 object-cover"
            />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-shade-7">
              No messages yet. Say hello!
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              mine={m.sender_id === myId}
              onReact={() =>
                setReactionFor(reactionFor === m.id ? null : m.id)
              }
              showReactions={reactionFor === m.id}
              onPickEmoji={(emoji) => {
                setReactionFor(null);
                toggleReaction(m.id, emoji).catch((e: any) =>
                  toast.error(e?.message || "Could not react")
                );
              }}
              onEdit={() => {
                setEditing(m);
                setDraft(m.body);
              }}
              onDelete={() => setConfirmDelete(m)}
            />
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-gray-shade-3 px-4 py-3">
        {editing && (
          <div className="mb-2 flex items-center justify-between rounded-lg bg-elevation-1 px-3 py-2">
            <p className="truncate text-xs text-gray-shade-7">Editing message</p>
            <button
              className="text-xs text-gray-shade-7 hover:text-white"
              onClick={() => {
                setEditing(null);
                setDraft("");
              }}
            >
              Cancel
            </button>
          </div>
        )}
        <div className="focus-within:gradient-border-3 flex items-center gap-2 !rounded-lg bg-elevation-1 p-[1px]">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message"
            className="w-full bg-transparent px-4 py-3 text-sm text-white focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            className="mr-2 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {editing ? "Save" : sending ? "..." : "Send"}
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-elevation-2 p-6">
            <h3 className="text-lg font-semibold text-white">Delete message?</h3>
            <p className="mt-2 text-sm text-gray-shade-7">
              This message will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg bg-elevation-1 px-4 py-2 text-sm text-white"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={async () => {
                  try {
                    await deleteMessage(confirmDelete.id);
                  } catch (e: any) {
                    toast.error(e?.message || "Could not delete message");
                  } finally {
                    setConfirmDelete(null);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MessageBubble: React.FC<{
  message: ChatMessage;
  mine: boolean;
  onReact: () => void;
  showReactions: boolean;
  onPickEmoji: (emoji: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({
  message,
  mine,
  onReact,
  showReactions,
  onPickEmoji,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={clsx("group mb-3 flex", mine ? "justify-end" : "justify-start")}
    >
      <div className="max-w-[75%] sm:max-w-[60%]">
        {!mine && (
          <p className="mb-1 text-xs text-gray-shade-7">
            {message.sender?.display_name || "Someone"}
          </p>
        )}
        <div
          className={clsx(
            "relative rounded-2xl px-4 py-2",
            mine
              ? "rounded-br-md bg-primary text-white"
              : "rounded-bl-md bg-elevation-1 text-white"
          )}
        >
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.body}
          </p>
          <p
            className={clsx(
              "mt-1 text-right text-[10px]",
              mine ? "text-white/70" : "text-gray-shade-7"
            )}
          >
            {getMessageTime(message.created_at)}
          </p>
          <div className="absolute -top-2 right-2 hidden gap-1 group-hover:flex">
            <button
              aria-label="React"
              className="rounded-full bg-elevation-2 px-2 py-0.5 text-xs shadow"
              onClick={onReact}
            >
              🙂
            </button>
            {mine && (
              <>
                <button
                  aria-label="Edit"
                  className="rounded-full bg-elevation-2 px-2 py-0.5 text-xs shadow"
                  onClick={onEdit}
                >
                  ✏️
                </button>
                <button
                  aria-label="Delete"
                  className="rounded-full bg-elevation-2 px-2 py-0.5 text-xs shadow"
                  onClick={onDelete}
                >
                  🗑️
                </button>
              </>
            )}
          </div>
          {showReactions && (
            <div className="absolute -top-9 right-0 z-10 flex gap-1 rounded-full bg-elevation-2 px-2 py-1 shadow-xl">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  className="text-lg hover:scale-125"
                  onClick={() => onPickEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        {message.reactions.length > 0 && (
          <div className={clsx("mt-1 flex gap-1", mine && "justify-end")}>
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => onPickEmoji(r.emoji)}
                title={r.reacted_by_me ? "Remove reaction" : "React"}
                className={clsx(
                  "rounded-full px-2 py-0.5 text-xs",
                  r.reacted_by_me
                    ? "bg-primary/30 text-white"
                    : "bg-elevation-1 text-gray-shade-7"
                )}
              >
                {r.emoji} {r.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SingleChat.getLayout = (page) => (
  <ChatPagesWrapper pageTitle="Chat">{page}</ChatPagesWrapper>
);

export default SingleChat;
