import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import clsx from "clsx";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { SearchIcon, NewMessageIcon } from "@/assets/svgs";
import { BackButton } from "@/components/button/back-button";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import { useChatConversations } from "@/hooks/chat/useChat";
import {
  conversationAvatar,
  conversationDisplayName,
  type ChatConversation,
} from "@/lib/chat/types";
import { getDateDifferent } from "@/lib/chat/utils";
import useUser from "@/hooks/use.user";
import { axiosApi369x } from "@/utils/axios/centher-api";
import { customLog } from "@/utils/custom.log";

interface SearchedUser {
  user_id: string;
  display_name?: string | null;
  avatar_url?: string | null;
}

const ChatSidebar = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    conversations,
    loading,
    createConversation,
    deleteConversation,
    togglePin,
  } = useChatConversations();

  const [query, setQuery] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChatConversation | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const myId = user?._id ?? "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      conversationDisplayName(c, myId).toLowerCase().includes(q)
    );
  }, [conversations, query, myId]);

  const activeId = router.query.chat_id as string | undefined;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteConversation(deleteTarget.id);
      if (activeId === deleteTarget.id) router.push("/chat");
    } catch (e: any) {
      toast.error(e?.message || "Could not delete conversation");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div
      className={clsx(
        "relative min-h-[calc(100vh-60px)] w-full flex-shrink-0 border-r border-gray-shade-3 pt-2 lg:w-[384px]",
        router.pathname === AppRoutes.chat.single_chat && "hidden flg:block"
      )}
    >
      <div className="mb-6 flex items-center justify-between px-4 text-xl font-semibold text-white md:px-6">
        <BackButton className="flg:hidden" />
        <h6>Chats</h6>
        <button onClick={() => setShowNewModal(true)} aria-label="New message">
          <NewMessageIcon />
        </button>
      </div>

      {!loading && conversations.length === 0 ? (
        <div className="mx-auto w-full max-w-[340px] space-y-2 px-4 sm:px-0 lg:max-w-full lg:px-6">
          <h3 className="text-xl font-semibold leading-[24.38px] text-white sm:text-2xl sm:leading-[29.26px]">
            Send a message, get a message
          </h3>
          <p className="text-xs font-medium leading-[14.63px] text-gray-shade-7 sm:text-sm sm:leading-[17.07px]">
            Direct Messages are private conversations between you and other
            people on {process.env.NEXT_PUBLIC_BRAND_NAME}.
          </p>
          <Button
            title="Start conversation"
            variant="primary"
            className="mt-6"
            onClick={() => setShowNewModal(true)}
          />
        </div>
      ) : (
        <div className="px-6">
          <div className="focus-within:gradient-border-3 mb-3 flex h-10 w-full items-center gap-2 !rounded-xl bg-elevation-1 p-[1px]">
            <span className="ml-3">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mr-3 w-full rounded-xl border-0 bg-transparent p-0 text-sm text-white focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      )}

      <div className="scrollSetLight max-h-[calc(100vh-202px)] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Image
              src="/images/preloader.png"
              alt="Loading"
              width={48}
              height={48}
              className="h-12 w-12 object-cover"
            />
          </div>
        ) : (
          filtered.map((item) => (
            <ConversationRow
              key={item.id}
              convo={item}
              myId={myId}
              active={activeId === item.id}
              onOpen={() => router.push(`/chat/${item.id}`)}
              onTogglePin={() =>
                togglePin(item).catch((e: any) =>
                  toast.error(e?.message || "Could not update pin")
                )
              }
              onDelete={() => setDeleteTarget(item)}
            />
          ))
        )}
        {!loading && filtered.length === 0 && conversations.length > 0 && (
          <p className="px-6 py-8 text-center text-sm text-gray-shade-7">
            No conversations match your search.
          </p>
        )}
      </div>

      {showNewModal && (
        <NewConversationModal
          onClose={() => setShowNewModal(false)}
          onPick={async (pickedId) => {
            try {
              const id = await createConversation(pickedId);
              setShowNewModal(false);
              router.push(`/chat/${id}`);
            } catch (e: any) {
              toast.error(e?.message || "Could not start chat");
            }
          }}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-elevation-2 p-6">
            <h3 className="text-lg font-semibold text-white">
              Delete conversation?
            </h3>
            <p className="mt-2 text-sm text-gray-shade-7">
              This will remove the conversation for you. Messages are deleted
              for everyone once all members leave.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                title="Cancel"
                variant="secondary"
                onClick={() => setDeleteTarget(null)}
              />
              <Button
                title={deleting ? "Deleting..." : "Delete"}
                variant="primary"
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ConversationRow: React.FC<{
  convo: ChatConversation;
  myId: string;
  active: boolean;
  onOpen: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}> = ({ convo, myId, active, onOpen, onTogglePin, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const name = conversationDisplayName(convo, myId);
  const avatar = conversationAvatar(convo, myId);
  const lastAt = convo.last_message?.created_at ?? convo.created_at;

  return (
    <div
      className={clsx(
        "group relative flex cursor-pointer items-center gap-3 px-6 py-3 hover:bg-elevation-1",
        active && "bg-elevation-1"
      )}
      onClick={onOpen}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-elevation-2">
        {avatar ? (
          <Image src={avatar} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-white">
            {convo.is_pinned && <span className="mr-1">📌</span>}
            {name}
          </p>
          <span className="flex-shrink-0 text-xs text-gray-shade-7">
            {getDateDifferent(lastAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm text-gray-shade-7">
            {convo.last_message?.body ?? "No messages yet"}
          </p>
          {convo.unread_count > 0 && (
            <span className="flex h-5 min-w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
              {convo.unread_count > 99 ? "99+" : convo.unread_count}
            </span>
          )}
        </div>
      </div>
      <div className="relative flex-shrink-0">
        <button
          aria-label="Conversation options"
          className="rounded-full p-1 text-gray-shade-7 opacity-0 hover:bg-elevation-2 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setShowActions((v) => !v);
          }}
        >
          ⋯
        </button>
        {showActions && (
          <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-xl bg-elevation-2 shadow-xl">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-elevation-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(false);
                onTogglePin();
              }}
            >
              {convo.is_pinned ? "Unpin" : "Pin"}
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-elevation-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(false);
                onDelete();
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NewConversationModal: React.FC<{
  onClose: () => void;
  onPick: (userId: string) => Promise<void>;
}> = ({ onClose, onPick }) => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchedUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    const term = q.trim().replace(/[%_\\]/g, "");
    if (!term) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await axiosApi369x.get("/api/search", {
          params: { q: term, limit: 10 },
        });
        setResults(res.data?.search_results ?? []);
      } catch (e) {
        customLog(["development", "staging"], e);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-elevation-2">
        <div className="flex items-center justify-between border-b border-gray-shade-3 px-5 py-4">
          <h3 className="text-lg font-semibold text-white">New message</h3>
          <button onClick={onClose} aria-label="Close">
            <IoClose className="text-xl text-gray-shade-7" />
          </button>
        </div>
        <div className="px-5 py-4">
          <div className="flex h-10 items-center gap-2 rounded-xl bg-elevation-1 px-3">
            <SearchIcon />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search people"
              className="w-full bg-transparent text-sm text-white focus:outline-none"
            />
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto px-2 pb-4">
          {searching && (
            <p className="px-4 py-6 text-center text-sm text-gray-shade-7">
              Searching...
            </p>
          )}
          {!searching && q.trim() && results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-shade-7">
              No people found.
            </p>
          )}
          {results.map((u) => (
            <button
              key={u.user_id}
              disabled={starting !== null}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-elevation-1 disabled:opacity-50"
              onClick={async () => {
                setStarting(u.user_id);
                try {
                  // Exact case-sensitive id — never lowercased.
                  await onPick(u.user_id);
                } finally {
                  setStarting(null);
                }
              }}
            >
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-elevation-1">
                {u.avatar_url ? (
                  <Image
                    src={u.avatar_url}
                    alt={u.display_name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-semibold text-white">
                    {(u.display_name || "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="truncate text-sm font-medium text-white">
                {u.display_name || "Unnamed"}
                {starting === u.user_id && " — starting..."}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
