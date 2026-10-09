import { Post } from "@/models/post";
import { axiosApi369x } from "@/utils/axios";

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
