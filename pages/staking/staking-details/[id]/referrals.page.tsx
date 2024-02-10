import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { formatUnits } from "ethers/lib/utils";
import { formatEther } from "viem";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CrownIcon, GiftIcon, StakingUsers } from "@/assets/svgs";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { useStaking } from "@/hooks/staking";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { ZeroAddress } from "@/web3/constants/common";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import { eqAddress } from "@/live/utils/address.utils";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { CustomModal } from "@/components/modal/custom.modal";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { useWallet } from "@/web3/hooks/use.wallet";
import { ListCardDataOBj } from "../../_components/list-card-data";
import SuccessModalContent from "./_components/success-modal-content";
import FailedModalContent from "./_components/failed-modal-content";
import StakingMainWrapper from "../../_components/staking-main-wrapper";
import { ReferralsTabs } from "./_components/referral-components";
import { GetReferralsInput } from "@/staking/types/referrals.interface";
import { ReferralInfo } from "./_components/referral-components/referrals-tabs";
import { calculateNextRefReward } from "@/staking/helpers/stake.helper";

const StakingReferrals: NextPageWithLayout = () => {
  const { getSigner, connectWallet, connectedAddress } = useWallet();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [coinsDetails, setCoinsDetails] = useState<CoinDetails[]>([]);
  const router = useRouter();
  const { sdk } = useStaking();
  const [poolId, setPoolId] = useState("0");
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [totalClaimed, setTotalClaimed] = useState(0);
  const [totalClaimable, setTotalClaimable] = useState("0");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);

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

  async function loadData() {
    if (sdk && poolId && connectedAddress) {
      const pool = await sdk.getProject(+poolId, connectedAddress);

      if (!coinsDetails?.length && pool) {
        await getCoinDetails([pool.stakeToken, pool.rewardToken]);
      }

      const mappedPools = setupUiModels([pool]);
      const mappedPool = mappedPools[0];

      const totalClaimed = mappedPool.rewards
        .filter((e) => e.type == "ref")
        .reduce((a, b) => a + +b.amount, 0);

      let maxLevel =
        mappedPool?.rewards_level?.find((e) => !e.percent || +e.percent == 0)
          ?.level || 6;

      const refInfo = await sdk.getUserReferrals(
        getSigner()!,
        new GetReferralsInput(
          mappedPool.id,
          connectedAddress,
          maxLevel,
          mappedPool.multilevel_rewards == "Recurring Return (0 to 6 levels)"
        )
      );

      refInfo.data = refInfo.data?.map((e) => {
        if (
          e.nextTime &&
          +e.nextTime > +new Date() / 1000 &&
          e.claimableReward &&
          +e.claimableReward == 0
        ) {
          console.log(
            "create future reward:",
            e.user,
            e.nextTime,
            e.claimableReward
          );
          e.claimableReward = calculateNextRefReward(
            mappedPool,
            e.stakedAmount,
            e.level
          );
        }
        return e;
      });

      setReferralInfo(refInfo);
      setTotalClaimable(refInfo.totalRewards + "");
      setTotalClaimed(totalClaimed);
      setStakingPool(mappedPool);
      setTotalReferrals(mappedPool.users.length);
    }
  }

  useEffect(() => {
    const poolId = router.query.id as string;
    setPoolId(poolId);
  }, [router]);

  useEffect(() => {
    if (!getSigner()) {
      setConnectWalletModal(true);
    } else {
      setConnectWalletModal(false);
    }
  }, [getSigner]);

  useEffect(() => {
    if (!stakingPool && poolId && sdk && connectedAddress) {
      setIsLoading(true);
      loadData().then(() => {
        setIsLoading(false);
      });
    }
  }, [stakingPool, poolId, sdk, connectedAddress]);

  const modalTemplateCollection: TemplateCollection = {
    successFuncModal: {
      title: "Claim Reward",
      visibility: true,
      content: () => (
        <SuccessModalContent
          title="Claim referrals reward"
          message="You claimed referral reward successfully, please reload the page to get the latest details."
        />
      ),
    },
    successResttakeFuncModal: {
      title: "Restake Referral reward",
      visibility: true,
      content: () => (
        <SuccessModalContent
          title="Restake Referral reward"
          message="You staked your reward from your referral."
        />
      ),
    },
    failedFuncModal: {
      title: "Claim Referral Reward",
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

  return connectWalletModal ? (
    <ConnectWalletModal
      open={connectWalletModal}
      authType="login"
      connectWallet={connectWallet}
      onClose={() => setConnectWalletModal(false)}
      crossIcon={false}
    />
  ) : isLoading ? (
    <div className="flex h-[calc(100vh-60px)] w-full items-center justify-center">
      <Image
        src="/images/preloader.png"
        alt="preloader"
        width={64}
        height={64}
        className="h-16 w-16 flex-shrink-0 object-cover"
      />
    </div>
  ) : (
    <>
      <div className="flex w-full flex-col gap-5 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
        <div className="text-[min(10vw, 20px)] font-semibold text-white">
          Referrals Overview
        </div>
        <div className="grid-col-1 grid max-w-full flex-grow flex-wrap gap-5 fmd:grid-cols-2 flg:grid-cols-3">
          <div className="col-span-2 flex h-[48px] w-full gap-4 rounded-xl bg-transparent fmd:col-span-1">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-red-shade-2/60 bg-red-shade-2/10">
              <GiftIcon />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Claimed Rewards
              </p>
              <p className="mt-[6px] font-semibold text-white">
                {Number(
                  formatUnits(
                    normalizeValue(totalClaimed + ""),
                    coinsDetails.find((e) =>
                      eqAddress(
                        e?.contractAddress,
                        stakingPool?.reward_token_address
                      )
                    )?.decimals
                  )
                ).toFixed(3)}{" "}
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
          <div className="col-span-2 flex h-[48px] w-full gap-4 rounded-xl bg-transparent fmd:col-span-1">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-yellow-shade-2/60 bg-yellow-shade-2/10">
              <CrownIcon />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Claimable Rewards
              </p>
              <p className="mt-[6px] font-semibold text-white">
                {Number(formatEther(BigInt(totalClaimable))).toFixed(3)} {}
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
          <div className="col-span-2 flex h-[48px] w-full gap-4 rounded-xl bg-transparent flg:col-span-1">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-green-shade-2/60 bg-green-shade-2/10">
              <StakingUsers />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Referrals
              </p>
              <p className="mt-[6px] font-semibold text-white">
                {totalReferrals}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ReferralsTabs
        pool={stakingPool}
        coins={coinsDetails}
        referralInfo={referralInfo}
        reload={loadData}
      />
      {ModalModel.visibility && (
        <CustomModal
          title={" "}
          onClose={() => {
            modal.dismissModal();
          }}
        >
          {ModalModel.content}
        </CustomModal>
      )}
    </>
  );
};

StakingReferrals.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Staking Details">
      <StakingMainWrapper>{page}</StakingMainWrapper>
    </AllPagesWrapper>
  );
};

export default StakingReferrals;
