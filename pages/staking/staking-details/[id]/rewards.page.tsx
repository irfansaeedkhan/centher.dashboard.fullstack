import React, { useEffect, useState } from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { CustomModal } from "@/components/modal/custom.modal";
import FinalButton from "@/components/button/final.button";
import RewardsTable from "./_components/rewards-table";
import StakingDetailsWrapper from "./_components/staking-details-wrapper";
import StakeRewardModal from "./_components/stake-reward-modal";
import UnstakeModal from "./_components/unstake-modal";
import { ZeroAddress } from "@/web3/constants/common";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { ListCardDataOBj } from "../../_components/list-card-data";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import useUser from "@/hooks/use.user";
import { useRouter } from "next/router";
import { useStaking } from "@/hooks/staking";
import { useWeb3React } from "@web3-react/core";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { formatUnits } from "ethers/lib/utils";
import {
  ClaimedRewards,
  GetClaimedRewardsInput,
  RewardsStat,
} from "@/staking/types/rewards.interface";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import { eqAddress } from "@/live/utils/address.utils";

enum ModalType {
  stakeRewardsModal = "stakeRewardsModal",
  cancelStakingModal = "cancelStakingModal",
}

const ClaimRewards: NextPageWithLayout = () => {
  const { library } = useWeb3React();
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
  const [cancelAmount, setCancelAmount] = useState(0);

  const claimreward = async () => {
    try {
      if (sdk && poolId) {
        await sdk.claimReward(library, +poolId);
        //TODO=> show success modal
      } else throw new Error("Invalid params");
    } catch (error) {
      //TODO=> show error modal
      console.log(error);
    }
  };

  const valueChanged = (value: string) => {
    if (formatUnits(userStaked?.totalStakeAmount + "", 18) < value) {
      setCancelErrors("value is bigger than all your staking amount");
    }
    setCancelAmount(+value);
  };

  const cancelSubmit = async () => {
    if (cancelAmount <= 0) {
      setCancelErrors("Amount is required");
    }

    try {
      if (sdk && poolId) {
        await sdk.unstake(library, +poolId, cancelAmount + "");
        //TODO=> success modal
      } else throw new Error("invalid params");
    } catch (error) {
      console.log(error);
      //TODO=> show error modal
    }
  };

  const rewardsModal: TemplateCollection = {
    stakeRewardsModal: {
      title: "Claim reward",
      visibility: true,
      content: () => (
        <StakeRewardModal
          onClose={() => modal.dismissModal()}
          onConfirm={claimreward}
        />
      ),
    },
    cancelStakingModal: {
      title: "Unstake",
      visibility: true,
      content: () => (
        <UnstakeModal
          valueChanged={valueChanged}
          submit={cancelSubmit}
          errors={cancelErrors}
        />
      ),
    },
  };

  useEffect(() => {
    const getCoinDetails = async (tokens: string[]) => {
      const list: string[] = [];
      tokens.forEach((e) => {
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
      sdk.getProject(+poolId).then((pool) => {
        if (pool) {
          getCoinDetails([pool.stakeToken, pool.rewardToken]).then();
          const mappedPools = setupUiModels([pool]);
          setStakingPool(mappedPools[0]);
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
    if (poolId && library && user && !claimableReward) {
      sdk?.getUserClaimableRewards(library, +poolId, user._id).then((data) => {
        setClaimableReward(data);
      });
    }
  }, [poolId, library]);

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
    if (sdk && poolId && user && library && !userStaked) {
      sdk.getUserStakes(library, +poolId, user._id).then((data) => {
        setUserStaked(data);
      });
    }
  }, [poolId, sdk, user, library]);

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
            <FinalButton
              className="h-9"
              title="Claim Rewards"
              borderRounded="10px"
              disabled={+claimableReward <= 0}
              onClick={() => modal.createModal(ModalType.stakeRewardsModal)}
            />
            {stakingPool?.is_cancelable ? (
              <FinalButton
                variant="danger"
                className="h-9"
                title="Cancel Staking"
                borderRounded="10px"
                disabled={
                  userStaked && +userStaked?.totalStakeAmount > 0 ? false : true
                }
                onClick={() => modal.createModal(ModalType.cancelStakingModal)}
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
