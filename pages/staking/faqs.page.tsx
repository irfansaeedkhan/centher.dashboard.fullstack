import React from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "../_app.page";
import { faqsData } from "./_components/faqs-data";
import PageButtonsWrapper from "./staking-details/_components/page-buttons";

const Faqs: NextPageWithLayout = () => {
  return (
    <PageButtonsWrapper>
      <div className="w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-10">
        <div className="flex flex-col gap-4">
          {faqsData.map((faq) => {
            return (
              <div
                key={faq.id}
                className="flex h-auto min-h-[86px] w-full items-center justify-between rounded-3xl border border-gray-shade-3 bg-background-shade-3 px-8"
              >
                <p className="text-lg font-semibold text-white">
                  {faq.question}
                </p>
              </div>
            );
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
