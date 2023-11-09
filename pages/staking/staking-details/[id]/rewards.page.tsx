import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { formatUnits } from "ethers/lib/utils";
import { CgSpinner } from "react-icons/cg";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";
import { ZeroAddress } from "@/web3/constants/common";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import useUser from "@/hooks/use.user";
import { useStaking } from "@/hooks/staking";
import {
  ClaimedRewards,
  GetClaimedRewardsInput,
  RewardsStat,
} from "@/staking/types/rewards.interface";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import { eqAddress } from "@/live/utils/address.utils";
import { PreLoader } from "@/components/pre.loader";
import { useWallet } from "@/web3/hooks/use.wallet";
import RewardsTable from "@/pages/staking/staking-details/[id]/_components/rewards-table";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import StakingDetailsWrapper from "@/pages/staking/staking-details/[id]/_components/staking-details-wrapper";
import UnstakeModal from "@/pages/staking/staking-details/[id]/_components/unstake-modal";
import SuccessModalContent from "@/pages/staking/staking-details/[id]/_components/success-modal-content";
import FailedModalContent from "@/pages/staking/staking-details/[id]/_components/failed-modal-content";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";

enum ModalType {
  cancelStakingModal = "cancelStakingModal",
  successFuncModal = "successFuncModal",
  failedFuncModal = "failedFuncModal",
}

