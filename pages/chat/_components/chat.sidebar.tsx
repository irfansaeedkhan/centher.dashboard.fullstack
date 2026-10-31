import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { chatApi } from "@/lib/chat/api";
import {
  conversationAvatar,
  conversationDisplayName,
  dmPeer,
  type ChatConversation,
  type ChatMessageSearchResult,
} from "@/lib/chat/types";
import { getDateDifferent } from "@/lib/chat/utils";
import useUser from "@/hooks/use.user";
import { axiosApi } from "@/utils/axios/sociaket-api";
import { customLog } from "@/utils/custom.log";

interface SearchedUser {
  // QA-fix: /api/search returns `_id` / `profile_image` (mapUserCard) —
  // the old `user_id` / `avatar_url` names were undefined, which made
  // createConversation send [undefined] and the API 400 "Invalid request".
  _id: string;
  display_name?: string | null;
  profile_image?: string | null;
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

  // Chat completeness Q24: with 2+ characters the search box ALSO searches
  // message bodies across my conversations (server-side; membership is the
  // boundary). Name filtering keeps working above the message results.
  const searchQuery = query.trim();
  const searchMode = searchQuery.length >= 2;
  const [msgResults, setMsgResults] = useState<ChatMessageSearchResult[]>([]);
  const [msgSearching, setMsgSearching] = useState(false);
  const [msgSearchError, setMsgSearchError] = useState<string | null>(null);
  const searchSeq = useRef(0);

  useEffect(() => {
    if (!searchMode) {
      setMsgResults([]);
      setMsgSearchError(null);
      setMsgSearching(false);
      return;
    }
    const seq = ++searchSeq.current;
    setMsgSearching(true);
    const t = setTimeout(async () => {
      try {
        const { results } = await chatApi.searchMessages(searchQuery, {
          limit: 20,
        });
        if (searchSeq.current !== seq) return;
        setMsgResults(results);
        setMsgSearchError(null);
      } catch (e: any) {
        if (searchSeq.current !== seq) return;
        setMsgResults([]);
        setMsgSearchError(e?.message || "Search failed — please try again");
      } finally {
        if (searchSeq.current === seq) setMsgSearching(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery, searchMode]);

  const convoNameForResult = (r: ChatMessageSearchResult): string => {
    const c = conversations.find((x) => x.id === r.conversation_id);
    if (c) return conversationDisplayName(c, myId);
    return r.conversation_title?.trim() || "Chat";
  };

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
            people on {"Sociaket"}.
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
          <>
            {filtered.map((item) => (
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
            ))}
            {searchMode && (
              <div className="pb-4">
                <p className="px-6 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-shade-7">
                  Messages
                </p>
                {msgSearching && (
                  <p className="px-6 py-4 text-sm text-gray-shade-7">
                    Searching messages…
                  </p>
                )}
                {msgSearchError && (
                  <p className="px-6 py-4 text-sm text-red-400">
                    {msgSearchError}
                  </p>
                )}
                {!msgSearching &&
                  !msgSearchError &&
                  msgResults.length === 0 && (
                    <p className="px-6 py-4 text-sm text-gray-shade-7">
                      No messages match &ldquo;{searchQuery}&rdquo;.
                    </p>
                  )}
                {msgResults.map((r) => (
                  <button
                    key={r.id}
                    className="block w-full px-6 py-3 text-left hover:bg-elevation-1"
                    onClick={() =>
                      router.push(
                        `/chat/${r.conversation_id}?highlight=${r.id}`
                      )
                    }
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-white">
                        {r.sender?.display_name || "Someone"}
                        <span className="font-normal text-gray-shade-7">
                          {" "}
                          · {convoNameForResult(r)}
                        </span>
                      </span>
                      <span className="flex-shrink-0 text-xs text-gray-shade-7">
                        {getDateDifferent(r.created_at)}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-gray-shade-7">
                      <HighlightedSnippet body={r.body} query={searchQuery} />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        {!loading &&
          !searchMode &&
          filtered.length === 0 &&
          conversations.length > 0 && (
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
  // Q24 presence: DM rows show the peer's online dot (rides along on the
  // member cards — no extra fetch).
  const peer = dmPeer(convo, myId);

  return (
    <div
      className={clsx(
        "group relative flex cursor-pointer items-center gap-3 px-6 py-3 hover:bg-elevation-1",
        active && "bg-elevation-1"
      )}
      onClick={onOpen}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative h-12 w-12 flex-shrink-0">
        <div className="relative h-full w-full overflow-hidden rounded-full bg-elevation-2">
          {avatar ? (
            <Image src={avatar} alt={name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {peer && (
          <span
            aria-label={peer.is_online ? "Online" : "Offline"}
            title={peer.is_online ? "Online" : "Offline"}
            className={clsx(
              "absolute bottom-0 right-0 z-10 h-3 w-3 rounded-full border-2 border-background-shade-1",
              peer.is_online ? "bg-green-shade-1" : "bg-gray-shade-7"
            )}
          />
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
            <span className="flex h-5 min-w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-brand-primary px-1 text-xs font-semibold text-white">
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

/** Q24: message-search snippet — a window around the first match, with the
 * match itself highlighted. Falls back to the head of the body. */
const HighlightedSnippet: React.FC<{ body: string; query: string }> = ({
  body,
  query,
}) => {
  const idx = body.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{body.slice(0, 90)}</>;
  const start = Math.max(0, idx - 35);
  const end = Math.min(body.length, idx + query.length + 45);
  return (
    <>
      {start > 0 ? "…" : ""}
      {body.slice(start, idx)}
      <span className="font-semibold text-brand-primary">
        {body.slice(idx, idx + query.length)}
      </span>
      {body.slice(idx + query.length, end)}
      {end < body.length ? "…" : ""}
    </>
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
        const res = await axiosApi.get("/api/search", {
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
              key={u._id}
              disabled={starting !== null}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-elevation-1 disabled:opacity-50"
              onClick={async () => {
                setStarting(u._id);
                try {
                  // Exact case-sensitive id — never lowercased.
                  await onPick(u._id);
                } finally {
                  setStarting(null);
                }
              }}
            >
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-elevation-1">
                {u.profile_image ? (
                  <Image
                    src={u.profile_image}
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
                {starting === u._id && " — starting..."}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
