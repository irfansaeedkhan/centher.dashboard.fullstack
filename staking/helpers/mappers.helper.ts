import { CreatePoolInput } from "../types";
import { ZeroAddress } from "@/web3/constants/common";
import { parseUnits } from "ethers/lib/utils";

export function setupCreatePoolData(input: CreatePoolInput): any {
  const rewardIsDifferent = input.rewardToken?.length != 0;
  return {
    name: input.name,
    startTime: input.startTime,
    stakeToken: input.stakeToken,
    rewardToken: rewardIsDifferent ? input.rewardToken : ZeroAddress,
    rate: rewardIsDifferent ? parseUnits(input.rate + "", 18) : "0",
    annualStakingRewardRate: parseUnits(input.annualStakingRewardRate + "", 18),
    minStakeAmount: parseUnits(input.minStakeAmount + "", 18),
    maxStakeAmount: parseUnits(input.maxStakeAmount + "", 18),
    stakingDurationPeriod: input.stakingDurationPeriod,
    claimDuration: input.claimDuration,
    rewardModeForRef: input.rewardModeForRef,
    firstReward: input.firstReward,
    maxStakableAmount: parseUnits(input.maxStakableAmount + "", 18),
    cancellationFees: input.cancellationFees,
    poolMetadata: "",
    isUnstakable: input.isUnstakable,
    isLP: input.isLP,
    showOnCenther: input.showOnCenther,
  };
}
