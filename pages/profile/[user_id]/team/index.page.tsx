import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfilePageWrapper } from "../_components";
import TeamMembersPage from "./_components/team-members-page";

const TeamPage: NextPageWithLayout = () => {
  return <TeamMembersPage />;
};

TeamPage.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile" messageBox={false}>
      {page}
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default TeamPage;
