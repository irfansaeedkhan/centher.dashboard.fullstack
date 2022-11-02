// React, Next, NPM Packages
import { useEffect } from "react";

// App imports
import {
  initialProfileCard,
  useProfileCardStore,
} from "@/store/profile.card.store";
import { User } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";

export const useGetProfileCardDetails = (user: User) => {
  const { profileCard, setProfileCard } = useProfileCardStore();

  useEffect(() => {
    const account_address = user.account_address;
    if (account_address) {
      (async () => {
        try {
          const res = await getProfileCardDetails(account_address);
          setProfileCard(res.profileCardDetails);
        } catch (error: any) {
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.dir(error);
          setProfileCard(initialProfileCard);
        }
      })();
    }
  }, [user, setProfileCard]);

  return profileCard;
};

const getProfileCardDetails = async (account_address: string) => {
  const { data } = await axiosNodeApi.get(
    `/api/socials/analytics/profile-card/${account_address}`
  );
  return data;
};
