// React, Next, NPM Packages
import { useEffect, useState } from "react";

// App imports
import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";

interface ProfileCardDetailsState {
  _id: string;
  account_address: string;
  posts_count: number;
  followers_count: number;
  following_count: number | null;
  posts_views_count: number | null;
  profile_views_count: number | null;
}

const initialState: ProfileCardDetailsState = {
  _id: "",
  account_address: "",
  followers_count: 0,
  posts_count: 0,
  following_count: null,
  posts_views_count: null,
  profile_views_count: null,
};

export const useGetProfileCardDetails = () => {
  const { user: loggedInUser } = useUser();

  const [profileCardDetails, setProfileCardDetails] = useState(initialState);

  useEffect(() => {
    const account_address = loggedInUser?.account_address;
    if (account_address) {
      (async () => {
        try {
          const res = await getProfileCardDetails(account_address);
          setProfileCardDetails((prev) => ({
            ...prev,
            ...res.profileCardDetails,
          }));
        } catch (error: any) {
          process.env.NODE_ENV !== "production" && console.dir(error);
          setProfileCardDetails(initialState);
        }
      })();
    }
  }, [loggedInUser]);

  return {
    profileCardDetails,
  };
};

const getProfileCardDetails = async (account_address: string) => {
  const { data } = await axiosNodeApi.get(
    `/api/socials/analytics/profile-card/${account_address}`
  );
  return data;
};
