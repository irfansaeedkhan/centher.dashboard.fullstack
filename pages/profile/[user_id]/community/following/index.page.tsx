import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfilePageWrapper } from "../../_components";
import ProfileCommunityLayout from "../_components/profile-community-layout";
import FollowingPage from "../_components/following-page";

const Following: NextPageWithLayout = () => {
  return <FollowingPage />;
};

Following.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile" messageBox={false}>
      <ProfileCommunityLayout>{page}</ProfileCommunityLayout>
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default Following;
