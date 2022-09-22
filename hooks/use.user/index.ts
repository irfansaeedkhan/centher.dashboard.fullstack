import useSWR from "swr";

import { axiosNodeApi } from "@/utils/axios";
import { User } from "@/models/user";

const useUser = () => {
  const { data, error } = useSWR(`/api/users/me`, async (url) => {
    try {
      const { data } = await axiosNodeApi.get(url);
      return data.user as User;
    } catch (error: any) {
      throw (
        error.response.data ?? {
          status: "error",
          message: "server_error",
          message_description: "Something went wrong",
        }
      );
    }
  });

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useUser;
