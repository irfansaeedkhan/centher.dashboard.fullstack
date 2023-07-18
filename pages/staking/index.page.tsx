import React, { useState } from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NoStakingIcon } from "@/assets/svgs";
import FinalButton from "@/components/button/final.button";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";

const Staking: NextPageWithLayout = () => {
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);

  return (
    <section className="flex min-h-[calc(100vh-120px)] w-full items-center justify-center">
      <div className="flex max-w-[330px] flex-col items-center justify-center gap-2 text-center">
        <NoStakingIcon className="mb-6" />
        <h3 className="text-16px font-semibold text-white ">
          No any Staking yet
        </h3>
        <p className="text-14px font-normal text-gray-shade-14">
          There are currently no Staking Projects available. Create one
          yourself!
        </p>
        <FinalButton
          title="Create New"
          onClick={() => setShowBuyCitizenshipModal(true)}
          variant="primary"
          className="text-14px mt-6 py-3 px-5"
        />
      </div>
      {showBuyCitizenshipModal && (
        <BuyCitizenshipModal
          isOpen={showBuyCitizenshipModal}
          onClickClose={() => setShowBuyCitizenshipModal(false)}
        />
      )}
    </section>
  );
};

Staking.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Staking">
    <div className="mx-auto w-full max-w-[1144px] bg-black-shade-3 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default Staking;
