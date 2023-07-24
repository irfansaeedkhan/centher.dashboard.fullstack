import { Post } from "@/models/post";
import { axiosApiCenther } from "@/utils/axios";

export const getPost = async (postId: string, isAuthenticated: boolean) => {
  let url = `/api/socials/posts/${postId}`;

  if (isAuthenticated && process.env.NEXT_PUBLIC_APP_ENV !== "development") {
    url += "/with-auth";
  }

  const { data } = await axiosApiCenther.get(`${url}?exact_post=true`);
  return data.posts[0] as Post;
};

export const archivePost = async (postId: string) => {
  await axiosApiCenther.patch(`/api/socials/posts/${postId}/archive`);
};

export const unArchivePost = async (postId: string) => {
  await axiosApiCenther.patch(`/api/socials/posts/${postId}/unarchive`);
};

export const deletePost = async (postId: string) => {
  await axiosApiCenther.delete(`/api/socials/posts/${postId}`);
};

export const likePost = async (
  postId: string,
  actionType: "like" | "unlike"
) => {
  await axiosApiCenther.post("api/socials/analytics/likes", {
    postId,
    actionType: actionType,
  });
};

export const createPostView = async (post_id: string) => {
  await axiosApiCenther.post(`/api/socials/analytics/post-views`, {
    post_id,
  });
};
