import React from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfilePageWrapper } from "@/pages/profile/[account_address]/_components";
import { ProfileCommunityTabs } from "@/pages/profile/[account_address]/_components/profile.community.tabs";

interface Props {
  children: React.ReactNode;
}
const ProfileCommunityLayout: React.FC<Props> = ({ children }) => {
  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper currentTab="nft-profile" messageBox={false}>
        <ProfileCommunityTabs />
        {children}
      </ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default ProfileCommunityLayout;