const ClaimRewards: NextPageWithLayout = () => {
  const { getSigner, disconnectWallet } = useWallet();
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);
  const [coinsDetails, setCoinsDetails] = useState<
    Array<CoinDetails | undefined>
  >([]);
  const { user } = useUser();
  const router = useRouter();
  const { sdk } = useStaking();
  const [poolId, setPoolId] = useState("0");
  const [claimableReward, setClaimableReward] = useState("0");
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [userStaked, setUserStaked] = useState<RewardsStat | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [rewards, setRewards] = useState<ClaimedRewards[]>([]);
  const [cancelErrors, setCancelErrors] = useState("");
  const [cancelAmount, setCancelAmount] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [claimInProcess, setClaimInProcess] = useState(false);
  const [cancelInProcess, setCancelInProcess] = useState(false);
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [restakeInProgress, setRestakeInProgress] = useState(false);

  useEffect(() => {
    if (!getSigner()) {
      setConnectWalletModal(true);
    } else {
      setConnectWalletModal(false);
    }
  }, [getSigner]);

  const claimreward = async () => {
    try {
      if (sdk && poolId) {
        setClaimInProcess(true);
        await sdk.claimReward(getSigner()!, +poolId);
        setClaimInProcess(false);
        modal.createModal(ModalType.successFuncModal, {
          message:
            "You claimed your reward successfully, please reload the page to get the latest updates.",
          title: "Claim Reward",
        });
      } else throw new Error("Invalid params");
    } catch (error) {
      modal.createModal(ModalType.failedFuncModal, {
        message: "Claim reward failed",
        title: "Claim Reward",
      });
    } finally {
      setClaimInProcess(false);
    }
  };

  const cancelSubmit = async (cancelAmount: string) => {
    try {
      if (+formatUnits(userStaked?.totalStakeAmount + "", 18) < +cancelAmount) {
        throw new Error("value is bigger than all your staking amount");
      }

      if (+cancelAmount <= 0) {
        throw new Error("value must be bigger than 0");
      }

      if (sdk && poolId) {
        modal.dismissModal();
        setCancelInProcess(true);
        await sdk.unstake(getSigner()!, +poolId, cancelAmount);
        modal.createModal(ModalType.successFuncModal, {
          title: "Cancel Staking",
          message:
            "Your request processed successfully, Reload the page to get the latest details",
        });
      } else throw new Error("invalid params");
    } catch (error) {
      modal.createModal(ModalType.failedFuncModal, {
        title: "Cancel Staking Failed",
        message: "Request failed",
      });
    } finally {
      setCancelInProcess(false);
    }
  };

  const restakeClicked = async () => {
    try {
      if (sdk && poolId) {
        setRestakeInProgress(true);
        await sdk.restake(getSigner()!, +poolId);
        setRestakeInProgress(false);
        modal.createModal(ModalType.successFuncModal, {
          message:
            "You restaked your rewards successfully, please reload the page to get the latest updates.",
          title: "Restake Rewards",
        });
      } else throw new Error("Invalid params");
    } catch (error) {
      modal.createModal(ModalType.failedFuncModal, {
        message: "Restake Rewards Failed",
        title: "Restake Rewards",
      });
    } finally {
      setRestakeInProgress(false);
    }
  };

  const rewardsModal: TemplateCollection = {
    cancelStakingModal: {
      title: "Unstake",
      visibility: true,
      content: () => (
        <UnstakeModal submit={cancelSubmit} errors={cancelErrors} />
      ),
    },
    successFuncModal: {
      title: "Creating Staking Pack",
      visibility: true,
      content: (input: { message: string; title: string }) => (
        <SuccessModalContent message={input.message} title={input.title} />
      ),
    },

    failedFuncModal: {
      title: "Claim failed",
      visibility: true,
      content: (input: { message: string; title: string }) => (
        <FailedModalContent message={input.message} title={input.title} />
      ),
    },
  };

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
    if (poolId && getSigner() && user && claimableReward == "0") {
      sdk?.getUserStakes(getSigner()!, +poolId, user._id).then((data) => {
        setClaimableReward(data.totalClaimableReward);
      });
    }
  }, [poolId, getSigner]);

  useEffect(() => {
    if (sdk && user && poolId && !rewards.length) {
      sdk
        ?.getUserClaimedRewards(
          new GetClaimedRewardsInput(user?._id, poolId, page, +pageSize)
        )
        .then((data) => {
          setRewards(data);
        });
    }
  }, [sdk, user, poolId, page, pageSize]);

  useEffect(() => {
    if (sdk && poolId && user && getSigner()) {
      sdk.getUserStakes(getSigner()!, +poolId, user._id).then((data) => {
        setUserStaked(data);
      });
    }
  }, [poolId, sdk, user, getSigner]);

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
              <p>
                {formatUnits(
                  claimableReward + "",
                  coinsDetails.find((e) =>
                    eqAddress(
                      e?.contractAddress,
                      stakingPool?.reward_token_address
                    )
                  )?.decimals
                )}
              </p>
              <p>
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              className="h-9"
              title="Claim Rewards"
              borderRounded="10px"
              disabled={+claimableReward <= 0}
              onClick={claimreward}
              loaderIcon={
                claimInProcess ? (
                  <CgSpinner className="h-5 animate-spin text-white" />
                ) : undefined
              }
            />
            {eqAddress(
              stakingPool?.token_address,
              stakingPool?.reward_token_address
            ) ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  variant="primary"
                  className="h-9"
                  title="Restake Rewards"
                  borderRounded="10px"
                  disabled={+claimableReward <= 0}
                  onClick={restakeClicked}
                  loaderIcon={
                    restakeInProgress ? (
                      <CgSpinner className="h-5 animate-spin text-white" />
                    ) : undefined
                  }
                />
              </div>
            ) : (
              ""
            )}
            {stakingPool?.is_cancelable == "yes" ? (
              <Button
                variant="danger"
                className="h-9"
                title="Cancel Staking"
                borderRounded="10px"
                disabled={
                  userStaked && +userStaked?.totalStakeAmount > 0 ? false : true
                }
                onClick={() => modal.createModal(ModalType.cancelStakingModal)}
                loaderIcon={
                  cancelInProcess ? (
                    <CgSpinner className="h-5 animate-spin text-white" />
                  ) : undefined
                }
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <RewardsTable
        data={rewards}
        decimals={
          coinsDetails.find((e) =>
            eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
          )?.decimals as string
        }
        token={
          coinsDetails.find((e) =>
            eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
          )?.symbol as string
        }
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
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
      {connectWalletModal && (
        <ConnectWalletModal
          setConnectWalletModal={setConnectWalletModal}
          loggedInUser={user}
        />
      )}
      {!connectWalletModal && (isLoading || !userStaked) ? <PreLoader /> : ""}
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
