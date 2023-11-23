import { useEffect } from "react";
import {
  initialProfileCard,
  useProfileCardStore,
} from "@/store/profile.card.store";
import { User } from "@/models/user";
import { axiosApiCenther } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { getAllUserGenealogy } from "@/lib/get-user-genealogy";
import useUser from "@/hooks/use.user";

export const useGetProfileCardDetails = (user: User) => {
  const { user: loggedInUser } = useUser();
  const { profileCard, setProfileCard } = useProfileCardStore();

  useEffect(() => {
    const userId = user._id;

    if (userId) {
      (async () => {
        try {
          const users = await getAllUserGenealogy(userId);
          console.log("Users in genealogy : \n",users)
          const res = await getProfileCardDetails(userId, !!loggedInUser);
          console.log("Users length \n",users.flat())
          res.profileCardDetails.total_referrees = users.flat().length || 0;
          setProfileCard(res.profileCardDetails);
        } catch (error: any) {
          customLog(["development"], error);
          setProfileCard(initialProfileCard);
        }
      })();
    }
  }, [user, setProfileCard, loggedInUser]);

  return profileCard;
};

const getProfileCardDetails = async (
  userId: string,
  isAuthenticated: boolean
) => {
  let url = `/api/socials/analytics/profile-card/${userId}`;

  if (isAuthenticated && process.env.NEXT_PUBLIC_APP_ENV !== "development") {
    url += "/with-auth";
  }

  const { data } = await axiosApiCenther.get(url);
  return data;
};
