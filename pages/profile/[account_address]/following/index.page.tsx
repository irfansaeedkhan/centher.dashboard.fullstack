import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfileDetailCard } from "@/components/feed.components";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";
import useGetUser from "@/hooks/use.get.user";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useRouter } from "next/router";
import React from "react";
import { ProfilePageWrapper } from "../_components";

const Following: NextPageWithLayout = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  return (
    <div className="flex  gap-5 max-w-[835px]">
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
      <div>Following</div>
    </div>
  );
};

Following.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Following">
      <ProfilePageWrapper>{page}</ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Following;
