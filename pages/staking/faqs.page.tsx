import React from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { faqsData } from "./_components/faqs-data";
import SingleFaq from "./_components/single-faq";
import { NextPageWithLayout } from "../_app.page";
import PageButtonsWrapper from "./staking-details/[id]/_components/page-buttons";

const Faqs: NextPageWithLayout = () => {
  return (
    <PageButtonsWrapper>
      <div className="w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-10">
        <div className="flex flex-col gap-4">
          {faqsData.map((faq) => {
            return <SingleFaq faq={faq} key={faq.id} />;
          })}
        </div>
      </div>
    </PageButtonsWrapper>
  );
};

export default Faqs;

Faqs.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Staking FaQs">{page}</AllPagesWrapper>;
};
