import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { formatUnits, isAddress } from "ethers/lib/utils";
import { FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ClaimableReward, MetamaskIcon2, StakingUsers } from "@/assets/svgs";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import useUser from "@/hooks/use.user";
import { useStaking } from "@/hooks/staking";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { ZeroAddress } from "@/web3/constants/common";
import {
  GetRefRewardInput,
  RefReward,
} from "@/staking/types/ref.rewards.interface";
import {
  GetReferralsInput,
  Referral,
} from "@/staking/types/referrals.interface";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import { eqAddress } from "@/live/utils/address.utils";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { CustomModal } from "@/components/modal/custom.modal";
import { PreLoader } from "@/components/pre.loader";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { CustomNewModal } from "@/components/modal/custom.new.modal";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { ListCardDataOBj } from "../../_components/list-card-data";
import StakingDetailsWrapper from "./_components/staking-details-wrapper";
import ReferralsTable from "./_components/referrals-table";
import SuccessModalContent from "./_components/success-modal-content";
import FailedModalContent from "./_components/failed-modal-content";

enum ModalType {
  successFuncModal = "successFuncModal",
  failedFuncModal = "failedFuncModal",
}

const StakingReferrals: NextPageWithLayout = () => {
  const { library, deactivate } = useWeb3React();
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
  const { connectWallet } = useConnectWallet();
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [claimRefRewardInProgress, setClaimRefRewardInProgress] = useState("");

  const [referralsInfo, setReferralsInfo] = useState<{
    data: Referral[];
    count: number;
    totalRewards: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!library) {
      setConnectWalletModal(true);
    } else {
      setConnectWalletModal(false);
    }
  }, [library]);

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
    if (user && sdk && poolId) {
      sdk
        .getClaimedRefRewards(
          new GetRefRewardInput(+page, +pageSize, poolId, user._id)
        )
        .then((data) => {
          setClaimedRewards(data);
          const total = data.reduce(
            (a: number, b: { amount: string }) => a + +b.amount,
            0
          );
          setTotalClaimed(total + "");
        });
    }
  }, [poolId, sdk, user, page, pageSize, currentTab, stakingPool]);

  useEffect(() => {
    if (user && sdk && poolId && stakingPool) {
      let maxLevel =
        stakingPool?.rewards_level?.find((e) => !e.percent || +e.percent == 0)
          ?.level || 6;
      sdk
        .getUserReferrals(
          library,
          new GetReferralsInput(
            poolId,
            user._id,
            maxLevel,
            stakingPool.multilevel_rewards ==
              "Recurring Return (0 to 6 levels)",
            +page,
            +pageSize
          )
        )
        .then((data) => {
          setReferralsInfo(data);
        });
    }
  }, [poolId, sdk, user, page, pageSize, currentTab, stakingPool]);

  const claimRefReward = async (user: string) => {
    try {
      if (isAddress(user) && sdk && poolId) {
        setClaimRefRewardInProgress(user);
        await sdk.claimRefReward(library, +poolId, user);
        modal.createModal(ModalType.successFuncModal);
      } else throw new Error("invalid params");
    } catch (error) {
      modal.createModal(ModalType.failedFuncModal);
    } finally {
      setClaimRefRewardInProgress("");
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    successFuncModal: {
      title: "Creating Staking Pack",
      visibility: true,
      content: () => (
        <SuccessModalContent
          title="Claim referrals reward"
          message="You claimed referral reward successfully, please reload the page to get the latest details."
        />
      ),
    },
    failedFuncModal: {
      title: "Creating Staking Pack",
      visibility: true,
      content: () => (
        <FailedModalContent
          message="Something went wrong, please try later or contact support."
          title="Claim referreral reward failed"
        />
      ),
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

  return (
    <>
      <div className="flex w-full flex-col gap-5 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
        <div className="text-[min(10vw, 20px)] textGradient font-semibold">
          Referrals Overview
        </div>
        <div className="grid-col-1 mt-5 grid max-w-full flex-grow flex-wrap gap-5 fmd:grid-cols-2 flg:grid-cols-3">
          <div className="col-span-2 flex h-[96px] w-full gap-4 rounded-xl bg-elevation-1 px-5 py-6 fmd:col-span-1">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-brand-primary/60 bg-brand-primary/10">
              <ClaimableReward />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Claimed Rewards
              </p>
              <p className="mt-[6px] font-semibold text-white">
                {formatUnits(
                  normalizeValue(totalClaimed + ""),
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
          <div className="col-span-2 flex h-[96px] w-full gap-4 rounded-xl bg-elevation-1 px-5 py-6 fmd:col-span-1">
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
          <div className="col-span-2 flex h-[96px] w-full gap-4 rounded-xl bg-elevation-1 px-5 py-6 flg:col-span-1">
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
        isClaiming={claimRefRewardInProgress}
        rewards={claimedRewards}
        referrals={referralsInfo?.data}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        claimRefReward={claimRefReward}
        pool={stakingPool}
        coins={coinsDetails}
        claimable={
          stakingPool?.multilevel_rewards == "Recurring Return (0 to 6 levels)"
        }
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
      {connectWalletModal && (
        <CustomNewModal
          onClose={() => {
            setConnectWalletModal(false);
          }}
          title={"Connect to wallet"}
        >
          <div className="mb-8 flex w-full justify-center px-5 md:px-10">
            <p className="mt-2 w-full max-w-[366px] text-center text-sm text-gray-shade-14">
              Please Connect your wallet to continue, the system support
              following wallet.
            </p>
          </div>
          <div className="flex w-full justify-center px-5 md:px-10">
            <div className="flex w-full max-w-[400px] items-center justify-between gap-10 rounded-xl border border-brand-primary px-5 py-3">
              <div className="flex items-center gap-3 fsm:gap-6">
                <MetamaskIcon2 />
                <h3 className="text-sm font-semibold text-white fmd:text-base">
                  Metamask
                </h3>
              </div>
              <button
                onClick={async () => {
                  if (!user) {
                    toast.error("Please login to buy this membership");
                    setConnectWalletModal(false);
                    return;
                  }
                  const _account = await connectWallet();
                  if (user._id.toLowerCase() !== _account?.toLowerCase()) {
                    toast.error("Please connect to correct account");
                    deactivate();
                  }
                  setConnectWalletModal(false);
                }}
              >
                <FiArrowRight className="h-6 w-6 text-brand-primary fsm:h-8 fsm:w-8" />
              </button>
            </div>
          </div>
        </CustomNewModal>
      )}

      {!connectWalletModal && (isLoading || !referralsInfo) ? (
        <PreLoader />
      ) : (
        ""
      )}
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
