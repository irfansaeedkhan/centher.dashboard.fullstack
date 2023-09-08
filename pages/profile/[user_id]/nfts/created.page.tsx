import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import CreatedPage from "./_components/created-page";
import { ProfilePageWrapper } from "../_components";
import ProfileNftsLayout from "./_components/profile.nfts.layout";

const CreatedNFTS: NextPageWithLayout = () => {
  return <CreatedPage />;
};

CreatedNFTS.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile" messageBox={false}>
      <ProfileNftsLayout>{page}</ProfileNftsLayout>
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default CreatedNFTS;
