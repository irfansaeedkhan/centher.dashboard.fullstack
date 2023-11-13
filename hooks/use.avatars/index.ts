import { useEffect, useState } from "react";
import { axiosCFS } from "@/utils/axios";
import { AvatarList } from "@/models/avatars";
import { LoadingState } from "@/models/common";

export const useAvatars = () => {
  const [avatars, setAvatars] = useState<AvatarList>([]);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    setLoading("loading");
    axiosCFS
      .get("/avatars")
      .then(({ data }) => {
        setAvatars(data as AvatarList);
        setLoading("loaded");
      })
      .catch(() => {
        setLoading("failed");
      });
  }, []);

  return { avatars, loading };
};
