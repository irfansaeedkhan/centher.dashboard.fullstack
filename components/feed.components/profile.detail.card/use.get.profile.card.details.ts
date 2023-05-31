// React, Next, NPM Packages
import { useEffect } from "react";

// App imports
import {
  initialProfileCard,
  useProfileCardStore,
} from "@/store/profile.card.store";
import { User } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { getAllUserGenealogy } from "@/lib/get-user-genealogy";

export const useGetProfileCardDetails = (user: User) => {
  const { profileCard, setProfileCard } = useProfileCardStore();

  useEffect(() => {
    const account_address = user.account_address;

    if (account_address) {
      (async () => {
        try {
          const users = await getAllUserGenealogy(account_address);
          const res = await getProfileCardDetails(account_address);
          res.profileCardDetails.total_referrees = users.flat().length || 0;
          setProfileCard(res.profileCardDetails);
        } catch (error: any) {
          customLog(error, ["development"]);
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
