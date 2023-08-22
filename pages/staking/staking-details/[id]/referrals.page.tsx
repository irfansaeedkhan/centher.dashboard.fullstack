import React, { useEffect, useState } from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ClaimableReward, StakingUsers } from "@/assets/svgs";

import StakingDetailsWrapper from "./_components/staking-details-wrapper";
import ReferralsTable from "./_components/referrals-table";
import { useWeb3React } from "@web3-react/core";
import { ListCardDataOBj } from "../../_components/list-card-data";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import useUser from "@/hooks/use.user";
import { useRouter } from "next/router";
import { useStaking } from "@/hooks/staking";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { ZeroAddress } from "@/web3/constants/common";
import {
  GetRefRewardInput,
  RefReward,
} from "@/staking/types/ref.rewards.interface";
import { formatUnits, isAddress } from "ethers/lib/utils";
import {
  GetReferralsInput,
  Referral,
} from "@/staking/types/referrals.interface";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import { eqAddress } from "@/live/utils/address.utils";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { CustomModal } from "@/components/modal/custom.modal";
import SuccessModalContent from "./_components/success-modal-content";
import FailedModalContent from "./_components/failed-modal-content";
import { PreLoader } from "@/components/pre.loader";

enum ModalType {
  successFuncModal = "successFuncModal",
  failedFuncModal = "failedFuncModal",
}

const StakingReferrals: NextPageWithLayout = () => {
  const { library } = useWeb3React();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [coinsDetails, setCoinsDetails] = useState<
    Array<CoinDetails | undefined>
  >([]);
  const { user } = useUser();
  const router = useRouter();
  const { sdk } = useStaking();
  const [poolId, setPoolId] = useState("0");
  const [totalClaimed, setTotalClaimed] = useState("0");
  const [claimedRewards, setClaimedRewards] = useState<RefReward[]>([]);
  const [page, setPage] = useState("1");
  const [pageSize, setPageSize] = useState("10");
  const [currentTab, setCurrentTab] = useState<"rewards" | "referrals">(
    "rewards"
  );

  const [referralsInfo, setReferralsInfo] = useState<{
    data: Referral[];
    count: number;
    totalRewards: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCoinDetails = async (tokens: string[]) => {
      const list: string[] = [];
      tokens.filter(Boolean).forEach((e) => {
        if (e != ZeroAddress && list.indexOf(e) == -1) {
          list.push(e);
        }
      });

      const details = await fetchTokenMetadata(list);
      const tokenDetails = details.map((e: any) => e.token._value);
      setCoinsDetails(
        tokenDetails.map((e: any) => {
          return {
            ...e,
            contractAddress: e.contractAddress._value,
            chain: e.chain._value,
          };
        })
      );
    };

    if (!stakingPool && poolId && sdk) {
      setIsLoading(true);
      sdk.getProject(+poolId).then((pool) => {
        if (pool) {
          getCoinDetails([pool.stakeToken, pool.rewardToken]).then();
          const mappedPools = setupUiModels([pool]);
          setStakingPool(mappedPools[0]);
          setIsLoading(false);
        }
        //else {//redirect to index}
      });
    }
  }, [stakingPool, poolId, sdk]);

  useEffect(() => {
    const poolId = router.query.id as string;
    setPoolId(poolId);
  }, [poolId, router]);

  useEffect(() => {
    if (user && sdk && poolId && !totalClaimed) {
      sdk.getTotalClaimedRefReward(poolId, user._id).then((data) => {
        setTotalClaimed(data);
      });
    }

    if (user && sdk && poolId && !claimedRewards.length) {
      sdk
        .getClaimedRefRewards(
          new GetRefRewardInput(+page, +pageSize, poolId, user._id)
        )
        .then((data) => {
          setClaimedRewards(data);
        });
    }

    if (user && sdk && poolId && stakingPool && !referralsInfo) {
      let maxLevel =
        stakingPool?.rewards_level?.find((e) => !e.percent)?.level || 6;

      sdk
        .getUserReferrals(
          library,
          new GetReferralsInput(poolId, user._id, maxLevel, +page, +pageSize)
        )
        .then((data) => {
          setReferralsInfo(data);
        });
    }
  }, [poolId, sdk, user, page, pageSize, currentTab, stakingPool]);

  const claimRefReward = async (user: string) => {
    try {
      if (isAddress(user) && sdk && poolId) {
        await sdk.claimRefReward(library, +poolId, user);
        //TODO=> show success modal
        modal.createModal(ModalType.successFuncModal);
      } else throw new Error("invalid params");
    } catch (error) {
      //TODO=> show erro modal
      console.log(error);
      modal.createModal(ModalType.failedFuncModal);
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    successFuncModal: {
      title: "Creating Staking Pack",
      visibility: true,
      content: () => <SuccessModalContent />,
    },
    failedFuncModal: {
      title: "Creating Staking Pack",
      visibility: true,
      content: () => <FailedModalContent message="" />,
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

  return (
    <>
      <div className="flex w-full flex-col gap-5 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
        <div className="text-[min(10vw, 20px)] textGradient font-semibold">
          Referrals Overview
        </div>
        <div className="scrollSetLight2 flex max-w-full flex-grow gap-5 overflow-x-auto">
          <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-brand-primary/60 bg-brand-primary/10">
              <ClaimableReward />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Claimed Rewards
              </p>
              <p className="mt-[6px] font-semibold text-white">
                {formatUnits(
                  totalClaimed,
                  coinsDetails.find((e) =>
                    eqAddress(
                      e?.contractAddress,
                      stakingPool?.reward_token_address
                    )
                  )?.decimals
                )}{" "}
                {
                  coinsDetails.find((e) =>
                    eqAddress(
                      e?.contractAddress,
                      stakingPool?.reward_token_address
                    )
                  )?.symbol
                }
              </p>
            </div>
          </div>
          <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#D35DB9]/60 bg-[#D35DB9]/10">
              <ClaimableReward />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Claimable Rewards
              </p>
              <p className="mt-[6px] font-semibold text-white">
                {formatUnits(
                  referralsInfo?.totalRewards
                    ? referralsInfo.totalRewards + ""
                    : "0",
                  coinsDetails.find((e) =>
                    eqAddress(
                      e?.contractAddress,
                      stakingPool?.reward_token_address
                    )
                  )?.decimals
                )}{" "}
                {
                  coinsDetails.find((e) =>
                    eqAddress(
                      e?.contractAddress,
                      stakingPool?.reward_token_address
                    )
                  )?.symbol
                }
              </p>
            </div>
          </div>
          <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#5F97FF]/60 bg-[#5F97FF]/10">
              <StakingUsers />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Referrals
              </p>
              <p className="mt-[6px] font-semibold text-white">
                {referralsInfo?.count}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ReferralsTable
        rewards={claimedRewards}
        referrals={referralsInfo?.data}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        claimRefReward={claimRefReward}
        pool={stakingPool}
        coins={coinsDetails}
      />
      {ModalModel.visibility && (
        <CustomModal
          title={ModalModel.title as string}
          onClose={() => {
            modal.dismissModal();
          }}
        >
          {ModalModel.content}
        </CustomModal>
      )}
      {isLoading || !referralsInfo ? <PreLoader /> : ""}
    </>
  );
};

StakingReferrals.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Staking Details">
      <StakingDetailsWrapper>{page}</StakingDetailsWrapper>
    </AllPagesWrapper>
  );
};

export default StakingReferrals;
