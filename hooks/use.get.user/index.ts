// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// App imports
import { User } from "@/models/user";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";

const useGetUser = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    setLoading("loading");
    const account_address = router.query.account_address
      ?.toString()
      ?.toLowerCase();
    if (account_address) {
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
    } else {
      setLoading("failed");
    }
  }, [router]);

  return {
    user,
    loading,
  };
};

export default useGetUser;
