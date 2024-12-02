import React, { useState } from "react";
import Link from "next/link";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import { NextPageWithLayout } from "../_app.page";
import { faqsData } from "./_components/faqs-data";
import SingleFaq from "./_components/single-faq";
import StakingMainWrapper from "./_components/staking-main-wrapper";

const Faqs: NextPageWithLayout = () => {
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-[1144px] flex-col gap-6">
      <h5 className="textGradient text-2xl font-semibold">
        Staking FAQ&apos;s
      </h5>
      <div className="tracking-[1.4px] text-white">
        You haven&apos;t found what you were searching for? visit{" "}
        <Link
          className="text-gradient"
          href={"https://369x.io/academy"}
          target="_blank"
        >
          {process.env.NEXT_PUBLIC_BRAND_NAME} Academy
        </Link>{" "}
        to find out more about Staking and much else!
      </div>

      <div className="flex w-full flex-col gap-4">
        {faqsData.map((faq) => {
          return <SingleFaq faq={faq} key={faq.id} />;
        })}
      </div>

      {showBuyCitizenshipModal && (
        <BuyCitizenshipModal
          isOpen={showBuyCitizenshipModal}
          onClickClose={() => setShowBuyCitizenshipModal(false)}
        />
      )}
    </div>
  );
};

export default Faqs;

Faqs.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Staking FAQs">
      <StakingMainWrapper>{page}</StakingMainWrapper>
    </AllPagesWrapper>
  );
};
