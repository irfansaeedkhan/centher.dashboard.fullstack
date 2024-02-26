import { getPostById } from "@/lib/social-posts";
import { useFeedStore } from "@/store/feed.store";
import { useMyPostStore } from "@/store/my.post.store";
import { useMyRepliesStore } from "@/store/my.replies.store";
import { ModalType } from "@/store/new.post.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import { useSinglePostStore } from "@/store/single.post.store";

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
  // Add the post to the following stores:
  // - Feed store, My Posts Store (if it is not a reply)
  // - Single Post store, My Replies Store (if it is a reply)

  try {
    const post = await getPostById(postId, isAuthenticated);

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
        // Increment counts in stores
        singlePostStore.updateRepliesCountForReply("increment", parentPostId);
        // myRepliesStore.updateRepliesCountForReply("increment", parentPostId);
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
