// React, Next, NPM Packages
import { useEffect, useState } from "react";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { AvatarList } from "@/models/avatars";
import { LoadingState } from "@/models/common";

export const useAvatars = () => {
  const [avatars, setAvatars] = useState<AvatarList>([]);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    setLoading("loading");
    axiosNodeApi
      .get("/api/public/avatars.json")
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
