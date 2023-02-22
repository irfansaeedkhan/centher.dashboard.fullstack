import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfilePageWrapper } from "@/pages/profile/[account_address]/_components";
import { ProfileNFTCollectionTabs } from "@/pages/profile/[account_address]/_components/profile.nft.collection.tabs";
import React from "react";

interface Props {
  children: React.ReactNode;
}
const ProfileNftsLayout: React.FC<Props> = ({ children }) => {
  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper currentTab="nft-profile" messageBox={false}>
        <ProfileNFTCollectionTabs />
        {children}
      </ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default ProfileNftsLayout;
