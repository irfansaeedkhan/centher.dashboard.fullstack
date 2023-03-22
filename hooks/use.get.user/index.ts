import { useCallback, useEffect, useState } from "react";

import { User } from "@/models/user";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";
import { ZeroAddress } from "@/web3/constants/common";

const useGetUser = (account_address?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    if (account_address && account_address !== ZeroAddress) {
      setLoading("loading");
      (async () => {
        try {
          const { data } = await axiosNodeApi.get(
            `/api/users/${account_address}`
          );
          setUser(data.user as User);
          setLoading("loaded");
        } catch (error) {
          setUser(null);
          setLoading("failed");
        }
      })();
    }
  }, [account_address]);

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

export default useGetUser;
