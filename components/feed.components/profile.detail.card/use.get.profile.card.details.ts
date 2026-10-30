import { useEffect, useRef } from "react";
import { useProfileCardStore } from "@/store/profile.card.store";
import { User } from "@/models/user";
import { axiosApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { getAllUserGenealogy } from "@/lib/get-user-genealogy";
import useUser from "@/hooks/use.user";

export const useGetProfileCardDetails = (user: User) => {
  const { user: loggedInUser } = useUser();
  const { profileCard, setProfileCard, markProfileCardLoading } =
    useProfileCardStore();
  const lastUserIdRef = useRef<string | null>(null);
  const lastAuthRef = useRef<boolean | null>(null);

  useEffect(() => {
    const userId = user._id;

    if (userId) {
      // Feed fix 2026-10-29 (stats flicker): mark stale BEFORE the
      // fetch, but only when the profile actually changed. On a
      // same-user refetch (e.g. session revalidation) the previous
      // value is kept on screen instead of flashing to "--".
      // A first mount, or a switch to another user, shows "--"
      // until the new card loads — never the initial 0s.
      if (lastUserIdRef.current !== userId) {
        lastUserIdRef.current = userId;
        markProfileCardLoading();
      }
      // Round 2 (stats flash 0, first-load window): this effect also
      // re-runs when the session object identity changes, e.g. the
      // anonymous -> authenticated flip right after login. A card
      // fetched before auth resolved must not keep rendering as real
      // counts, so an auth-state flip is treated like a user change:
      // show "--" until the authed refetch lands. Plain revalidations
      // (truthy -> truthy) do not flash.
      const authed = !!loggedInUser;
      if (lastAuthRef.current !== null && lastAuthRef.current !== authed) {
        markProfileCardLoading();
      }
      lastAuthRef.current = authed;
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
          // Keep whatever was on screen (or "--" if nothing ever
          // loaded); a failed refetch must not invent a 0.
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

  const { data } = await axiosApi.get(url);
  return data;
};
