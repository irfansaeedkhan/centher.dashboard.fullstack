import React, { useEffect, useState } from "react";
import { HistoryTabs } from "../shared";
import {
  ReferralsClaimable,
  ReferralsClaimed,
  ReferralsEarned,
  ReferralsStakingToken,
} from ".";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { ReferralStake } from "@/staking/types/get.projects.interface";
import { eqAddress } from "@/live/utils/address.utils";
import { Referral } from "@/staking/types/referrals.interface";
import { useWallet } from "@/web3/hooks/use.wallet";
import { useStaking } from "@/hooks/staking";
import FailedModalContent from "../failed-modal-content";
import SuccessModalContent from "../success-modal-content";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { CustomModal } from "@/components/modal/custom.modal";

enum ModalType {
  success = "success",
  failed = "failed",
}

export type ReferralInfo = {
  count: number;
  data: Referral[];
  totalRewards: number;
};

export const ReferralsTabs: React.FC<{
  pool: ListCardDataOBj | null;
  coins: CoinDetails[];
  referralInfo: ReferralInfo | null;
  reload: any;
}> = ({ pool, coins, referralInfo, reload }) => {
  const stakeTypes = ["stake", "rewardRestake", "refRewardRestake"];
  const [isClaimable, setIsClaimable] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isReward, setIsReward] = useState(false);
  const [isStakingToken, setIsStakingToken] = useState(false);
  const { sdk } = useStaking();
  const [referralStakes, setReferralStakes] = useState<ReferralStake[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<any[]>([]);
  const { getSigner, connectedAddress } = useWallet();
  const [stakingToken, setStakingToken] = useState<CoinDetails | undefined>();
  const [rewardToken, setRewardToken] = useState<CoinDetails | undefined>();
  const [isActionArealoading, setIsActionArealoading] = useState<boolean>(true);
  const [claimInProcess, setClaimInProcess] = useState<string[]>([]);
  const [restakeInProcess, setRestakeInProcess] = useState<string[]>([]);
  const [batchLoading, setBatchLoading] = useState<string>("");
  const [earnedRewards, setEarnedRewards] = useState<any[]>([]);
  const [batchActions, setBatchActions] = useState<
    { title: string; handler: any }[]
  >([]);
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });

  async function claimAll() {
    const claimable = referralInfo?.data
      .filter((e) => e.claimableReward && +e.claimableReward > 0)
      .map((e) => e.user);

    if (claimable && claimable?.length) {
      setBatchLoading("Claim All");
      await claimRefReward(claimable);
    }
  }

  async function restakeAll() {
    const claimable = referralInfo?.data
      .filter((e) => e.claimableReward && +e.claimableReward > 0)
      .map((e) => e.user);
    if (claimable && claimable?.length) {
      setBatchLoading("Restake All");
      await stakeRefReward(claimable);
    }
  }

  async function prepareReferralDetails() {
    if (pool && referralInfo) {
      setStakingToken(
        coins.find((e) => eqAddress(e.contractAddress, pool.token_address))
      );

      setRewardToken(
        coins.find((e) =>
          eqAddress(e.contractAddress, pool.reward_token_address)
        )
      );

      let myReferralsStakes: ReferralStake[] = [];
      pool.users.forEach((user) => {
        let validTransfers = user.transfers?.filter((e) =>
          stakeTypes.includes(e.type)
        );

        validTransfers = validTransfers?.map((e) => {
          return {
            ...e,
            level: referralInfo.data.find((s) => s.user == e.user)?.level,
          };
        });

        if (validTransfers) {
          myReferralsStakes = [...validTransfers];
        }
      });

      if (
        referralInfo?.data.filter(
          (e) => e.claimableReward && +e.claimableReward > 0
        )?.length > 1
      ) {
        setBatchActions([
          { title: "Claim All", handler: claimAll },
          { title: "Restake All", handler: restakeAll },
        ]);
      }

      const claimedRewards = pool.rewards.filter((e) => e.type == "ref");

      const earnedRewardsAggregated = [
        ...referralInfo.data.filter(
          (e) => e.claimableReward && +e.claimableReward > 0
        ),
        ...claimedRewards,
      ];

      setReferralStakes(myReferralsStakes);
      setClaimedRewards(claimedRewards);
      setEarnedRewards(earnedRewardsAggregated);
    } else
      return {
        claimedRewards: [],
        refInfo: null,
        referralStakes: [],
      };
  }

  useEffect(() => {
    if (pool && connectedAddress && sdk && referralInfo) {
      prepareReferralDetails()
        .then(() => {})
        .finally(() => setIsActionArealoading(false));
    }
  }, [pool, connectedAddress, sdk]);

  const claimRefReward = async (ids: string[]) => {
    try {
      if (ids?.length && sdk && pool && connectedAddress) {
        if (batchLoading?.length) {
          setBatchLoading("claim");
        }
        setClaimInProcess(ids);
        await sdk.claimRefReward(getSigner()!, +pool.id, ids);
        await reload();
        modal.createModal(ModalType.success, {
          message: "You claimed your tokens successfully.",
          title: "Rewards claimed successfully",
        });
      } else throw new Error("invalid params");
    } catch (error) {
      let message = error instanceof Error ? error.message : error;

      if (
        typeof message == "string" &&
        message.includes("call revert exception")
      ) {
        message =
          "This request cannot be done at this moment, please try after a while or contact support.";
      }

      if (
        typeof message == "string" &&
        message.includes("rejected transaction")
      ) {
        message = "Transaction rejected.";
      }

      modal.createModal(ModalType.failed, {
        message,
        title: "Claim failed",
      });
    } finally {
      setClaimInProcess([]);
      setBatchLoading("");
    }
  };

  const stakeRefReward = async (ids: string[]) => {
    try {
      if (ids?.length && sdk && pool && connectedAddress) {
        if (batchLoading?.length) {
          setBatchLoading("restake");
        }
        setRestakeInProcess(ids);
        await sdk.stakeRefReward(getSigner()!, connectedAddress, +pool.id, ids);
        await reload();
        modal.createModal(ModalType.success, {
          message:
            "You'll find your new active stake in Personal Rewards page under the tab Staking Token Summary, the rewards will be collectible in the Claimable Rewards History tab.",
          title: "Rewards restaked successfully",
        });
      } else throw new Error("invalid params");
    } catch (error) {
      let message = error instanceof Error ? error.message : error;

      if (
        typeof message == "string" &&
        message.includes("call revert exception")
      ) {
        message =
          "This request cannot be done at this moment, please try after a while or contact support.";
      }

      if (
        typeof message == "string" &&
        message.includes("rejected transaction")
      ) {
        message = "Transaction rejected.";
      }

      modal.createModal(ModalType.failed, {
        message,
        title: "Claim failed",
      });
    } finally {
      setRestakeInProcess([]);
      setBatchLoading("");
    }
  };

  const modalTemplates: TemplateCollection = {
    success: {
      title: "Creating Staking Pack",
      visibility: true,
      content: (input: { message: string; title: string }) => (
        <SuccessModalContent message={input.message} title={input.title} />
      ),
    },

    failed: {
      title: "Claim failed",
      visibility: true,
      content: (input: { message: string; title: string }) => (
        <FailedModalContent message={input.message} title={input.title} />
      ),
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplates);

  return (
    <div className="flex flex-col">
      <HistoryTabs
        isOpen={isClaimable}
        onClose={() => {
          setIsClaimed(false);
          setIsReward(false);
          setIsStakingToken(false);
          setIsClaimable(!isClaimable);
        }}
        buttons={batchActions}
        title="Claimable Rewards History"
        loader={batchLoading}
        actionAreaLoading={isActionArealoading}
      />
      <ReferralsClaimable
        open={isClaimable}
        data={referralInfo?.data}
        stakeCoin={rewardToken}
        rewardCoin={rewardToken}
        claim={claimRefReward}
        restake={stakeRefReward}
        claimInProcess={claimInProcess}
        restakeInProgress={restakeInProcess}
        reload={reload}
      />
      <HistoryTabs
        isOpen={isReward}
        onClose={() => {
          setIsClaimable(false);
          setIsClaimed(false);
          setIsStakingToken(false);
          setIsReward(!isReward);
        }}
        buttons={[]}
        title="Earned Rewards History"
        loader={""}
        actionAreaLoading={false}
      />
      <ReferralsEarned
        open={isReward}
        coin={coins.find((e) =>
          eqAddress(e.contractAddress, pool?.reward_token_address)
        )}
        data={earnedRewards}
      />
      <HistoryTabs
        isOpen={isClaimed}
        onClose={() => {
          setIsClaimable(false);
          setIsReward(false);
          setIsStakingToken(false);
          setIsClaimed(!isClaimed);
        }}
        buttons={[]}
        title="Claimed Rewards History"
        loader={""}
        actionAreaLoading={false}
      />
      <ReferralsClaimed
        open={isClaimed}
        data={claimedRewards}
        coin={coins.find((e) =>
          eqAddress(e.contractAddress, pool?.reward_token_address)
        )}
        tax={pool?.burn_tax ? +pool?.burn_tax : 0}
      />
      <HistoryTabs
        isOpen={isStakingToken}
        onClose={() => {
          setIsClaimable(false);
          setIsClaimed(false);
          setIsReward(false);
          setIsStakingToken(!isStakingToken);
        }}
        buttons={[]}
        title="Staking Token Summary"
        loader={""}
        actionAreaLoading={false}
      />
      <ReferralsStakingToken
        open={isStakingToken}
        data={referralStakes}
        coin={stakingToken}
        nonRefundable={pool?.nonRefundable || false}
      />
      {ModalModel.visibility && (
        <CustomModal
          onClose={() => {
            modal.dismissModal();
          }}
          title={" "}
        >
          {ModalModel.content}
        </CustomModal>
      )}
    </div>
  );
};
