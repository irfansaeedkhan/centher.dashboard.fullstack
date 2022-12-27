import { axiosNodeApi } from "@/utils/axios";

export const createPostView = async (post_id: string) => {
  await axiosNodeApi.post(`/api/socials/analytics/post-views`, {
    post_id,
  });
};
