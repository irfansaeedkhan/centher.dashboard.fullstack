import { useEffect } from "react";
import { useProfileCardStore } from "@/store/profile.card.store";
import { User } from "@/models/user";
import { axiosApi369x } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { getAllUserGenealogy } from "@/lib/get-user-genealogy";
import useUser from "@/hooks/use.user";

export const useGetProfileCardDetails = (user: User) => {
  const { user: loggedInUser } = useUser();
  const { profileCard, setProfileCard, markProfileCardLoading } =
    useProfileCardStore();

  useEffect(() => {
    const userId = user._id;

    if (userId) {
      // Feed fix 2026-10-29 (stats flicker): mark stale BEFORE the
      // fetch so no consumer renders the previous user's counts, or
      // the initial 0s, as this user's counts.
      markProfileCardLoading();
      let cancelled = false;
      (async () => {
        try {
          const res = await getProfileCardDetails(userId, !!loggedInUser);
          let totalReferrees = 0;
          try {
            const users = await getAllUserGenealogy(userId);
            totalReferrees = users?.flat?.()?.length || 0;
          } catch (genealogyError: any) {
            // Solo demo has no on-chain genealogy — keep card stats from API
            customLog(["development"], genealogyError);
          }
          if (cancelled) return;
          setProfileCard({
            ...res.profileCardDetails,
            total_referrees: totalReferrees,
          });
        } catch (error: any) {
          customLog(["development"], error);
          // Feed fix 2026-10-29: do NOT reset to initialProfileCard
          // here. Its zeros used to render as real counts on error.
          // Leaving isLoaded false keeps consumers on "--".
          if (!cancelled) markProfileCardLoading();
        }
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [user, setProfileCard, markProfileCardLoading, loggedInUser]);

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

  const { data } = await axiosApi369x.get(url);
  return data;
};
