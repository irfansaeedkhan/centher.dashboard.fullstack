import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import FollowersPage from "../_components/followers-page";
import { ProfilePageWrapper } from "../../_components";
import ProfileCommunityLayout from "../_components/profile-community-layout";

const Followers: NextPageWithLayout = () => {
  return <FollowersPage />;
};

Followers.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile" messageBox={false}>
      <ProfileCommunityLayout>{page}</ProfileCommunityLayout>
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default Followers;
