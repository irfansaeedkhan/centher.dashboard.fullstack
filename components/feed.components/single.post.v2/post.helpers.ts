import { axiosNodeApi } from "@/utils/axios";

export const getPost = async (postId: string) => {
  const { data } = await axiosNodeApi.get(`/api/socials/posts/${postId}`);
  return data.post;
};

export const archivePost = async (postId: string) => {
  await axiosNodeApi.patch(`/api/socials/posts/${postId}/archive`);
};

export const unArchivePost = async (postId: string) => {
  await axiosNodeApi.patch(`/api/socials/posts/${postId}/unarchive`);
};

export const deletePost = async (postId: string) => {
  await axiosNodeApi.delete(`/api/socials/posts/${postId}`);
};

export const likePost = async (
  postId: string,
  actionType: "like" | "unlike"
) => {
  await axiosNodeApi.post("api/socials/analytics/likes", {
    postId,
    actionType: actionType,
  });
};
