/**
 * Phase 5: chat client library. Pure helpers moved out of the deleted
 * ProductLive adapter (`live/`), plus the REST API client for /api/chat/*.
 */

/** Case-insensitive id comparison (Better Auth ids are case-sensitive in
 * storage, but legacy call sites lowercased them — compare safely). */
export function eqId(a: unknown, b: unknown): boolean {
  if (typeof a === "string" && typeof b === "string") {
    return a.toLowerCase() === b.toLowerCase();
  }
  return a === b;
}

/** Legacy alias — blockchain address comparison used across staking/marketplace. */
export const eqAddress = eqId;

const twoMinutesAgo = 2 * 60;
const oneHourAgo = 60 * 60;
const oneDayAgo = 24 * 60 * 60;
const tenDaysAgo = 10 * oneDayAgo;

export function getDateDifferent(dateTime: unknown): string {
  if (!dateTime) return "";
  const dt = new Date(dateTime as string);
  const distance = Math.floor(+new Date() / 1000) - Math.floor(+dt / 1000);
  if (distance < twoMinutesAgo) return "Just Now";
  if (distance > tenDaysAgo) return dt.toDateString();
  if (distance <= oneHourAgo) return `${Math.floor(distance / 60)} m`;
  if (distance <= oneDayAgo) return `${Math.floor(distance / oneHourAgo)} h`;
  return `${Math.floor(distance / oneDayAgo)} d`;
}

export function getMessageTime(dateTime: unknown): string {
  if (!dateTime) return "";
  const dt = new Date(dateTime as string);
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Chat-grill Q14: the edit window is 15 minutes (Irfan's product call).
 * True when a message is too old to edit — the server enforces this too;
 * the client uses it to hide the edit button.
 */
export const EDIT_WINDOW_MS = 15 * 60 * 1000;

export function isEditExpired(
  createdAt: unknown,
  now: number = Date.now()
): boolean {
  if (!createdAt) return true;
  return now - +new Date(createdAt as string) > EDIT_WINDOW_MS;
}

/** Chat-grill Q3: canonical dedup key for a 1-on-1 pair (order-free). */
export function dmPairKey(a: string, b: string): string {
  return `dm:${[a, b].sort().join(":")}`;
}

/** Linkify URLs in a message body (escaped by React on render). */
export function urlify(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) =>
      `<a style="color:lightblue;" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
}
