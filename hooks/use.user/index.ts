import { useCallback } from "react";
import useSWR from "swr";
import { LoggedInUser } from "@/models/user";
import { axiosCIS } from "@/utils/axios";
import { updateMe } from "@/lib/user";

const useUser = () => {
  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    `/api/users/me`,
    async (url) => {
      try {
        const { data } = await axiosCIS.get<LoggedInUser>(url);
        return data;
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

  const updateUser = useCallback(
    async (user: Partial<LoggedInUser>) => {
      try {
        const updatedUser = await updateMe(user);
        mutate(updatedUser, false);
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
    [mutate]
  );

  const mutateUser = useCallback(
    async (userPartial: Partial<LoggedInUser>) => {
      mutate({ ...user, ...(userPartial as LoggedInUser) }, false);
    },
    [mutate, user]
  );

  const refetchUser = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    user: user,
    isLoading: !error && !user,
    error,
    updateUser,
    mutateUser,
    refetchUser,
  };
};

export default useUser;
