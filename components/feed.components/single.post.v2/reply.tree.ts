import type { CompletedPost } from "@/models/post";

/**
 * Nested replies (2026-10-21, design §3.3/§3.5): the server keeps ONE
 * flat, keyset-paginated stream of every comment on a post; the tree
 * is assembled here, client-side, from each row's true
 * `parent_comment_id` (X does the same shape — one flat conversation
 * stream, client builds the tree).
 *
 * Rendering model (Irfan's call): X-style deep nesting with thread
 * lines. Level-0 replies keep the server's order (newest first);
 * children under each parent read oldest-first (conversation flow).
 * Indentation grows one step per depth up to MAX_THREAD_INDENT_DEPTH;
 * deeper rows keep that indent (storage depth is uncapped).
 */
export const MAX_THREAD_INDENT_DEPTH = 4;

export interface ReplyTreeNode {
  reply: CompletedPost;
  depth: number;
  /**
   * True when this row's parent comment is not in the loaded set
   * (paged in later, or gone). Orphans render at the top of their
   * loaded subtree with the "Replying to @name" prefix so the
   * addressee is never ambiguous; they re-attach automatically once
   * the parent's page loads and the tree is rebuilt.
   */
  orphan: boolean;
  children: ReplyTreeNode[];
}

const byCreatedThenId = (a: CompletedPost, b: CompletedPost): number => {
  const ta = Date.parse(a.createdAt);
  const tb = Date.parse(b.createdAt);
  if (!Number.isNaN(ta) && !Number.isNaN(tb) && ta !== tb) return ta - tb;
  if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
  return a._id < b._id ? -1 : a._id > b._id ? 1 : 0;
};

export const buildReplyTree = (replies: CompletedPost[]): ReplyTreeNode[] => {
  const byId = new Map<string, CompletedPost>();
  for (const reply of replies) {
    if (!byId.has(reply._id)) byId.set(reply._id, reply);
  }

  const childrenOf = new Map<string, CompletedPost[]>();
  const roots: CompletedPost[] = [];
  for (const reply of byId.values()) {
    const parentId = reply.parent_comment_id ?? null;
    if (parentId && parentId !== reply._id && byId.has(parentId)) {
      const siblings = childrenOf.get(parentId) ?? [];
      siblings.push(reply);
      childrenOf.set(parentId, siblings);
    } else {
      // Top-level reply, or an orphan whose parent isn't loaded yet.
      roots.push(reply);
    }
  }
  for (const siblings of childrenOf.values()) siblings.sort(byCreatedThenId);

  const seen = new Set<string>();
  const assemble = (
    reply: CompletedPost,
    depth: number,
    orphan: boolean
  ): ReplyTreeNode => {
    seen.add(reply._id);
    const children = (childrenOf.get(reply._id) ?? [])
      .filter((child) => !seen.has(child._id))
      .map((child) => assemble(child, depth + 1, false));
    return { reply, depth, orphan, children };
  };

  // Roots keep the server's stream order (newest first) — the input
  // order — so level 0 renders exactly as the flat list always has.
  return roots
    .filter((reply) => !seen.has(reply._id))
    .map((reply) => assemble(reply, 0, !!(reply.parent_comment_id ?? null)));
};

export interface VisibleReplyRow {
  reply: CompletedPost;
  depth: number;
  orphan: boolean;
  /** Direct children in the loaded tree (what expansion reveals). */
  childCount: number;
  expanded: boolean;
}

/**
 * Depth-first flattening for rendering: a node's children appear only
 * when the node is in `expandedIds`. Collapsed branches keep their
 * "View replies (N)" toggle (N = the reply's direct reply_count).
 */
export const flattenVisibleReplies = (
  nodes: ReplyTreeNode[],
  expandedIds: ReadonlySet<string>
): VisibleReplyRow[] => {
  const out: VisibleReplyRow[] = [];
  const walk = (node: ReplyTreeNode) => {
    const expanded = expandedIds.has(node.reply._id);
    out.push({
      reply: node.reply,
      depth: node.depth,
      orphan: node.orphan,
      childCount: node.children.length,
      expanded,
    });
    if (expanded) node.children.forEach(walk);
  };
  nodes.forEach(walk);
  return out;
};

/**
 * The ancestor chain of a reply within the loaded set, root-first,
 * excluding the reply itself. Expanding exactly these ids reveals the
 * reply (deep-link landing + "your new reply appears" both use it).
 * Stops at the highest loaded ancestor when the chain is paged.
 */
export const ancestorChainIds = (
  replies: CompletedPost[],
  targetId: string
): string[] => {
  const byId = new Map(replies.map((r) => [r._id, r]));
  const chain: string[] = [];
  const guard = new Set<string>([targetId]);
  let current = byId.get(targetId);
  while (current?.parent_comment_id) {
    const parentId = current.parent_comment_id;
    if (guard.has(parentId)) break;
    guard.add(parentId);
    const parent = byId.get(parentId);
    if (!parent) break;
    chain.unshift(parentId);
    current = parent;
  }
  return chain;
};
