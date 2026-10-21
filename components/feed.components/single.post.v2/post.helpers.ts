import { CompletedPost, Post } from "@/models/post";
import { axiosApi369x } from "@/utils/axios";

/** Surface the server's readable error message (never a silent failure). */
export const apiErrorMessage = (error: any, fallback: string): string =>
  error?.response?.data?.message || fallback;

export const getPost = async (postId: string, isAuthenticated: boolean) => {
  const withAuth =
    isAuthenticated && process.env.NEXT_PUBLIC_APP_ENV !== "development"
      ? "/with-auth"
      : "";

  const { data } = await axiosApi369x.get(
    `/api/socials/posts/${postId}${withAuth}?exact_post=true`
  );
  return data.posts[0] as Post;
};

export const archivePost = async (postId: string) => {
  await axiosApi369x.patch(`/api/socials/posts/${postId}/archive`);
};

export const unArchivePost = async (postId: string) => {
  await axiosApi369x.patch(`/api/socials/posts/${postId}/unarchive`);
};

export const deletePost = async (postId: string) => {
  await axiosApi369x.delete(`/api/socials/posts/${postId}`);
};

export const likePost = async (
  postId: string,
  actionType: "like" | "unlike"
) => {
  await axiosApi369x.post("/api/socials/analytics/likes", {
    postId,
    actionType: actionType,
  });
};

export const createPostView = async (post_id: string) => {
  await axiosApi369x.post(`/api/socials/analytics/post-views`, {
    post_id,
  });
};

/**
 * Feed product calls Q12/Q13: reply edit/delete hit the comments
 * endpoints (replies used to be write-once — the old UI pointed the
 * post endpoints at a comment id and silently 404'd). Both return the
 * mapped reply so the caller can swap it into its store; delete returns
 * the tombstone (status "deleted"), not a removal.
 */
export const editReply = async (
  replyId: string,
  text: string
): Promise<CompletedPost> => {
  const { data } = await axiosApi369x.patch(
    `/api/socials/comments/${replyId}`,
    { text }
  );
  return data.posts[0] as CompletedPost;
};

export const deleteReply = async (replyId: string): Promise<CompletedPost> => {
  const { data } = await axiosApi369x.delete(
    `/api/socials/comments/${replyId}`
  );
  return data.posts[0] as CompletedPost;
};
