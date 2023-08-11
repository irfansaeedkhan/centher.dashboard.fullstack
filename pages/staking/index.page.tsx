import React, { useState } from "react";
import { useRouter } from "next/router";

import { NextPageWithLayout } from "@/pages/_app.page";
import useUser from "@/hooks/use.user";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import FinalButton from "@/components/button/final.button";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import { NoStakingIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import StakingListContainer from "./_components/staking-list-container";
import clsx from "clsx";
import { PreLoader } from "@/components/pre.loader";

const Staking: NextPageWithLayout = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);
  const [stakingList, setStakingList] = useState(true);
  const [coinsDetails, setCoinsDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  return (
    <section
      className={clsx(
        "flex w-full justify-center",
        !stakingList && "min-h-[calc(100vh-120px)] items-center"
      )}
    >
      {/* show if user already have stakings */}
      {stakingList ? (
        <StakingListContainer />
      ) : (
        <div className="flex max-w-[330px] flex-col items-center justify-center gap-2 text-center">
          <NoStakingIcon className="mb-6" />
          <h3 className="text-16px font-semibold text-white ">
            No Staking Projects yet!
          </h3>
          <p className="text-14px font-normal text-gray-shade-14">
            There are currently no Staking Projects available. Create one
            yourself!
          </p>
          {/* if member go to staking form other wise membership modal */}
          <FinalButton
            title="Create New"
            onClick={
              loggedInUser?.membership.status === "citizen"
                ? () =>
                    router.push({
                      pathname: AppRoutes.staking.create_staking,
                    })
                : () => setShowBuyCitizenshipModal(true)
            }
            variant="primary"
            className="text-14px mt-6 py-3 px-5"
          />
        </div>
      )}

      {showBuyCitizenshipModal && (
        <BuyCitizenshipModal
          isOpen={showBuyCitizenshipModal}
          onClickClose={() => setShowBuyCitizenshipModal(false)}
        />
      )}
      <PreLoader />
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
