import React, { useEffect, useState } from "react";
import { useStaking } from "@/hooks/staking";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { eqAddress } from "@/live/utils/address.utils";
import { useWallet } from "@/web3/hooks/use.wallet";
import { UserStakingTransfers } from "@/staking/types/get.projects.interface";
import { calculateNextReward } from "@/staking/helpers/stake.helper";
import {
  AllUserReward,
  UserStakingDetails,
  stakeReward,
} from "@/staking/types";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { CustomModal } from "@/components/modal/custom.modal";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { ToggleAutoRestakeStatusParams } from "@/lib/staking";
import SuccessModalContent from "../success-modal-content";
import FailedModalContent from "../failed-modal-content";
import { HistoryTabs } from "../shared";
import { AutoRestakeModal, AutoRestakeModalProps } from "./modals";
import {
  RewardsClaimable,
  RewardsClaimed,
  RewardsEarned,
  RewardsStakingToken,
} from "./";

enum ModalType {
  success = "success",
  failed = "failed",
  // reload = "reload",
}

export const RewardsTabs: React.FC<{
  pool: ListCardDataOBj;
  coins: CoinDetails[];
  reloadPool: any;
  isAutoRestakeEnabled: boolean;
  handleToggleAutoRestake: (
    params: ToggleAutoRestakeStatusParams
  ) => Promise<void>;
}> = ({
  pool,
  coins,
  reloadPool,
  isAutoRestakeEnabled,
  handleToggleAutoRestake,
}) => {
  const stakeTypes = ["stake", "rewardRestake", "refRewardRestake"];
  const { getSigner, connectedAddress } = useWallet();
  const [isClaimable, setIsClaimable] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isReward, setIsReward] = useState(false);
  const [isStakingToken, setIsStakingToken] = useState(false);
  const [unstakeInProgresses, setUnstakeInProgresses] = useState<number[]>([]);
  const [restakeInProgresses, setRestakeInProgresses] = useState<number[]>([]);
  const [claimInProgresses, setClaimInProgresses] = useState<number[]>([]);
  const [preparingRewardsDetail, setPreparingRewardsDetail] = useState(false);
  const [stakesRewards, setStakesRewards] = useState<stakeReward[]>([]);
  const [batchActionIsInProgress, setBatchActionIsInProgress] = useState("");
  const [claimableRewardAction, setClaimableRewardAction] = useState<
    { title: string; handler: any }[]
  >([]);
  const [stakesAction, setStakesAction] = useState<
    { title: string; handler: any }[]
  >([]);
  const [stakeBatchActionsLoading, setStakeBatchActionsLoading] =
    useState(true);
  const { sdk } = useStaking();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [allUserRewards, setAllUserRewards] = useState<AllUserReward[]>([]);
  const [unstakables, setUnstakables] = useState<UserStakingTransfers[]>([]);
  const [autoRestakeModal, setAutoRestakeModal] =
    useState<AutoRestakeModalProps["modalName"]>(null);

  const reloadPoolData = async () => {
    await reloadPool();
  };

  const getPoolTransfers = async (transfers?: UserStakingTransfers[]) => {
    if (transfers) {
      return transfers;
    }

    if (sdk && connectedAddress && pool) {
      const temp = await sdk.getProject(+pool.id, connectedAddress);
      if (temp) {
        const mappedPools = setupUiModels([temp]);
        return mappedPools[0].transfers;
      } else return null;
    }
  };

  async function getStakeDetails(
    stake: UserStakingTransfers
  ): Promise<UserStakingDetails> {
    const signer = getSigner();
    if (sdk && signer && connectedAddress?.length) {
      const details = await sdk.getStakeDetails(
        signer,
        +pool.id,
        connectedAddress,
        stake.id
      );
      return { ...stake, ...details };
    }
    throw new Error("invalid dependencies");
  }

  async function getStakesDetails(
    stakes: UserStakingTransfers[]
  ): Promise<UserStakingDetails[]> {
    const result = [];
    for (const stake of stakes.filter((e) => !e.unstake)) {
      const details = await getStakeDetails(stake);
      result.push(details);
    }
    return result;
  }

  const unstake = async (stakeIds: number[], mode?: string) => {
    try {
      const signer = getSigner();
      if (signer && pool) {
        setUnstakeInProgresses([]);
        setUnstakeInProgresses(stakeIds);
        if (mode?.length) {
          setBatchActionIsInProgress(mode);
        } else {
          setBatchActionIsInProgress("unstake");
        }

        await sdk?.unstake(signer, +pool.id, stakeIds);
        await reloadPoolData();
        setUnstakeInProgresses([]);
        setBatchActionIsInProgress("");
        modal.createModal(ModalType.success, {
          message: "You unstaked your tokens successfully.",
          title: "Unstaked successfully",
        });
      } else {
        throw new Error("invalid signer");
      }
    } catch (error: any) {
      setUnstakeInProgresses([]);
      setBatchActionIsInProgress("");
      let message = error instanceof Error ? error.message : error;

      if (
        typeof message == "string" &&
        message.includes("ClaimedRewardExist")
      ) {
        message =
          "You have unclaimed rewards connected to this staking, please claim them before unstaking";
      }

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
        title: "Unstake failed",
      });
    }
  };

  const restake = async (stakeIds: number[], mode?: string) => {
    try {
      const signer = getSigner();
      if (signer && pool && stakeIds?.length) {
        setRestakeInProgresses([]);
        setRestakeInProgresses(stakeIds);

        if (mode?.length) {
          setBatchActionIsInProgress(mode);
        } else {
          setBatchActionIsInProgress("restake");
        }
        await sdk?.restake(signer, +pool.id, stakeIds);
        await reloadPoolData();
        setRestakeInProgresses([]);
        setBatchActionIsInProgress("");
        modal.createModal(ModalType.success, {
          message:
            "You'll find your new active stake in Personal Rewards page under the tab Staking Token Summary, the rewards will be collectible in the Claimable Rewards History tab.",
          title: "Restaked successfully",
        });
      } else {
        throw new Error("invalid signer");
      }
    } catch (error) {
      setRestakeInProgresses([]);
      setBatchActionIsInProgress("");
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
        title: "Restake failed",
      });
    }
  };

  const claim = async (stakeIds: number[], mode?: string) => {
    try {
      const signer = getSigner();
      if (signer && pool) {
        setClaimInProgresses([]);
        setClaimInProgresses(stakeIds);

        if (mode?.length) {
          setBatchActionIsInProgress(mode);
        } else {
          setBatchActionIsInProgress("claim");
        }

        await sdk?.claimReward(signer, +pool.id, stakeIds);
        await reloadPoolData();
        setClaimInProgresses([]);
        setBatchActionIsInProgress("");
        modal.createModal(ModalType.success, {
          message:
            "You successfully claimed your rewards directly to your wallet. You can find the transaction hash in the tab Claimed Rewards History.",
          title: "Claimed successfully",
        });
      } else {
        throw new Error("invalid signer");
      }
    } catch (error) {
      setClaimInProgresses([]);
      setBatchActionIsInProgress("");
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
    }
  };

  const unstakeAll = async (records: number[]) => {
    if (records?.length) {
      await unstake(records, "Unstake All");
    }
  };

  const claimAll = async (records: number[]) => {
    if (records?.length) {
      await claim(records, "Claim All");
    }
  };

  const restakeAll = async (records: number[]) => {
    if (records?.length) {
      await restake(records, "Restake All");
    }
  };

  async function getPrepareRewards(
    currentTransfer?: UserStakingTransfers[]
  ): Promise<stakeReward[]> {
    let rewards: stakeReward[] = [];
    const transfers = await getPoolTransfers(currentTransfer);
    const result = await getStakesDetails(
      transfers?.filter((e) => stakeTypes.includes(e.type) && !e.unstake) || []
    );

    result.forEach((e) => {
      let item: stakeReward = {
        stake: e,
        amount: "0",
        nextTime: "0",
      };
      if (+e.totalClaimableReward > 0) {
        item.amount = e.totalClaimableReward;
        item.nextTime = "0";
      } else if (e.endAt > +new Date() / 1000) {
        item.amount = calculateNextReward(pool, e.amount) + "";
        item.nextTime = e.nextClaimTime;
      }
      rewards.push(item);
    });

    rewards = rewards.filter((e) => +e.amount > 0 || +e.nextTime > 0);

    setStakesRewards(rewards);

    const now = Math.floor(+new Date() / 1000);

    const validStakes = pool?.transfers?.filter(
      (e) => stakeTypes.includes(e.type) && e.endAt > now
    );

    const claimableRewards = rewards?.filter((e) => +e.nextTime <= now);

    if (claimableRewards.length > 1) {
      if (validStakes.length) {
        setClaimableRewardAction([
          {
            title:
              (isAutoRestakeEnabled ? "Disable" : "Enable") + " Auto Restake",
            handler: () => {
              if (isAutoRestakeEnabled) {
                setAutoRestakeModal("disable-auto-restake");
              } else {
                setAutoRestakeModal("enable-auto-restake");
              }
            },
          },
          { title: "Claim All", handler: claimAll },
          { title: "Restake All", handler: restakeAll },
        ]);
      } else {
        setClaimableRewardAction([
          { title: "Claim All", handler: claimAll },
          { title: "Restake All", handler: restakeAll },
        ]);
      }
    } else {
      if (validStakes.length) {
        setClaimableRewardAction([
          {
            title:
              (isAutoRestakeEnabled ? "Disable" : "Enable") + " Auto Restake",
            handler: () => {
              if (isAutoRestakeEnabled) {
                setAutoRestakeModal("disable-auto-restake");
              } else {
                setAutoRestakeModal("enable-auto-restake");
              }
            },
          },
        ]);
      } else {
        setClaimableRewardAction([]);
      }
    }

    return rewards;
  }

  function getPrepareStaking(): void {
    let unstakables: UserStakingTransfers[] = [];
    if (!pool.nonRefundable) {
      unstakables = pool?.transfers?.filter(
        (e) =>
          stakeTypes.includes(e.type) &&
          !e.unstake &&
          e.endAt < +new Date() / 1000
      );
    }

    setUnstakables(unstakables);
    if (unstakables?.length > 1) {
      setStakesAction([{ title: "Unstake All", handler: unstakeAll }]);
    } else {
      setStakesAction([]);
    }
  }

  useEffect(() => {
    if (pool && sdk && connectedAddress?.length) {
      setPreparingRewardsDetail(true);
      setStakeBatchActionsLoading(true);
      getPrepareRewards(pool.transfers).then((result) => {
        createAllUserRewards(result);
        setPreparingRewardsDetail(false);
      });

      getPrepareStaking();
      setStakeBatchActionsLoading(false);
    }
  }, [pool, sdk, connectedAddress, isAutoRestakeEnabled]);

  const createAllUserRewards = (rewards: stakeReward[]) => {
    const claimedRewards = pool.rewards
      .filter((e) => e.type == "main")
      .map((e) => {
        return { status: "Claimed", amount: e.amount, claimedAt: e.createdAt };
      });

    const claimableRewards = rewards
      .filter((e) => +e.nextTime <= +new Date() / 1000)
      .map((e) => {
        return {
          status: "Claimable",
          amount: e.amount,
        };
      });

    setAllUserRewards([...claimableRewards, ...claimedRewards]);
  };

  const reloadRewards = async (type: string) => {
    await getPrepareRewards();
  };

  const reloadStaking = async () => {
    await getPrepareStaking();
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

    // reload: {
    //   title: "Alert",
    //   visibility: true,
    //   content: (input: { type: string; close: any }) => (
    //     <ReloadRequiredModalContent type={input.type} close={input.close} />
    //   ),
    // },
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
        buttons={claimableRewardAction}
        title="Claimable Rewards History"
        loader={batchActionIsInProgress}
        actionAreaLoading={preparingRewardsDetail}
        records={stakesRewards
          .filter((e) => +e.nextTime <= Math.floor(+new Date() / 1000))
          .map((e) => {
            return e.stake.id;
          })}
      />
      &nbsp;
      {isClaimable && (
        <RewardsClaimable
          isLoading={preparingRewardsDetail}
          data={stakesRewards}
          coin={coins.find((e) =>
            eqAddress(e.contractAddress, pool.token_address)
          )}
          claim={claim}
          restake={restake}
          claimInProcess={claimInProgresses}
          restakeInProgress={restakeInProgresses}
          reload={reloadRewards}
        />
      )}
      &nbsp;
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
        loader={batchActionIsInProgress}
        actionAreaLoading={false}
      />
      {isReward && (
        <RewardsEarned
          rewards={allUserRewards}
          coin={coins.find((e) =>
            eqAddress(e.contractAddress, pool.reward_token_address)
          )}
          isLoading={preparingRewardsDetail}
        />
      )}
      &nbsp;
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
        loader={batchActionIsInProgress}
        actionAreaLoading={false}
      />
      &nbsp;
      {isClaimed && (
        <RewardsClaimed
          data={pool.rewards.sort((a, b) => b.createdAt - a.createdAt)}
          tax={+(pool?.burn_tax || 0)}
          tokenDecimals={
            +(
              coins.find((e) =>
                eqAddress(e?.contractAddress, pool?.reward_token_address)
              )?.decimals || 18
            )
          }
          tokenName={
            coins.find((e) =>
              eqAddress(e?.contractAddress, pool?.reward_token_address)
            )?.symbol || ""
          }
        />
      )}
      &nbsp;
      <HistoryTabs
        isOpen={isStakingToken}
        onClose={() => {
          setIsClaimable(false);
          setIsClaimed(false);
          setIsReward(false);
          setIsStakingToken(!isStakingToken);
        }}
        buttons={stakesAction}
        title="Staking Token Summary"
        loader={batchActionIsInProgress}
        actionAreaLoading={stakeBatchActionsLoading}
        records={unstakables.map((e) => {
          return e.id;
        })}
      />
      &nbsp;
      {isStakingToken && (
        <RewardsStakingToken
          unstake={unstake}
          unstakeInProgresses={unstakeInProgresses}
          nonRefundable={pool?.nonRefundable || false}
          data={pool?.transfers
            ?.filter((e) => stakeTypes.includes(e.type))
            ?.sort((a, b) => a.endAt - b.endAt)}
          tokenDecimal={
            +(
              coins.find((e) =>
                eqAddress(e?.contractAddress, pool?.token_address)
              )?.decimals || 18
            )
          }
          tokenName={
            coins.find((e) =>
              eqAddress(e?.contractAddress, pool?.token_address)
            )?.symbol || ""
          }
          reload={reloadStaking}
        />
      )}
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
      <AutoRestakeModal
        modalName={autoRestakeModal}
        onClose={() => setAutoRestakeModal(null)}
        onClickActionButton={() => {
          return autoRestakeModal === "enable-auto-restake"
            ? handleToggleAutoRestake({
                pool_id: +pool.id,
                is_auto_restake_enabled: true,
              }).then(() => {
                setAutoRestakeModal("auto-restake-enabled");
              })
            : autoRestakeModal === "disable-auto-restake"
            ? handleToggleAutoRestake({
                pool_id: +pool.id,
                is_auto_restake_enabled: false,
              }).then(() => {
                setAutoRestakeModal("auto-restake-disabled");
              })
            : (async () => {
                setAutoRestakeModal(null);
              })();
        }}
      />
    </div>
  );
};
