import useSWR from "swr";

import { axiosNodeApi } from "@/utils/axios";
import { User } from "@/models/user";

const useUser = () => {
  const { data, error } = useSWR(
    `/api/users/me`,
    async (url) => {
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
    },
    {
      onErrorRetry(err, _, _2, revalidate, { retryCount }) {
        if (err.message === "unauthenticated") {
          // Only retry up to 2 times if user is unauthenticated
          if (retryCount >= 2) {
            return;
          }
        }

        // Retry up to 5 times if there is any other error
        if (retryCount >= 5) {
          return;
        }

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useUser;
