import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import React from "react";
import { ProfilePageWrapper } from "../_components";

const Followers: NextPageWithLayout = () => {
  return <div>Followers</div>;
};

Followers.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Followers">
      <ProfilePageWrapper>{page}</ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Followers;
