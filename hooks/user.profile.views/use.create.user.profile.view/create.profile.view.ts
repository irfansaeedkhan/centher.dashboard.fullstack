import { axiosApiCenther } from "@/utils/axios";

export const createProfileView = async (
  userId: string,
  abortController: AbortController
) => {
  const { data } = await axiosApiCenther.post(
    `/api/socials/analytics/profile-views`,
    {
      user_id: userId,
    },
    {
      signal: abortController.signal,
    }
  );
  return data;
};
