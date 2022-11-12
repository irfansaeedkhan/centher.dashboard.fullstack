// React, Next, NPM Packages
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { useProfileCardStore } from "@/store/profile.card.store";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";

const ProfileTabs: React.FC = () => {
  const { incrementFollowersCount, decrementFollowersCount } =
    useProfileCardStore((state) => {
      return {
        incrementFollowersCount: state.incrementFollowersCount,
        decrementFollowersCount: state.decrementFollowersCount,
      };
    });
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const {
    user,
    mutateUser,
    loading: userLoading,
  } = useGetUser(router.query.account_address?.toString()?.toLowerCase());

  const currentPageRoute = useMemo(
    () => ({
      isProfilePage:
        router.pathname === AppRoutes.profile.account_address ||
        router.pathname === AppRoutes.profile.following ||
        router.pathname === AppRoutes.profile.followers ||
        router.pathname === AppRoutes.profile.replies,
      isNFTProfilePage:
        router.pathname === AppRoutes.profile.nfts ||
        router.pathname === AppRoutes.profile.purchased ||
        router.pathname === AppRoutes.profile.collections,
    }),
    [router.pathname]
  );

  return (
    <div className={profilePageHeader}>
      <div className={btnContainer}>
        <Link
          href={{
            pathname: AppRoutes.profile.account_address,
            query: {
              account_address: user?.account_address,
            },
          }}
          className="w-full"
        >
          <Button
            title={"Social Profile"}
            variant={`${currentPageRoute.isProfilePage ? "v1" : "v2"}`}
            className="px-8 py-3"
          />
        </Link>
        <Link
          href={{
            pathname: AppRoutes.profile.nfts,
            query: {
              account_address: user?.account_address,
            },
          }}
          className="w-full"
        >
          <Button
            title={"NFT Profile"}
            variant={`${currentPageRoute.isNFTProfilePage ? "v1" : "v2"}`}
            className="px-8 py-3"
          />
        </Link>
      </div>
    </div>
  );
};
export default ProfileTabs;

// styling
const profilePageHeader = ctl(`
w-full max-w-[1136px] mx-auto
`);
const btnContainer = ctl(`
  flex max-w-[430px] w-full bg-black-shade-6 p-1.5 rounded-2xl mb-6 space-x-2
`);
