import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { SearchIcon } from "@/assets/svgs";
import { chatApi } from "@/lib/chat/api";
import {
  memberUserId,
  type ChatConversation,
  type ChatMember,
} from "@/lib/chat/types";
import { axiosApi } from "@/utils/axios/sociaket-api";
import { customLog } from "@/utils/custom.log";

/**
 * Chat completeness Q26: group lifecycle UI — rename, add members, remove
 * members (creator-only for others), leave group. One escapable panel:
 * overlay click, ✕ and Escape all close it; every action shows a loading
 * state and a readable failure (toast), never a console-only error.
 */
export const GroupMenu: React.FC<{
  convo: ChatConversation;
  myId: string;
  onChanged: (convo: ChatConversation) => void;
  onLeft: () => void;
}> = ({ convo, myId, onChanged, onLeft }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Group settings"
        className="ml-auto flex-shrink-0 rounded-full px-2 py-1 text-lg text-gray-shade-7 hover:bg-elevation-1 hover:text-white"
        onClick={() => setOpen(true)}
      >
        ⋯
      </button>
      {open && (
        <GroupSettingsModal
          convo={convo}
          myId={myId}
          onClose={() => setOpen(false)}
          onChanged={onChanged}
          onLeft={() => {
            setOpen(false);
            onLeft();
          }}
        />
      )}
    </>
  );
};

const GroupSettingsModal: React.FC<{
  convo: ChatConversation;
  myId: string;
  onClose: () => void;
  onChanged: (convo: ChatConversation) => void;
  onLeft: () => void;
}> = ({ convo, myId, onClose, onChanged, onLeft }) => {
  const [title, setTitle] = useState(convo.title ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const iAmCreator = convo.created_by === myId;

  const run = async (
    key: string,
    fn: () => Promise<void>,
    successMsg: string
  ) => {
    setBusy(key);
    try {
      await fn();
      toast.success(successMsg);
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong — please try again");
    } finally {
      setBusy(null);
    }
  };

  const handleRename = () =>
    run(
      "rename",
      async () => {
        const updated = await chatApi.renameConversation(
          convo.id,
          title.trim()
        );
        onChanged(updated);
      },
      "Group renamed"
    );

  const handleRemove = (member: ChatMember) =>
    run(
      `remove-${memberUserId(member)}`,
      async () => {
        const updated = await chatApi.removeMember(
          convo.id,
          memberUserId(member)
        );
        if ("id" in updated) onChanged(updated);
      },
      "Member removed"
    );

  const handleLeave = () =>
    run(
      "leave",
      async () => {
        await chatApi.removeMember(convo.id, myId);
        onLeft();
      },
      "You left the group"
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-elevation-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-shade-3 px-5 py-4">
          <h3 className="text-lg font-semibold text-white">Group settings</h3>
          <button onClick={onClose} aria-label="Close">
            <IoClose className="text-xl text-gray-shade-7" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-4">
          {/* Rename */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-shade-7">
              Group name
            </label>
            <div className="flex gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Group name"
                maxLength={100}
                className="h-10 w-full rounded-xl bg-elevation-1 px-3 text-sm text-white focus:outline-none"
              />
              <button
                disabled={
                  busy !== null ||
                  !title.trim() ||
                  title.trim() === (convo.title ?? "").trim()
                }
                onClick={handleRename}
                className="h-10 flex-shrink-0 rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy === "rename" ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          {/* Add members */}
          <AddMembers convo={convo} onAdded={(updated) => onChanged(updated)} />

          {/* Members */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-shade-7">
              Members · {convo.members.length}
            </p>
            <div className="space-y-1">
              {convo.members.map((m) => {
                const mid = memberUserId(m);
                const isMe = mid === myId;
                const isCreator = convo.created_by === mid;
                const canRemove = !isMe && iAmCreator;
                return (
                  <div
                    key={mid}
                    className="flex items-center gap-3 rounded-xl px-2 py-2"
                  >
                    <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-elevation-1">
                      {m.profile_image || m.avatar_url ? (
                        <Image
                          src={(m.profile_image || m.avatar_url) as string}
                          alt={m.display_name || "Member"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                          {(m.display_name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                      {m.display_name || "Someone"}
                      {isMe && (
                        <span className="text-gray-shade-7"> (you)</span>
                      )}
                      {isCreator && (
                        <span className="ml-2 rounded-full bg-brand-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-primary">
                          Creator
                        </span>
                      )}
                    </span>
                    {canRemove && (
                      <button
                        disabled={busy !== null}
                        onClick={() => handleRemove(m)}
                        className="flex-shrink-0 rounded-lg bg-elevation-1 px-3 py-1 text-xs text-red-400 hover:bg-elevation-2 disabled:opacity-50"
                      >
                        {busy === `remove-${mid}` ? "Removing…" : "Remove"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {!iAmCreator && (
              <p className="mt-2 text-xs text-gray-shade-7">
                Only the group creator can remove other members.
              </p>
            )}
          </div>

          {/* Leave */}
          <div className="border-t border-gray-shade-3 pt-4">
            {confirmLeave ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-white">Leave this group?</p>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg bg-elevation-1 px-3 py-1.5 text-sm text-white"
                    onClick={() => setConfirmLeave(false)}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={busy !== null}
                    onClick={handleLeave}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {busy === "leave" ? "Leaving…" : "Leave"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmLeave(true)}
                className="text-sm font-medium text-red-400 hover:text-red-300"
              >
                Leave group
              </button>
            )}
            {iAmCreator && (
              <p className="mt-2 text-xs text-gray-shade-7">
                You created this group — if you leave, ownership passes to the
                longest-standing member.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SearchedUser {
  _id: string;
  display_name?: string | null;
  profile_image?: string | null;
}

const AddMembers: React.FC<{
  convo: ChatConversation;
  onAdded: (convo: ChatConversation) => void;
}> = ({ convo, onAdded }) => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchedUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const memberIds = new Set(convo.members.map((m) => memberUserId(m)));

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

  const add = async (userId: string) => {
    setAddingId(userId);
    try {
      const updated = await chatApi.addMembers(convo.id, [userId]);
      onAdded(updated);
      toast.success("Member added");
    } catch (e: any) {
      toast.error(e?.message || "Could not add member");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-shade-7">
        Add members
      </label>
      <div className="flex h-10 items-center gap-2 rounded-xl bg-elevation-1 px-3">
        <SearchIcon />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search people"
          className="w-full bg-transparent text-sm text-white focus:outline-none"
        />
      </div>
      <div className="mt-1 max-h-56 overflow-y-auto">
        {searching && (
          <p className="px-2 py-4 text-center text-sm text-gray-shade-7">
            Searching…
          </p>
        )}
        {!searching && q.trim() && results.length === 0 && (
          <p className="px-2 py-4 text-center text-sm text-gray-shade-7">
            No people found.
          </p>
        )}
        {results.map((u) => {
          const already = memberIds.has(u._id);
          return (
            <div
              key={u._id}
              className="flex items-center gap-3 rounded-xl px-2 py-2"
            >
              <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-elevation-1">
                {u.profile_image ? (
                  <Image
                    src={u.profile_image}
                    alt={u.display_name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                    {(u.display_name || "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                {u.display_name || "Unnamed"}
              </span>
              <button
                disabled={already || addingId !== null}
                onClick={() => add(u._id)}
                className="flex-shrink-0 rounded-lg bg-brand-primary px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
              >
                {already ? "Added" : addingId === u._id ? "Adding…" : "Add"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
