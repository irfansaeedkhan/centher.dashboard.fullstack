import { CreatePoolInput, MappedCreatePoolInput } from "../types";
import { ZeroAddress } from "@/web3/constants/common";
import { formatUnits, isAddress, parseEther } from "ethers/lib/utils";
import { CreatePoolParamsError } from "../errors/params.error";
import { eqAddress } from "@/live/utils/address.utils";
import { StakingProject } from "../types/get.projects.interface";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";

export function setupCreatePoolData(
  input: CreatePoolInput
): MappedCreatePoolInput {
  const rewardIsDifferent =
    input.rewardToken?.length != 0 &&
    !eqAddress(input.stakeToken, input.rewardToken);

  if (!isAddress(input.stakeToken)) {
    throw new CreatePoolParamsError<CreatePoolInput>(
      "stakeToken",
      "invalid address"
    );
  }

  if (rewardIsDifferent && !isAddress(input.rewardToken)) {
    throw new CreatePoolParamsError<CreatePoolInput>(
      "rewardToken",
      "invalid address"
    );
  }

  if (rewardIsDifferent && (!input.rate || input.rate <= 0)) {
    throw new CreatePoolParamsError<CreatePoolInput>(
      "rate",
      "rate must be bigger than 0"
    );
  }

  if (
    input.minStakeAmount > 0 &&
    input.maxStakeAmount > 0 &&
    input.minStakeAmount > input.maxStakeAmount
  ) {
    throw new CreatePoolParamsError<CreatePoolInput>(
      "maxStakeAmount",
      "Must be bigger than minStakeAmount"
    );
  }

  if (input.maxStakableAmount < input.maxStakeAmount) {
    throw new CreatePoolParamsError<CreatePoolInput>(
      "maxStakableAmount",
      "Must be bigger than maxStakeAmount"
    );
  }

  if (isToday(new Date(input.startTime))) {
    const distanceFromNow = 30 * 60 * 1000;
    input.startTime = +new Date() + distanceFromNow + "";
  } else {
    input.startTime = +new Date(input.startTime) + "";
  }

  if (+new Date(input.startTime) < +new Date()) {
    throw new CreatePoolParamsError<CreatePoolInput>(
      "startTime",
      "Must be bigger than today"
    );
  }

  return {
    name: input.name,
    startTime: Math.floor(+new Date(+input.startTime) / 1000),
    stakeToken: input.stakeToken,
    rewardToken: rewardIsDifferent ? input.rewardToken : ZeroAddress,
    rate: rewardIsDifferent ? parseEther(input.rate + "").toString() : "0",
    annualStakingRewardRate: input.annualStakingRewardRate * 100,
    minStakeAmount: parseEther(input.minStakeAmount + "").toString() || "0",
    maxStakeAmount: parseEther(input.maxStakeAmount + "").toString() || "0",
    stakingDurationPeriod: input.stakingDurationPeriod,
    claimDuration: input.claimDuration,
    rewardModeForRef: input.rewardModeForRef,
    firstReward: input.firstReward,
    maxStakableAmount:
      parseEther(input.maxStakableAmount + "").toString() || "0",
    cancellationFees: input.cancellationFees ? input.cancellationFees * 100 : 0,
    poolMetadata: "",
    isUnstakable: input.isUnstakable,
    isLP: input.isLP,
    showOnCenther: input.showOnCenther,
  };
}

export function setupUiModels(input: StakingProject[]): ListCardDataOBj[] {
  return input.map((e) => {
    return {
      id: e.id + "",
      pack: e.name,
      rate: +formatUnits(e.rate),
      price: "",
      sybmol: "",
      token_address: e.stakeToken,
      reward_token_address: e.rewardToken,
      apy: e.annualStakingRewardRate + "",
      staking_period: e.stakingDurationPeriod + "",
      claim_period: e.claimDuration + "",
      liquidity_pool_provided: e.isLP ? "yes" : "no",
      is_cancelable: e.isUnstakable ? "yes" : "no",
      show_on_centher: "yes",
      charge_fee_on_cancel: e.cancellationFees + "",
      start_time: e.startTime + "",
      max_staking_amount: e.maxStakeAmount,
      min_staking_amount: e.minStakeAmount,
      supply: e.maxStakableAmount,
      is_active: e.isActive,
      totalStakedAmount: e.totalStakedAmount + "",
      totalPaidReward: e.totalPaidReward + "",
      multilevel_rewards:
        e.rewardModeForRef == 0
          ? "No referral"
          : e.rewardModeForRef == 1
          ? "Fix Commission (0 to 6 levels)"
          : "Recurring Return (0 to 6 levels)",
      rewards_level: [
        { level: 1, percent: e.levelOne },
        { level: 2, percent: e.levelTwo },
        { level: 3, percent: e.levelThree },
        { level: 4, percent: e.levelFour },
        { level: 5, percent: e.levelFive },
        { level: 6, percent: e.levelSix },
      ],
      metadata: null,
      metadataUrl: e.metadataUri,
      users: e.users,
      transfers: e.transfers,
    };
  });
}

function isToday(dateToCheck: Date): boolean {
  const today = new Date();

  return (
    dateToCheck.getDate() === today.getDate() &&
    dateToCheck.getMonth() === today.getMonth() &&
    dateToCheck.getFullYear() === today.getFullYear()
  );
}
