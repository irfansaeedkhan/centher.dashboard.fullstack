/**
 * Feed-grill Q3 + Q16 + Q15: post media trust, typing, and removal.
 *
 * Q3 — `POST /socials/posts` accepted any `https://` string as media and
 * rendered it as `<img>` for every viewer (tracking-pixel / IP leak). The
 * host allowlist now reuses the chat-grill check (`isTrustedAttachmentUrl`
 * in `@/lib/chat/attachments`): only `https://res.cloudinary.com/*` —
 * the client uploads straight to Cloudinary, so a post-media URL that
 * didn't come from Cloudinary is not legitimate.
 *
 * Q16 — the DB stored media as bare URL strings and `mapPostRow` hardcoded
 * `type: "image"`, so videos rendered as broken `<img>`s. Media is now
 * persisted as `{ url, type }` objects (type from the client's MIME at
 * upload time) and `normalizePostMedia` upgrades legacy string rows by
 * inferring the kind from the URL — Cloudinary URLs carry the resource
 * type in the path (`/video/upload/…`), and file extensions cover the
 * rest.
 *
 * Q15 — `PATCH /socials/posts/:id` parsed `deleted_media` and then never
 * read it, so "removed" photos kept rendering. `withoutDeletedMedia`
 * applies the removal list to the stored media so an edit actually
 * deletes the rows (Cloudinary-side asset deletion is a follow-up — the
 * removed URL stops rendering everywhere immediately).
 */

export type PostMediaKind = "image" | "video";

export interface StoredPostMedia {
  url: string;
  type: PostMediaKind;
}

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv"];

/** Infer media kind from a URL: Cloudinary path segment, then extension. */
export function mediaKindForUrl(url: string): PostMediaKind {
  const lower = url.toLowerCase();
  if (lower.includes("/video/upload/")) return "video";
  const path = lower.split(/[?#]/)[0];
  return VIDEO_EXTENSIONS.some((ext) => path.endsWith(ext)) ? "video" : "image";
}

/** Infer media kind from a client-supplied MIME type, if it declares one. */
export function mediaKindForMime(mime: unknown): PostMediaKind | null {
  if (typeof mime !== "string") return null;
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  return null;
}

/**
 * Normalize the `posts.media_urls` jsonb (legacy `string[]`, new
 * `{url,type}[]`, or a mix) into `{ url, type }` objects. Junk entries
 * are dropped.
 */
export function normalizePostMedia(raw: unknown): StoredPostMedia[] {
  if (!Array.isArray(raw)) return [];
  const out: StoredPostMedia[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      // Legacy rows are bare URLs (the old write path only ever stored
      // https:// strings) — anything else is junk, not media.
      if (item.startsWith("https://") || item.startsWith("http://"))
        out.push({ url: item, type: mediaKindForUrl(item) });
      continue;
    }
    if (item && typeof item === "object") {
      const rec = item as { url?: unknown; type?: unknown };
      const url =
        typeof rec.url === "string"
          ? rec.url
          : typeof (rec as { object_name?: unknown }).object_name === "string"
          ? ((rec as { object_name: string }).object_name as string)
          : "";
      if (!url.startsWith("https://") && !url.startsWith("http://")) continue;
      const type =
        rec.type === "video" || rec.type === "image"
          ? (rec.type as PostMediaKind)
          : mediaKindForMime(rec.type) ?? mediaKindForUrl(url);
      out.push({ url, type });
    }
  }
  return out;
}

/** Q15: drop every stored media item whose URL the edit marked deleted. */
export function withoutDeletedMedia(
  raw: unknown,
  deletedUrls: string[]
): StoredPostMedia[] {
  const deleted = new Set(deletedUrls);
  return normalizePostMedia(raw).filter((m) => !deleted.has(m.url));
}
