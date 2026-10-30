import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import clsx from "clsx";
import toast from "react-hot-toast";
import { NextPageWithLayout } from "@/pages/_app.page";
import { ChatLayout } from "./_components/chat.layout";
import { BackButton } from "@/components/button/back-button";
import { useChatMessages } from "@/hooks/chat/useChat";
import { chatApi } from "@/lib/chat/api";
import {
  conversationAvatar,
  conversationDisplayName,
  dmPeer,
  type ChatConversation,
  type ChatMessage,
} from "@/lib/chat/types";
import { GroupMenu } from "./_components/group-menu";
import { getMessageTime, isEditExpired } from "@/lib/chat/utils";
import {
  MessageContent,
  MessageStatus,
  ReplyPreview,
} from "./_components/message/message-content";
import { ChatComposer } from "./_components/composer/chat-composer";
import { TypingIndicator } from "./_components/typing-indicator";
import useUser from "@/hooks/use.user";
import { customLog } from "@/utils/custom.log";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

/** Q24 presence subtitle for a DM peer who is not online right now. */
function lastActiveLabel(iso: string): string {
  const mins = Math.floor((Date.now() - +new Date(iso)) / 60000);
  if (mins < 2) return "Active just now";
  if (mins < 60) return `Active ${mins} m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Active ${hrs} h ago`;
  return `Active ${Math.floor(hrs / 24)} d ago`;
}

