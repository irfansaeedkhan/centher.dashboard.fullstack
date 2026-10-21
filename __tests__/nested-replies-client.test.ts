/**
 * Nested replies + reply likes — client tests (design §3.10 items
 * 11–14):
 *  - 11: the tree builder groups the flat server stream under true
 *    parents (roots keep server order, children oldest-first), and
 *    orphans hold at the root until their parent page arrives.
 *  - 12: collapse/expand flattening + ancestor chains for deep links.
 *  - 13: wiring — reply likes call the comment-likes endpoint (never
 *    the post-likes route with a comment id), the reply-of-reply
 *    create files the new reply into the stores.
 *  - 14: a tombstoned parent keeps its children beneath the
 *    placeholder; the post page renders the tree, not the flat list.
 */
import * as fs from "fs";
import * as path from "path";

const mockPost = jest.fn();
const mockGet = jest.fn();
const mockBarrelLikePost = jest.fn();

jest.mock("@/utils/axios", () => ({
  axiosApi369x: {
    get: (...args: any[]) => mockGet(...args),
    post: (...args: any[]) => mockPost(...args),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("@/components/feed.components", () => ({
  likePost: (...args: any[]) => mockBarrelLikePost(...args),
}));
jest.mock("@/lib/social-posts", () => ({
  getPostById: jest.fn(),
}));
jest.mock("@/store/new.post.store", () => ({}));

import {
  MAX_THREAD_INDENT_DEPTH,
  ancestorChainIds,
  buildReplyTree,
  flattenVisibleReplies,
} from "@/components/feed.components/single.post.v2/reply.tree";
import { likeComment } from "@/components/feed.components/single.post.v2/post.helpers";
import { updateStoresWithCreatedPost } from "@/components/post-editor/utils/get-post-and-update-stores";
import { useSinglePostStore } from "@/store/single.post.store";
import { useMyRepliesStore } from "@/store/my.replies.store";

const POST = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const R1 = "11111111-1111-4111-8111-111111111111";
const R2 = "22222222-2222-4222-8222-222222222222";
const C1 = "33333333-3333-4333-8333-333333333333";
const C2 = "44444444-4444-4444-8444-444444444444";
const C3 = "55555555-5555-4555-8555-555555555555";
const COMMENT = "ffffffff-ffff-4fff-8fff-ffffffffffff";
const NEW_REPLY = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

const row = (
  id: string,
  parent: string | null,
  createdAt: string,
  over: any = {}
) =>
  ({
    _id: id,
    parent_comment_id: parent,
    createdAt,
    replies_count: 0,
    likes_count: 0,
    liked_by_loggedin_user: false,
    status: "complete",
    ...over,
  } as any);

// Server stream order is newest-first across ALL depths.
const stream = () => [
  row(C3, C1, "2026-10-21T10:03:00Z"),
  row(C2, R1, "2026-10-21T10:02:00Z"),
  row(R2, null, "2026-10-21T10:01:30Z"),
  row(C1, R1, "2026-10-21T10:01:00Z"),
  row(R1, null, "2026-10-21T10:00:00Z"),
];

beforeEach(() => {
  jest.clearAllMocks();
  mockPost.mockResolvedValue({ data: {} });
  mockBarrelLikePost.mockResolvedValue(undefined);
});

describe("11. buildReplyTree", () => {
  test("roots keep server order; children group under their true parent, oldest-first", () => {
    const tree = buildReplyTree(stream());
    expect(tree.map((n) => n.reply._id)).toEqual([R2, R1]);
    const r1 = tree[1];
    expect(r1.depth).toBe(0);
    expect(r1.children.map((n) => n.reply._id)).toEqual([C1, C2]);
    expect(r1.children[0].depth).toBe(1);
    expect(r1.children[0].children.map((n) => n.reply._id)).toEqual([C3]);
    expect(r1.children[0].children[0].depth).toBe(2);
  });

  test("orphan (parent not yet paged in) holds at the root, then re-attaches", () => {
    const withoutParent = stream().filter((r) => r._id !== R1);
    const orphanTree = buildReplyTree(withoutParent);
    const c2 = orphanTree.find((n) => n.reply._id === C2);
    expect(c2).toBeDefined();
    expect(c2!.depth).toBe(0);
    expect(c2!.orphan).toBe(true);

    const full = buildReplyTree(stream());
    const r1 = full.find((n) => n.reply._id === R1)!;
    const attached = r1.children.find((n) => n.reply._id === C2)!;
    expect(attached.orphan).toBe(false);
    expect(attached.depth).toBe(1);
  });
});

describe("12. collapse/expand + ancestor chains", () => {
  test("flattenVisibleReplies reveals children only when expanded", () => {
    const tree = buildReplyTree(stream());
    const collapsed = flattenVisibleReplies(tree, new Set());
    expect(collapsed.map((r) => r.reply._id)).toEqual([R2, R1]);
    expect(collapsed[1].childCount).toBe(2);
    expect(collapsed[1].expanded).toBe(false);

    const oneOpen = flattenVisibleReplies(tree, new Set([R1]));
    expect(oneOpen.map((r) => r.reply._id)).toEqual([R2, R1, C1, C2]);

    const bothOpen = flattenVisibleReplies(tree, new Set([R1, C1]));
    expect(bothOpen.map((r) => r.reply._id)).toEqual([R2, R1, C1, C3, C2]);
    expect(bothOpen.find((r) => r.reply._id === C3)!.depth).toBe(2);
  });

  test("ancestorChainIds walks to the root, root-first, excluding the target", () => {
    expect(ancestorChainIds(stream(), C3)).toEqual([R1, C1]);
    expect(ancestorChainIds(stream(), R1)).toEqual([]);
    expect(ancestorChainIds(stream(), "missing-id")).toEqual([]);
  });

  test("indent cap constant is 4 (design §3.5 mobile guardrail)", () => {
    expect(MAX_THREAD_INDENT_DEPTH).toBe(4);
  });
});

describe("13. like wiring", () => {
  test("likeComment posts to the comment-likes endpoint with the comment id", async () => {
    await likeComment(COMMENT, "like");
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith(
      "/api/socials/analytics/comment-likes",
      { commentId: COMMENT, actionType: "like" }
    );
  });

  test("single-post store: a reply like hits comment-likes, never the post-likes route", async () => {
    useSinglePostStore.setState({
      postId: POST,
      replies: [row(COMMENT, null, "2026-10-21T10:00:00Z")],
      posts: [],
    });
    await useSinglePostStore.getState().likePostAPI(COMMENT, "like", "reply");
    expect(mockPost).toHaveBeenCalledWith(
      "/api/socials/analytics/comment-likes",
      { commentId: COMMENT, actionType: "like" }
    );
    expect(mockBarrelLikePost).not.toHaveBeenCalled();
    const reply = useSinglePostStore
      .getState()
      .replies.find((r) => r._id === COMMENT)!;
    expect(reply.likes_count).toBe(1);
    expect(reply.liked_by_loggedin_user).toBe(true);
  });

  test("single-post store: a failed reply like rolls back AND rethrows (readable surface)", async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { message: "This reply has been deleted" } },
    });
    useSinglePostStore.setState({
      postId: POST,
      replies: [row(COMMENT, null, "2026-10-21T10:00:00Z")],
      posts: [],
    });
    await expect(
      useSinglePostStore.getState().likePostAPI(COMMENT, "like", "reply")
    ).rejects.toBeTruthy();
    const reply = useSinglePostStore
      .getState()
      .replies.find((r) => r._id === COMMENT)!;
    expect(reply.likes_count).toBe(0);
    expect(reply.liked_by_loggedin_user).toBe(false);
  });

  test("reply-of-reply create files the new reply into the stores + bumps counts", () => {
    const parentReply = row(COMMENT, null, "2026-10-21T10:00:00Z", {
      parent_post: { _id: POST },
    });
    const rootPost = row(POST, null, "2026-10-21T09:00:00Z", {
      replies_count: 2,
    });
    const newReply = row(NEW_REPLY, COMMENT, "2026-10-21T10:05:00Z", {
      parent_post: { _id: POST },
    });
    useSinglePostStore.setState({
      postId: POST,
      posts: [rootPost],
      replies: [parentReply],
      newlyAddedReplyId: null,
    });
    useMyRepliesStore.setState({ posts: [parentReply] });

    const ok = updateStoresWithCreatedPost({
      post: newReply,
      parentPostId: COMMENT,
      newPostsCount: 1,
      modalType: "reply-of-reply",
    });
    expect(ok).toBe(true);

    const single = useSinglePostStore.getState();
    expect(single.replies.map((r) => r._id)).toContain(NEW_REPLY);
    expect(single.newlyAddedReplyId).toBe(NEW_REPLY);
    expect(single.replies.find((r) => r._id === COMMENT)!.replies_count).toBe(
      1
    );
    expect(single.posts.find((p) => p._id === POST)!.replies_count).toBe(3);
    expect(useMyRepliesStore.getState().posts.map((p) => p._id)).toContain(
      NEW_REPLY
    );
  });
});

