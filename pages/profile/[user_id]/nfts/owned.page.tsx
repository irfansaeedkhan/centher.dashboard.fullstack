import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfilePageWrapper } from "../_components";
import ProfileNftsLayout from "./_components/profile.nfts.layout";
import OwnedPage from "./_components/owned-page";

const OwnedNFTS: NextPageWithLayout = () => {
  return <OwnedPage />;
};

OwnedNFTS.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile" messageBox={false}>
      <ProfileNftsLayout>{page}</ProfileNftsLayout>
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default OwnedNFTS;