const SingleChat: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useUser();
  const chatId = router.query.chat_id as string | undefined;

  const [convo, setConvo] = useState<ChatConversation | null>(null);
  const {
    messages,
    loading,
    hasMore,
    loadingOlder,
    loadOlder,
    typingUsers,
    editMessage,
    deleteMessage,
    toggleReaction,
    appendMessage,
    sendTypingPing,
  } = useChatMessages(chatId);

  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<ChatMessage | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [reactionFor, setReactionFor] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ChatMessage | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const myId = user?._id ?? "";

  const loadConvo = useCallback(() => {
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
    loadConvo();
  }, [loadConvo]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Chat-grill Q13: scroll-up loads older messages (threads over 100
  // messages were silently truncated before). Scroll position is restored
  // so the view doesn't jump when the older page prepends.
  const handleListScroll = () => {
    const el = listRef.current;
    if (!el || loadingOlder || !hasMore) return;
    if (el.scrollTop > 120) return;
    const prevHeight = el.scrollHeight;
    const prevTop = el.scrollTop;
    loadOlder().then(() => {
      requestAnimationFrame(() => {
        const cur = listRef.current;
        if (cur) cur.scrollTop = cur.scrollHeight - prevHeight + prevTop;
      });
    });
  };
  // Scroll to the original message when a quoted reply is clicked, and
  // briefly highlight it. No-op if the message isn't in the loaded batch.
  const scrollToMessage = (id: string) => {
    const el = document.querySelector(`[data-message-id="${CSS.escape(id)}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const highlight = [
      "outline",
      "outline-2",
      "outline-primary",
      "outline-offset-2",
    ];
    el.classList.add(...highlight);
    window.setTimeout(() => el.classList.remove(...highlight), 1500);
  };

  // Chat completeness Q24: arriving from message search (?highlight=<id>)
  // jumps to + highlights that message. If it predates the loaded batch,
  // page older messages in until it shows up (bounded — a stale link
  // gives up quietly instead of paging forever).
  const highlightId = router.query.highlight as string | undefined;
  const highlightHandledRef = useRef<string | null>(null);
  const highlightAttemptsRef = useRef(0);
  useEffect(() => {
    highlightAttemptsRef.current = 0;
  }, [highlightId]);
  useEffect(() => {
    if (!highlightId || loading) return;
    if (highlightHandledRef.current === highlightId) return;
    if (messages.some((m) => m.id === highlightId)) {
      highlightHandledRef.current = highlightId;
      requestAnimationFrame(() => scrollToMessage(highlightId));
      return;
    }
    if (hasMore && highlightAttemptsRef.current < 10) {
      highlightAttemptsRef.current += 1;
      loadOlder();
    } else {
      highlightHandledRef.current = highlightId;
    }
  }, [highlightId, messages, loading, hasMore, loadOlder]);

  const name = convo ? conversationDisplayName(convo, myId) : "Chat";
  const avatar = convo ? conversationAvatar(convo, myId) : null;
  // Team bots (2026-10-16): in a 1-on-1 DM, badge the bot peer.
  const peerIsBot =
    !!convo &&
    convo.members.length === 2 &&
    convo.members.some((m) => m.user_id !== myId && m.is_bot);
  // Q24 presence: the DM peer (dot + last-active in the header).
  const peer = convo ? dmPeer(convo, myId) : null;

  return (
    <div className="flex h-[calc(100vh-60px)] w-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-shade-3 px-4 py-3">
        <BackButton className="flg:hidden" />
        <div className="relative h-10 w-10 flex-shrink-0">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-elevation-2">
            {avatar ? (
              <Image src={avatar} alt={name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-semibold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {peer && (
            <span
              aria-label={peer.is_online ? "Online" : "Offline"}
              title={peer.is_online ? "Online" : "Offline"}
              className={clsx(
                "absolute bottom-0 right-0 z-10 h-2.5 w-2.5 rounded-full border-2 border-background-shade-1",
                peer.is_online ? "bg-green-shade-1" : "bg-gray-shade-7"
              )}
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate text-sm font-semibold text-white">
            <span className="truncate">{name}</span>
            {peerIsBot && (
              <span className="flex-shrink-0 rounded-full bg-brand-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-primary">
                Bot
              </span>
            )}
          </p>
          {convo && convo.members.length > 2 && (
            <p className="truncate text-xs text-gray-shade-7">
              {convo.members.length} members
            </p>
          )}
          {peer &&
            (peer.is_online ? (
              <p className="truncate text-xs text-gray-shade-7">Online</p>
            ) : peer.last_seen_at ? (
              <p className="truncate text-xs text-gray-shade-7">
                {lastActiveLabel(peer.last_seen_at)}
              </p>
            ) : null)}
        </div>
        {convo?.is_group && (
          <GroupMenu
            convo={convo}
            myId={myId}
            onChanged={(updated) => setConvo(updated)}
            onLeft={() => router.push("/chat")}
          />
        )}
      </div>

      <div
        ref={listRef}
        onScroll={handleListScroll}
        className="customScrollbar flex-1 overflow-y-auto bg-background-shade-1 bg-[url(/images/chat-bg-with-sociaket-logo.png)] bg-cover bg-center px-4 py-4"
      >
        {loadingOlder && (
          <p className="mb-2 text-center text-xs text-gray-shade-7">
            Loading older messages…
          </p>
        )}{" "}
        {loading ? (
          // Portfolio-library fix (2026-10-29): never a blank/black pane
          // while the first batch loads — skeleton bubbles on a solid
          // background, instead of one small spinner over the dark bg image.
          <div aria-busy="true" aria-label="Loading messages">
            <p className="sr-only">Loading messages…</p>
            {[
              { mine: false, w: "w-3/5" },
              { mine: true, w: "w-1/2" },
              { mine: false, w: "w-2/5" },
              { mine: true, w: "w-3/5" },
              { mine: false, w: "w-1/2" },
            ].map((row, i) => (
              <div
                key={i}
                className={clsx(
                  "mb-3 flex",
                  row.mine ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "h-12 animate-pulse rounded-2xl bg-elevation-2",
                    row.w
                  )}
                />
              </div>
            ))}
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
              onReact={() => setReactionFor(reactionFor === m.id ? null : m.id)}
              showReactions={reactionFor === m.id}
              onPickEmoji={(emoji) => {
                setReactionFor(null);
                toggleReaction(m.id, emoji).catch((e: any) =>
                  toast.error(e?.message || "Could not react")
                );
              }}
              onReply={() => setReplyingTo(m)}
              onReplyClick={scrollToMessage}
              onOpenImage={() => {
                if (m.attachment?.kind === "image")
                  setLightbox(m.attachment.url);
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

      <div className="px-4 pb-1">
        <TypingIndicator users={typingUsers} />
      </div>
      {editing && (
        <div className="mx-4 mb-2 flex items-center justify-between rounded-lg bg-elevation-1 px-3 py-2">
          <p className="truncate text-xs text-gray-shade-7">Editing message</p>
          <div className="flex gap-2">
            <button
              className="rounded-lg bg-brand-primary px-3 py-1 text-xs font-semibold text-white"
              onClick={async () => {
                const text = draft.trim();
                if (!text) return;
                try {
                  await editMessage(editing.id, text);
                  setEditing(null);
                  setDraft("");
                } catch (e: any) {
                  toast.error(e?.message || "Could not update message");
                }
              }}
            >
              Save
            </button>
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
        </div>
      )}
      {editing && (
        <div className="border-t border-gray-shade-3 px-4 py-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const text = draft.trim();
                if (!text) return;
                editMessage(editing.id, text)
                  .then(() => {
                    setEditing(null);
                    setDraft("");
                  })
                  .catch((e: any) =>
                    toast.error(e?.message || "Could not update message")
                  );
              }
            }}
            placeholder="Edit message"
            autoFocus
            className="w-full rounded-lg bg-elevation-1 px-4 py-3 text-sm text-white focus:outline-none"
          />
        </div>
      )}
      {!editing && (
        <ChatComposer
          conversationId={chatId ?? ""}
          replyingTo={replyingTo}
          onClearReply={() => setReplyingTo(null)}
          onSent={(msg) => {
            appendMessage(msg);
            endRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          onTyping={sendTypingPing}
        />
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Full size"
            className="max-h-full max-w-full rounded-lg object-contain"
          />
          <button
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white"
          >
            ✕
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-elevation-2 p-6">
            <h3 className="text-lg font-semibold text-white">
              Delete message?
            </h3>
            <p className="mt-2 text-sm text-gray-shade-7">
              This message will be removed for everyone.
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
  onReply: () => void;
  onReplyClick: (messageId: string) => void;
  onOpenImage: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({
  message,
  mine,
  onReact,
  showReactions,
  onPickEmoji,
  onReply,
  onReplyClick,
  onOpenImage,
  onEdit,
  onDelete,
}) => {
  const isMedia = message.kind !== "text" && message.attachment;
  return (
    <div
      data-message-id={message.id}
      className={clsx(
        "group mb-3 flex",
        mine ? "justify-end" : "justify-start"
      )}
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
              ? "rounded-br-md bg-brand-primary text-white"
              : "rounded-bl-md bg-elevation-1 text-white",
            isMedia && "px-2 pt-2"
          )}
        >
          {message.reply_to && (
            <ReplyPreview
              reply={message.reply_to}
              mine={mine}
              onReplyClick={onReplyClick}
            />
          )}
          <MessageContent message={message} onOpenImage={onOpenImage} />
          <p
            className={clsx(
              "mt-1 flex items-center justify-end gap-1 text-[10px]",
              mine ? "text-white/70" : "text-gray-shade-7"
            )}
          >
            {getMessageTime(message.created_at)}
            {message.edited_at && <span className="italic">edited</span>}
            <MessageStatus status={message.status} mine={mine} />
          </p>
          <div className="absolute -top-2 right-2 hidden gap-1 group-hover:flex">
            <button
              aria-label="React"
              className="rounded-full bg-elevation-2 px-2 py-0.5 text-xs shadow"
              onClick={onReact}
            >
              🙂
            </button>
            <button
              aria-label="Reply"
              className="rounded-full bg-elevation-2 px-2 py-0.5 text-xs shadow"
              onClick={onReply}
            >
              ↩️
            </button>
            {/* Chat-grill Q14: no edit UI after the 15-minute window, and
                never on deleted messages. The server enforces this too. */}
            {mine &&
              message.kind === "text" &&
              !message.is_deleted &&
              !isEditExpired(message.created_at) && (
                <button
                  aria-label="Edit"
                  className="rounded-full bg-elevation-2 px-2 py-0.5 text-xs shadow"
                  onClick={onEdit}
                >
                  ✏️
                </button>
              )}
            {mine && !message.is_deleted && (
              <button
                aria-label="Delete"
                className="rounded-full bg-elevation-2 px-2 py-0.5 text-xs shadow"
                onClick={onDelete}
              >
                🗑️
              </button>
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
                    ? "bg-brand-primary/30 text-white"
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

SingleChat.getLayout = (page) => <ChatLayout>{page}</ChatLayout>;

export default SingleChat;
