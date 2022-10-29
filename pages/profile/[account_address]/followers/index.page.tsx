import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfileDetailCard } from "@/components/feed.components";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";
import UserWithFollow from "@/components/user.with.follow";
import { IUserWithFollow } from "@/components/user.with.follow/types";
import useGetUser from "@/hooks/use.get.user";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { axiosNodeApi } from "@/utils/axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ProfilePageWrapper } from "../_components";

const Followers: NextPageWithLayout = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  const [followers, setFollowers] = useState<IUserWithFollow[]>([]);

  useEffect(() => {
    if (router.query.account_address) {
      getFollowers(router.query.account_address.toString());
    }
  }, [router.query.account_address]);

  const getFollowers = (account_address: string) => {
    axiosNodeApi.get(`/api/users/${account_address}/followers`).then((res) => {
      setFollowers(res.data.followers);
    });
  };

  return (
    <div className="flex gap-5">
      <div className="w-full max-w-[272px]  flex-col gap-3 hidden lg:flex">
        <div className="lg:sticky lg:top-0 flex flex-col gap-4">
          {userLoading === "loaded" && user ? (
            <ProfileDetailCard
              user={user}
              isLoggedInUser={
                user.account_address === loggedInUser?.account_address
              }
            />
          ) : (
            <ProfileDetailCardSkeleton />
          )}
          {/* <DiscoverCard /> */}
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        {/* TODO: Talha add the Skeletons  */}
        {followers.map((result) => {
          return <UserWithFollow key={result._id} result={result} />;
        })}
      </div>
    </div>
  );
};

Followers.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Followers">
      <ProfilePageWrapper>{page}</ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Followers;
