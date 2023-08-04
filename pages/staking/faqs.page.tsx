import React from "react";
import PageButtonsWrapper from "./staking-details/_components/page-buttons";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "../_app.page";

const Faqs: NextPageWithLayout = () => {
  return (
    <PageButtonsWrapper>
      <div>Hey</div>
    </PageButtonsWrapper>
  );
};

export default Faqs;

Faqs.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Staking FaQs">{page}</AllPagesWrapper>;
};
