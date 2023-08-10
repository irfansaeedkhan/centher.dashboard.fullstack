import { CreatePoolInput, MappedCreatePoolInput } from "../types";
import { ZeroAddress } from "@/web3/constants/common";
import { isAddress, parseEther } from "ethers/lib/utils";
import { CreatePoolParamsError } from "../errors/params.error";
import { eqAddress } from "@/live/utils/address.utils";

export function setupCreatePoolData(
  input: CreatePoolInput
): MappedCreatePoolInput {
  const rewardIsDifferent =
    input.rewardToken?.length != 0 &&
    !eqAddress(input.rewardToken, input.rewardToken);

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

  if (rewardIsDifferent && input.rate <= 0) {
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

  if (+new Date(input.startTime) < +new Date()) {
    throw new CreatePoolParamsError<CreatePoolInput>(
      "startTime",
      "Must be bigger than today"
    );
  }

  return {
    name: input.name,
    startTime: +new Date(input.startTime) / 1000 + "",
    stakeToken: input.stakeToken,
    rewardToken: input.rewardToken ? input.rewardToken : ZeroAddress,
    rate: rewardIsDifferent ? input.rate : 0,
    annualStakingRewardRate: input.annualStakingRewardRate,
    minStakeAmount: parseEther(input.minStakeAmount + "").toString(),
    maxStakeAmount: parseEther(input.maxStakeAmount + "").toString(),
    stakingDurationPeriod: input.stakingDurationPeriod,
    claimDuration: input.claimDuration,
    rewardModeForRef: input.rewardModeForRef,
    firstReward: input.firstReward,
    maxStakableAmount: parseEther(input.maxStakableAmount + "").toString(),
    cancellationFees: input.cancellationFees ? input.cancellationFees : 0,
    poolMetadata: "",
    isUnstakable: input.isUnstakable,
    isLP: input.isLP,
    showOnCenther: input.showOnCenther,
  };
}
