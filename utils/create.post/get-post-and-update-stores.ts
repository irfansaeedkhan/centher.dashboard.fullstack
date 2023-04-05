import { getPost } from "@/components/feed.components";
import { useFeedStore } from "@/store/feed.store";
import { useMyPostStore } from "@/store/my.post.store";
import { useMyRepliesStore } from "@/store/my.replies.store";
import { ModalType } from "@/store/new.post.store";
import { useSinglePostStore } from "@/store/single.post.store";

export const getPostAndUpdateStores = async (
  postId: string,
  modalType: ModalType
) => {
  // Add the post to the following stores:
  // - Feed store, My Posts Store (if it is not a reply)
  // - Single Post store, My Replies Store (if it is a reply)

  const post = await getPost(postId);

  if (modalType === null) return;

  if (modalType === "new-post") {
    if (post.status === "complete") {
      useFeedStore.getState().addNewPost(post);
      useMyPostStore.getState().addNewPost(post);
    }
  } else if (modalType === "reply") {
    if (post.status === "complete") {
      useSinglePostStore.getState().addNewReply(post);
      useMyRepliesStore.getState().addNewPost(post);
    }
  }
};
