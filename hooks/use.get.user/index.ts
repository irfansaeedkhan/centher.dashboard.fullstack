import { useCallback, useEffect, useState } from "react";
import { User } from "@/models/user";
import { LoadingState } from "@/models/common";
import { axiosCIS } from "@/utils/axios";
import { ZeroAddress } from "@/web3/constants/common";

const useGetUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    if (userId && userId !== ZeroAddress) {
      setLoading("loading");
      (async () => {
        try {
          const { data } = await axiosCIS.get<User>(`/users/${userId}`);
          setUser(data);
          setLoading("loaded");
        } catch (error) {
          setUser(null);
          setLoading("failed");
        }
      })();
    }
  }, [userId]);

  const mutateUser = useCallback(
    async (userPartial: Partial<User> | null) => {
      if (userPartial === null) {
        setUser(null);
      } else if (user) {
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

export default useGetUser;
