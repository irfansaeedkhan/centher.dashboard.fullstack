import React, { useState } from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import { NextPageWithLayout } from "../_app.page";
import { faqsData } from "./_components/faqs-data";
import SingleFaq from "./_components/single-faq";

const Faqs: NextPageWithLayout = () => {
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-[1144px] flex-col gap-6">
      <div className="flex w-full flex-col gap-5 fsm:w-fit fsm:flex-row fsm:items-center fsm:justify-start flg:gap-6">
        <h5 className="textGradient text-2xl font-semibold">FAQS</h5>
      </div>
      <div className="w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-10">
        <div className="flex flex-col gap-4">
          {faqsData.map((faq) => {
            return <SingleFaq faq={faq} key={faq.id} />;
          })}
        </div>
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
  return <AllPagesWrapper pageTitle="Staking FaQs">{page}</AllPagesWrapper>;
};
