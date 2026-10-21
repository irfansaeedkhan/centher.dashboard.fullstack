/**
 * Post-grill client regression tests (sweep scope #3):
 *  - Q1/Q10/Q11: rich edit helpers PATCH the editor state (mentions,
 *    links, formatting survive) — old plain-text editReply stayed for
 *    the legacy wiring tests.
 *  - Q1: updateStoresWithCreatedPost puts the created reply straight
 *    into the stores from the create response — the posts-only
 *    getPostById(commentId) refetch (404 → swallowed) is gone.
 *  - Q6/Q7/Q9/Q19: single-post store — stale responses discarded,
 *    post and replies loads decoupled, 400 treated as not-found,
 *    failed first replies page is retryable.
 *  - Source contracts for the page/components (Q5, Q12 anchor, Q13,
 *    Q15, Q16, Q20, Q21).
 */
import fs from "fs";
import path from "path";

const mockPatch = jest.fn();
const mockGet = jest.fn();
const mockGetPostById = jest.fn();

jest.mock("@/utils/axios", () => ({
  axiosApi369x: {
    get: (...args: any[]) => mockGet(...args),
    post: jest.fn(),
    patch: (...args: any[]) => mockPatch(...args),
    delete: jest.fn(),
  },
}));
jest.mock("@/components/feed.components", () => ({ likePost: jest.fn() }));
jest.mock("@/lib/social-posts", () => ({
  getPostById: (...args: any[]) => mockGetPostById(...args),
}));
jest.mock("@/store/new.post.store", () => ({}));

import {
  editPostRich,
  editReplyRich,
} from "@/components/feed.components/single.post.v2/post.helpers";
import { updateStoresWithCreatedPost } from "@/components/post-editor/utils/get-post-and-update-stores";
import { useSinglePostStore } from "@/store/single.post.store";
import { useMyRepliesStore } from "@/store/my.replies.store";

const POST = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const POST_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const COMMENT = "ffffffff-ffff-4fff-8fff-ffffffffffff";

const richState: any = {
  root: {
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "hey " },
          { type: "mention", user_id: "user-peer-2", text: "@Peer" },
        ],
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

const parentPost: any = {
  _id: POST,
  status: "complete",
  text_content: "parent body",
  post_editor_state: richState,
  media: [],
  likes_count: 0,
  replies_count: 2,
  views_count: 0,
  is_liked: false,
  user: { _id: "user-peer-2", name: "Peer", username: "peer" },
};

const replyPost: any = {
  ...parentPost,
  _id: COMMENT,
  text_content: "a reply",
  replies_count: 0,
  parent_post: { _id: POST },
};

beforeEach(() => {
  jest.clearAllMocks();
  useSinglePostStore.getState().resetStore("", "idle");
  useMyRepliesStore.setState({ posts: [] } as any);
});

