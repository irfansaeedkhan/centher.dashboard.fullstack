import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfilePageWrapper } from "../_components";
import ProfileNftsLayout from "./_components/profile.nfts.layout";
import ListedPage from "./_components/listed-page";

const ListedNFTS: NextPageWithLayout = () => {
  return <ListedPage />;
};

ListedNFTS.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile" messageBox={false}>
      <ProfileNftsLayout>{page}</ProfileNftsLayout>
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default ListedNFTS;
