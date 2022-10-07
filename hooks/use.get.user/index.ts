// React, Next, NPM Packages
import { useEffect, useState } from "react";

// App imports
import { User } from "@/models/user";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";

const useGetUser = (account_address?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    if (account_address) {
      setLoading("loading");
      (async () => {
        try {
          const { data } = await axiosNodeApi.get(
            `/api/users/${account_address}`
          );
          setUser(data.user as User);
          setLoading("loaded");
        } catch (error) {
          console.log(error);
          setUser(null);
          setLoading("failed");
        }
      })();
    }
  }, [account_address]);

  return {
    user,
    loading,
  };
};

export default useGetUser;