// ---------------------------------------------------------------------------
// Q10/Q11: rich edit helpers
// ---------------------------------------------------------------------------
describe("Q10/Q11: rich edit helpers save the editor state", () => {
  test("editReplyRich PATCHes the comments endpoint with post_editor_state", async () => {
    mockPatch.mockResolvedValue({ data: { posts: [replyPost] } });
    const saved = await editReplyRich(COMMENT, richState);
    expect(mockPatch).toHaveBeenCalledWith(`/api/socials/comments/${COMMENT}`, {
      post_editor_state: richState,
    });
    expect(saved).toEqual(replyPost);
  });

  test("editPostRich PATCHes the posts endpoint with post_editor_state", async () => {
    mockPatch.mockResolvedValue({ data: { posts: [parentPost] } });
    const saved = await editPostRich(POST, richState);
    expect(mockPatch).toHaveBeenCalledWith(`/api/socials/posts/${POST}`, {
      post_editor_state: richState,
    });
    expect(saved).toEqual(parentPost);
  });

  test("editReplyRich propagates server errors (no silent catch)", async () => {
    mockPatch.mockRejectedValue({
      response: {
        status: 400,
        data: { message: "Replies can only be edited within 15 minutes" },
      },
    });
    await expect(editReplyRich(COMMENT, richState)).rejects.toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Q1: created reply lands in the stores without a posts-endpoint refetch
// ---------------------------------------------------------------------------
describe("Q1: updateStoresWithCreatedPost", () => {
  test("the reply appears in the detail store and counts move — no refetch", async () => {
    useSinglePostStore.setState({
      postId: POST,
      posts: [parentPost],
      replies: [],
      postLoading: "loaded",
      repliesLoading: "loaded",
    } as any);
    const ok = await updateStoresWithCreatedPost({
      post: replyPost,
      parentPostId: POST,
      newPostsCount: 1,
      modalType: "reply" as any,
    });
    expect(ok).toBe(true);
    const state = useSinglePostStore.getState();
    expect(state.replies.map((r: any) => r._id)).toEqual([COMMENT]);
    expect(state.posts[0].replies_count).toBe(3);
    expect(useMyRepliesStore.getState().posts.map((p: any) => p._id)).toContain(
      COMMENT
    );
    // The bug: the old flow refetched getPostById(commentId) → 404.
    expect(mockGetPostById).not.toHaveBeenCalled();
    expect(mockGet).not.toHaveBeenCalled();
  });

  test("a top-level post (no parent) syncs trivially true", async () => {
    const ok = await updateStoresWithCreatedPost({
      post: parentPost,
      parentPostId: null,
      newPostsCount: 1,
      modalType: "new-post" as any,
    });
    expect(ok).toBe(true);
    expect(mockGetPostById).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Q6/Q7/Q9/Q19: single-post store behavior
// ---------------------------------------------------------------------------
describe("single post store resilience", () => {
  test("Q9: replies failing does not hide a post that loaded fine", async () => {
    useSinglePostStore.getState().resetStore(POST, "loading");
    mockGet.mockImplementation((url: string) =>
      url.includes("/replies")
        ? Promise.reject({ response: { status: 500 } })
        : Promise.resolve({ data: { posts: [parentPost] } })
    );
    await useSinglePostStore.getState().fetchPost(false);
    const state = useSinglePostStore.getState();
    expect(state.postLoading).toBe("loaded");
    expect(state.posts.map((p: any) => p._id)).toEqual([POST]);
    expect(state.repliesLoading).toBe("failed");
  });

  test("Q19: a 400 (invalid id shape) resolves to does-not-exist, not a spinner", async () => {
    useSinglePostStore.getState().resetStore(POST, "loading");
    mockGet.mockImplementation((url: string) =>
      url.includes("/replies")
        ? Promise.resolve({
            data: { posts: [], next_cursor: null, has_more: false },
          })
        : Promise.reject({ response: { status: 400 } })
    );
    await useSinglePostStore.getState().fetchPost(false);
    const state = useSinglePostStore.getState();
    expect(state.postLoading).toBe("loaded");
    expect(state.posts).toEqual([]);
  });

  test("Q6: a slow response for post A cannot overwrite post B", async () => {
    useSinglePostStore.getState().resetStore(POST, "loading");
    const resolvers: Array<(v: any) => void> = [];
    mockGet.mockImplementation(() => new Promise((res) => resolvers.push(res)));
    const pending = useSinglePostStore.getState().fetchPost(false);
    // User navigates to another post before A's responses land.
    useSinglePostStore.getState().resetStore(POST_B, "loading");
    resolvers.forEach((r) =>
      r({ data: { posts: [parentPost], next_cursor: null, has_more: false } })
    );
    await pending;
    const state = useSinglePostStore.getState();
    expect(state.postId).toBe(POST_B);
    expect(state.posts).toEqual([]);
  });

  test("Q9: a failed FIRST replies page can be retried for page one", async () => {
    useSinglePostStore.setState({
      postId: POST,
      repliesLoading: "failed",
      replies: [],
      repliesCursor: null,
      hasMoreReplies: true,
    } as any);
    mockGet.mockResolvedValue({
      data: { posts: [replyPost], next_cursor: null, has_more: false },
    });
    await useSinglePostStore.getState().fetchReplies();
    const state = useSinglePostStore.getState();
    expect(state.replies.map((r: any) => r._id)).toEqual([COMMENT]);
    expect(state.repliesLoading).toBe("loaded");
    const calledUrl = mockGet.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain("cursor=");
  });
});

// ---------------------------------------------------------------------------
// Source contracts (page + components)
// ---------------------------------------------------------------------------
const read = (rel: string) =>
  fs.readFileSync(path.join(process.cwd(), rel), "utf8");

describe("source contracts", () => {
  test("Q1: post-editor store syncs from the create response + honest failure", () => {
    const src = read("store/post-editor-store.ts");
    expect(src).toContain("updateStoresWithCreatedPost({");
    expect(src).toMatch(/couldn’t refresh|Please reload/);
  });

  test("Q3: the client reply guard fires before any upload", () => {
    const src = read("lib/social-posts/create-posts.ts");
    expect(src).toMatch(/Replies can.t include photos or videos yet/);
  });

  test("Q5/Q12/Q14/Q15/Q18/Q19: the detail page wiring", () => {
    const src = read("pages/post/[post_id].page.tsx");
    // Reply click deep-links to the PARENT with the reply anchor.
    expect(src).toContain("post_id: storePostId");
    expect(src).toContain("reply: reply._id");
    // Anchor effect scrolls to the anchored reply.
    expect(src).toContain("scrollIntoView");
    // Restore is wired for the main post; archived renders distinctly.
    expect(src).toContain("handleRestoreMainPost");
    expect(src).toContain("is_archived");
    // One error surface for post actions.
    expect(src).toContain("actionError");
    expect(src).toContain("setActionError");
    // Failed replies get a retry row; failed post gets a retry too.
    expect(src).toMatch(/load replies/);
    expect(src).toContain("fetchPost(!!loggedInUser)");
    // Q18: the never-rendered thread loading is gone.
    expect(src).not.toContain("threadPosts");
  });

  test("Q5: share menu targets the parent post for replies", () => {
    const src = read(
      "components/feed.components/single.post.v2/share.menu.tsx"
    );
    expect(src).toContain("parent_post");
    expect(src).toContain("?reply=");
  });

  test("Q10/Q11/Q16: card edits are rich; view counting needs a real view", () => {
    const src = read("components/feed.components/single.post.v2/main.tsx");
    expect(src).toContain("editReplyRich");
    expect(src).toContain("editPostRich");
    expect(src).toContain("RichTextInlineEditor");
    expect(src).not.toContain("components/create.post/post.modal");
    // Dwell-based view counting, not mount-based.
    expect(src).toContain("threshold: 0");
    expect(src).toMatch(/setTimeout\([\s\S]*?,\s*1000\)/);
  });

  test("Q13: archive is not offered on replies; delete copy knows the item", () => {
    const menu = read(
      "components/feed.components/single.post.v2/post.action.meu.tsx"
    );
    expect(menu).toMatch(/postType !== "reply"/);
    expect(menu).toContain("itemLabel");
    const modal = read(
      "components/feed.components/single.post.v2/delete.modal.tsx"
    );
    expect(modal).toContain("itemLabel");
    expect(modal).toContain("Escape");
    expect(modal).toContain("isDeleting");
    expect(modal).toMatch(/placeholder/);
  });

  test("Q12: mention + reply notifications deep-link with the reply id", () => {
    const src = read("pages/notifications/_components/single.notification.tsx");
    expect(src).toContain("comment_id");
    expect(src).toContain("reply: notification.comment_id");
  });

  test("Q20: back button falls back to the feed on a cold load", () => {
    const src = read("components/button/back-button.tsx");
    expect(src).toContain("history.length");
    expect(src).toContain("AppRoutes.feed.index");
  });
});
