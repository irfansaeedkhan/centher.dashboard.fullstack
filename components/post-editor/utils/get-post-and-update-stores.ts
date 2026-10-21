import { getPostById } from "@/lib/social-posts";
import { Post } from "@/models/post";
import { useFeedStore } from "@/store/feed.store";
import { useMyPostStore } from "@/store/my.post.store";
import { useMyRepliesStore } from "@/store/my.replies.store";
import { ModalType } from "@/store/new.post.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import { useSinglePostStore } from "@/store/single.post.store";

/**
 * Post-grill Q1: apply an ALREADY-MAPPED created post/reply to the
 * stores — no refetch. The old flow refetched the created object
 * through `GET /socials/posts/:id`, which resolves POSTS only: for a
 * reply (a comments-table id) that 404'd, the catch swallowed it, and
 * the new reply never reached the single-post store — the page's
 * primary action silently half-failed while the modal closed as if
 * everything worked. The create endpoint already returns the fully
 * mapped object (`createdMapped`); use it.
 */
export const updateStoresWithCreatedPost = ({
  post,
  parentPostId,
  newPostsCount,
  modalType,
}: {
  post: Post;
  parentPostId: string | null;
  newPostsCount: number;
  modalType: ModalType;
}): boolean => {
  // Add the post to the following stores:
  // - Feed store, My Posts Store (if it is not a reply)
  // - Single Post store, My Replies Store (if it is a reply)
  try {
    if (modalType === null) return true;

    const feedStore = useFeedStore.getState();
    const myPostStore = useMyPostStore.getState();
    const singlePostStore = useSinglePostStore.getState();
    const myRepliesStore = useMyRepliesStore.getState();
    const profileCardStore = useProfileCardStore.getState();

    if (modalType === "new-post") {
      if (post.status === "complete") {
        // Add new posts in stores
        feedStore.addNewPost(post);
        myPostStore.addNewPost(post);

        // Increment counts in stores
        profileCardStore.incrementPostsCount(newPostsCount);
      }
    } else if (modalType === "reply" && parentPostId) {
      if (post.status === "complete") {
        // Add new posts in stores
        singlePostStore.addNewReply(post);
        myRepliesStore.addNewPost(post);

        // Increment counts in stores
        singlePostStore.updatePost(parentPostId, (post) => ({
          replies_count: post.replies_count ? post.replies_count + 1 : 1,
        }));
        feedStore.incrementPostRepliesCount(parentPostId);
        myPostStore.incrementPostRepliesCount(parentPostId);
        myRepliesStore.incrementPostRepliesCount(parentPostId);
      }
    } else if (modalType === "reply-of-reply" && parentPostId) {
      if (post.status === "complete") {
        // Nested replies (2026-10-21): the create now succeeds
        // server-side, so the new reply is FILED, not just counted —
        // it joins the single-post store's flat list (the page's tree
        // builder nests it under parentPostId and expands its chain)
        // and the author's own replies list.
        singlePostStore.addNewReply(post);
        myRepliesStore.addNewPost(post);

        // Increment counts in stores: the parent reply's direct count,
        // and the root post's all-depths count (server semantics).
        singlePostStore.updateRepliesCountForReply("increment", parentPostId);
        myRepliesStore.incrementPostRepliesCount(parentPostId);
        const rootPostId = post.parent_post?._id;
        if (rootPostId) {
          singlePostStore.updatePost(rootPostId, (post) => ({
            replies_count: post.replies_count ? post.replies_count + 1 : 1,
          }));
          feedStore.incrementPostRepliesCount(rootPostId);
          myPostStore.incrementPostRepliesCount(rootPostId);
        }
      }
    } else if (modalType === "reply-of-thread-post" && parentPostId) {
      if (post.status === "complete") {
        // Add new posts in stores
        myRepliesStore.addNewPost(post);

        // Increment counts in stores
        singlePostStore.updatePost(parentPostId, (post) => ({
          replies_count: post.replies_count ? post.replies_count + 1 : 1,
        }));
      }
    } else if (modalType === "edit") {
      // Update all stores as we don't know which store the post is in
      if (post.status === "complete") {
        feedStore.replaceEditedPost(post);
        myPostStore.replaceEditedPost(post);
        singlePostStore.replaceEditedPost(post);
      }
    }

    return true;
  } catch {
    return false;
  }
};

export const getPostAndUpdateStores = async ({
  parentPostId,
  postId,
  newPostsCount,
  modalType,
  isAuthenticated,
}: {
  parentPostId: string | null;
  postId: string;
  newPostsCount: number;
  modalType: ModalType;
  isAuthenticated: boolean;
}): Promise<boolean> => {
  try {
    const post = await getPostById(postId, isAuthenticated);
    return updateStoresWithCreatedPost({
      post,
      parentPostId,
      newPostsCount,
      modalType,
    });
  } catch {
    return false;
  }
};
