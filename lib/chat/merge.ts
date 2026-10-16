/**
 * Chat-grill Q7: poll/pagination merge for the message list.
 *
 * The 5s poll used to `setMessages(list)` (full replace). A poll response
 * that started *before* my send completed would return the pre-send list
 * and wipe my just-sent (optimistically appended) message for 5s —
 * "did it send?" → users re-sent → duplicates.
 *
 * Now the poll merges by id:
 * - incoming messages upsert (edits, status changes, soft-delete
 *   placeholders all flow through);
 * - my own messages that the poll doesn't know about yet are kept
 *   (optimistic / in-flight sends);
 * - my older messages outside the poll window are kept (pagination);
 * - anyone else's message that is *inside* the window's time range but
 *   missing from the fresh list was deleted → dropped.
 *
 * Pure function — heavily unit-tested.
 */
import type { ChatMessage } from "./types";

const ts = (m: ChatMessage) => +new Date(m.created_at);

export function mergeMessages(
  prev: ChatMessage[],
  incoming: ChatMessage[],
  myId: string
): ChatMessage[] {
  if (incoming.length === 0) return prev;
  const oldestIncoming = ts(incoming[0]);
  const incomingIds = new Set(incoming.map((m) => m.id));
  const merged = new Map<string, ChatMessage>();
  for (const m of prev) merged.set(m.id, m);
  for (const m of incoming) merged.set(m.id, m);

  const out: ChatMessage[] = [];
  for (const m of merged.values()) {
    if (incomingIds.has(m.id)) {
      out.push(m);
      continue;
    }
    // Not in the fresh list.
    if (m.sender_id === myId) {
      out.push(m); // optimistic / mine: keep
      continue;
    }
    if (ts(m) <= oldestIncoming) {
      out.push(m); // older than the window: outside it, keep
      continue;
    }
    // Peer's message inside the window range but gone from the server
    // list → deleted. Drop it.
  }
  out.sort((a, b) => ts(a) - ts(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return out;
}

/** Prepend an older page (scroll-up, Q13), deduplicated by id. */
export function prependOlder(
  prev: ChatMessage[],
  older: ChatMessage[]
): ChatMessage[] {
  if (older.length === 0) return prev;
  const seen = new Set(prev.map((m) => m.id));
  const fresh = older.filter((m) => !seen.has(m.id));
  const out = [...fresh, ...prev];
  out.sort((a, b) => ts(a) - ts(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return out;
}
