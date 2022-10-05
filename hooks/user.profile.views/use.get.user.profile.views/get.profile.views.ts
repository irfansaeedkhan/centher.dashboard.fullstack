// App imports
import { axiosNodeApi } from "@/utils/axios";

export const getProfileViews = async (account_address: string) => {
  const { data } = await axiosNodeApi.get(
    `/api/socials/analytics/profile-views/${account_address}`
  );
  return data;
};
