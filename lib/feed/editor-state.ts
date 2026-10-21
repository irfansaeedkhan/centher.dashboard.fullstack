/**
 * Feed-grill Q1: stored-XSS guard for post editor state.
 *
 * `POST /socials/posts` and `PATCH /socials/posts/:id` used to accept
 * `post_editor_state: z.any()` and persist it verbatim. The renderer turns
 * lexical `link` nodes into `<Link href={node.url}>`, and Next.js does not
 * sanitize hrefs — so anyone with curl could store
 * `{type:"link", url:"javascript:alert(document.cookie)"}` and run script
 * in the app origin for every viewer who clicked.
 *
 * Fix, two layers:
 *  1. Write time (this module): `sanitizeEditorState` walks the lexical
 *     tree and *unwraps* any link node whose URL is not http/https — the
 *     link's children (its visible text) stay, the dangerous href is gone.
 *     Unwrapping instead of rejecting keeps the author's words intact
 *     (the user is never stranded with a failed post over one bad link).
 *  2. Render time: `post.text.content.tsx` re-checks with `safeHttpUrl`
 *     and renders non-http(s) or unparseable URLs as plain text, so rows
 *     stored before this fix can't crash or exploit the renderer either
 *     (feed-grill Q2: `new URL("::::")` used to throw mid-render).
 */

const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:"]);

/** True only for absolute http/https URLs. */
export function isSafeLinkUrl(raw: unknown): boolean {
  return safeHttpUrl(raw) !== null;
}

/** The URL string when it parses and is http/https, else null. */
export function safeHttpUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length === 0) return null;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  return SAFE_LINK_PROTOCOLS.has(parsed.protocol) ? raw : null;
}

type LexicalNode = {
  type?: string;
  url?: unknown;
  text?: unknown;
  children?: unknown;
  [key: string]: unknown;
};

/**
 * Plain-text extraction from a serialized editor state — the client
 * twin of the server's extractor (same node set, same join). Used by
 * the post-grill edit flows to run the "post can't be empty" check
 * against the rich draft instead of a flattened string.
 */
export function extractTextFromEditorState(state: unknown): string {
  const texts: string[] = [];
  const walk = (nodes: unknown) => {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (!isNode(node)) continue;
      if (
        (node.type === "text" ||
          node.type === "hashtag" ||
          node.type === "mention" ||
          node.type === "link") &&
        typeof node.text === "string"
      ) {
        texts.push(node.text);
      }
      if (node.children) walk(node.children);
    }
  };
  walk((state as { root?: { children?: unknown } } | null)?.root?.children);
  return texts.join(" ").trim();
}

const isNode = (v: unknown): v is LexicalNode =>
  !!v && typeof v === "object" && !Array.isArray(v);

/**
 * Deep-sanitize a lexical editor state. Returns a new tree (input is not
 * mutated) where every `link` node with a non-http(s) URL is replaced by
 * its own children — text survives, the href does not. Non-object input is
 * returned unchanged (callers already gate on `state.root`).
 */
export function sanitizeEditorState<T>(state: T): T {
  if (!isNode(state)) return state;
  const clone: LexicalNode = { ...(state as LexicalNode) };
  if (isNode(clone.root)) {
    clone.root = {
      ...(clone.root as LexicalNode),
      children: sanitizeNodeList((clone.root as LexicalNode).children),
    };
  }
  return clone as T;
}

function sanitizeNodeList(nodes: unknown): unknown {
  if (!Array.isArray(nodes)) return nodes;
  const out: unknown[] = [];
  for (const node of nodes) {
    if (!isNode(node)) {
      out.push(node);
      continue;
    }
    const children = sanitizeNodeList(node.children);
    if (node.type === "link" && !isSafeLinkUrl(node.url)) {
      // Unwrap: keep the (sanitized) children, drop the link itself.
      if (Array.isArray(children)) out.push(...children);
      continue;
    }
    out.push({ ...node, children });
  }
  return out;
}
