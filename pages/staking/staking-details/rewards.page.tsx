import React, { useState } from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { CustomModal } from "@/components/modal/custom.modal";
import FinalButton from "@/components/button/final.button";
import RewardsTable from "./_components/rewards-table";
import StakingDetailsWrapper from "./_components/staking-details-wrapper";
import StakeRewardModal from "./_components/stake-reward-modal";
import UnstakeModal from "./_components/unstake-modal";

enum ModalType {
  stakeRewardsModal = "stakeRewardsModal",
  cancelStakingModal = "cancelStakingModal",
}

const ClaimRewards: NextPageWithLayout = () => {
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });

  const rewardsModal: TemplateCollection = {
    stakeRewardsModal: {
      title: "Cancel Staking project",
      visibility: true,
      content: () => (
        <StakeRewardModal
          onClose={() => modal.dismissModal()}
          onConfirm={() => modal.createModal(ModalType.cancelStakingModal)}
        />
      ),
    },
    cancelStakingModal: {
      title: "Unstake",
      visibility: true,
      content: () => <UnstakeModal />,
    },
  };

  const modal = new ModalManager(setModalModel, rewardsModal);
  return (
    <>
      <div className="flex w-full flex-col gap-5 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
        <div className="text-[min(10vw, 20px)] textGradient font-semibold">
          Claim Rewards
        </div>
        <div className="flex flex-col justify-between gap-5 rounded-xl bg-elevation-1 p-6 md:flex-row md:items-center md:gap-10">
          <div>
            <p className="text-xs font-medium text-gray-shade-14">My Rewards</p>
            <div className="text-[min(10vw, 20px)] mt-[6px] flex items-center gap-1 font-semibold text-white">
              <p>1156</p>
              <p>BUSD</p>
              <p className="text-gray-shade-14">($ 1,469.74)</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <FinalButton
              className="h-9"
              title="Claim Rewards"
              borderRounded="10px"
              onClick={() => modal.createModal(ModalType.stakeRewardsModal)}
            />
          </div>
        </div>
      </div>
      <RewardsTable />
      {ModalModel.visibility && (
        <CustomModal
          onClose={() => {
            modal.dismissModal();
          }}
          title={ModalModel.title as string}
        >
          {ModalModel.content}
        </CustomModal>
      )}
    </>
  );
};

ClaimRewards.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Staking Details">
      <StakingDetailsWrapper>{page}</StakingDetailsWrapper>
    </AllPagesWrapper>
  );
};

export default ClaimRewards;
