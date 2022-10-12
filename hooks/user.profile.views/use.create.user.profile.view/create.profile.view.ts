// App imports
import { axiosNodeApi } from "@/utils/axios";

export const createProfileView = async (
  account_address: string,
  abortController: AbortController
) => {
  const { data } = await axiosNodeApi.post(
    `/api/socials/analytics/profile-views`,
    {
      account_address,
    },
    {
      signal: abortController.signal,
    }
  );
  return data;
};