describe("14. tombstones + page wiring (source contracts)", () => {
  test("a tombstoned parent keeps its children in the tree", () => {
    const rows = [
      row(C1, R1, "2026-10-21T10:01:00Z"),
      row(R1, null, "2026-10-21T10:00:00Z", { status: "deleted" }),
    ];
    const tree = buildReplyTree(rows);
    expect(tree).toHaveLength(1);
    expect(tree[0].reply.status).toBe("deleted");
    expect(tree[0].children.map((n) => n.reply._id)).toEqual([C1]);
  });

  const pageSrc = fs.readFileSync(
    path.join(process.cwd(), "pages/post/[post_id].page.tsx"),
    "utf8"
  );

  test("post page renders the tree (not the old flat replies.map)", () => {
    expect(pageSrc).toContain("buildReplyTree");
    expect(pageSrc).toContain("flattenVisibleReplies");
    expect(pageSrc).toContain("visibleReplyRows.map");
    expect(pageSrc).not.toContain("{replies.map(");
    expect(pageSrc).toContain("MAX_THREAD_INDENT_DEPTH");
    expect(pageSrc).toContain("View replies (");
    expect(pageSrc).toContain("ancestorChainIds");
    // The reply button still opens reply-of-reply with the comment id.
    expect(pageSrc).toContain('modalType: "reply-of-reply"');
    expect(pageSrc).toContain("parentPostId: reply._id");
  });

  test("stores route reply likes to likeComment (source contract)", () => {
    const single = fs.readFileSync(
      path.join(process.cwd(), "store/single.post.store.ts"),
      "utf8"
    );
    expect(single).toContain("likeComment(postId, actionType)");
    expect(single).toContain('postType === "reply"');
    const mine = fs.readFileSync(
      path.join(process.cwd(), "store/my.replies.store.ts"),
      "utf8"
    );
    expect(mine).toContain("await likeComment(postId, actionType)");
    expect(mine).not.toContain("await likePost(postId, actionType)");
  });
});
