import { useCallback, useEffect, useState } from "react";
import { User } from "@/models/user";
import { LoadingState } from "@/models/common";
import { axiosCIS } from "@/utils/axios";

const useGetNftOwnerDb = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [notRegistered, setNotRegistered] = useState<string>("");
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (userId) {
      setNotRegistered("");
      setImgSrc("");
      setLoading("loading");
      (async () => {
        try {
          const { data } = await axiosCIS.get<User>(`/api/users/${userId}`);
          setUser(data);
          setLoading("loaded");
        } catch (error) {
          setNotRegistered(userId);
          setImgSrc("/images/a1.png");
          setUser(null);
          setLoading("failed");
        }
      })();
    }
  }, [userId]);

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
