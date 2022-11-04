// React, Next, NPM Packages
import { useCallback, useEffect, useState } from "react";

// App imports
import { User } from "@/models/user";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";

const useGetNftOwnerDb = (account_address?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [notRegistered, setNotRegistered] = useState<string>("");
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (account_address) {
      setNotRegistered("");
      setImgSrc("");
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
          setNotRegistered(account_address);
          setImgSrc("/images/a1.png");
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
    notRegistered,
    imgSrc,
  };
};

export default useGetNftOwnerDb;
