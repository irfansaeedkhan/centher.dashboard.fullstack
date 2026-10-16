/**
 * Chat-grill Q1: attachment host allowlist.
 *
 * Files are uploaded by the browser straight to Cloudinary (unsigned
 * preset) and only *registered* via POST /chat/attachments — so the `url`
 * is attacker-controlled input. The MIME type was already allowlisted, but
 * the host was not: anyone could register `https://evil.example/pixel.png`
 * as an "image" and every recipient's browser would fetch it (IP/user-agent
 * leak), or disguise a phishing link as "invoice.pdf".
 *
 * Fix: only `https://res.cloudinary.com/*` URLs are trusted. Registration
 * rejects anything else (400); already-stored off-host rows are stripped
 * from API responses (treated as untrusted — never rendered as embeds).
 * This is the service-layer check: every client is protected, not just the
 * web UI.
 */

const TRUSTED_ATTACHMENT_HOSTS = new Set(["res.cloudinary.com"]);

/** True only for https URLs on an explicitly trusted host. */
export function isTrustedAttachmentUrl(
  raw: string | null | undefined
): boolean {
  if (!raw) return false;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  return (
    parsed.protocol === "https:" &&
    TRUSTED_ATTACHMENT_HOSTS.has(parsed.hostname.toLowerCase())
  );
}
