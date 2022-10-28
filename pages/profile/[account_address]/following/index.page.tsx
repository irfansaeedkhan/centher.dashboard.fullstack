import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import React from "react";
import { ProfilePageWrapper } from "../_components";

const Following: NextPageWithLayout = () => {
  return <div>Following</div>;
};

Following.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Following">
      <ProfilePageWrapper>{page}</ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Following;
