/**
 * Feed product call Q23 (Irfan approved 2026-10-21): @mention
 * notifications — the notify half was never built. The composer stored
 * mention nodes and the renderer linked them, but nobody was ever told.
 *
 * Extraction mirrors the renderer (`post.text.content.tsx`): mention
 * nodes in the lexical tree are `{ type: "mention", user_id, text }` —
 * the same walk `extractTextFromEditorState` does server-side. No second
 * parser: plain-text bodies have no mention nodes (exactly like the
 * renderer shows no mention links for them), so they notify nobody.
 */

/** Unique user ids mentioned in an editor state, in first-seen order. */
export function extractMentionUserIds(state: unknown): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const walk = (nodes: unknown) => {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const n = node as {
        type?: string;
        user_id?: unknown;
        children?: unknown;
      };
      if (
        n.type === "mention" &&
        typeof n.user_id === "string" &&
        n.user_id.length > 0 &&
        !seen.has(n.user_id)
      ) {
        seen.add(n.user_id);
        ids.push(n.user_id);
      }
      if (n.children) walk(n.children);
    }
  };
  const root = (state as { root?: { children?: unknown } } | null)?.root;
  walk(root?.children);
  return ids;
}
