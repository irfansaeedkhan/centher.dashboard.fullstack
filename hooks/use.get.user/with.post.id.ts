import { useCallback, useEffect, useState } from "react";

import { User } from "@/models/user";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";

const useGetUserWithPostId = (postId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    if (postId) {
      setLoading("loading");
      (async () => {
        try {
          const { data } = await axiosNodeApi.get(`/api/users/post/${postId}`);
          setUser(data.user as User);
          setLoading("loaded");
        } catch (error: any) {
          customLog(error, ["development"]);
          setUser(null);
          setLoading("failed");
        }
      })();
    }
  }, [postId]);

  const mutateUser = useCallback(
    async (userPartial: Partial<User>) => {
      if (user) {
        setUser((prev) => ({
          ...(prev as User),
          ...userPartial,
        }));
      } else {
        setUser(null);
      }
    },
    [user]
  );

  return {
    user,
    loading,
    mutateUser,
  };
};

export default useGetUserWithPostId;
