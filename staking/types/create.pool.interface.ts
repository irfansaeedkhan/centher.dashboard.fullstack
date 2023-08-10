import { CreatePoolStepsEnum } from "../enum/create-pool-steps.enum";
import { OptionalType } from "./general";

export interface CreatePoolMetadata {
  library: { title: string; data: string }[];
  banner: string;
  icon: string;
  socialMedias: { name: string; link: string }[];
  categories: { value: string; label: string }[];
  description: string;
  team: { jobTitle: string; walletAddress: string }[];
}

export interface StakingFiles {
  banner: OptionalType<Blob>;
  logo: OptionalType<Blob>;
}

export interface CreatePoolInput {
  ownerAddress: string;
  name: string;
  startTime: string;
  stakeToken: string;
  rewardToken: string;
  rate: number;
  annualStakingRewardRate: number;
  minStakeAmount: number;
  maxStakeAmount: number;
  stakingDurationPeriod: number;
  claimDuration: number;
  rewardModeForRef: number;
  firstReward: number;
  maxStakableAmount: number;
  cancellationFees: number;
  poolMetadata: CreatePoolMetadata;
  metaDataUrl: string;
  isUnstakable: boolean;
  isLP: boolean;
  showOnCenther: boolean;
}

export interface MappedCreatePoolInput {
  name: string;
  startTime: string;
  stakeToken: string;
  rewardToken: string;
  rate: number;
  annualStakingRewardRate: number;
  minStakeAmount: string;
  maxStakeAmount: string;
  stakingDurationPeriod: number;
  claimDuration: number;
  rewardModeForRef: number;
  firstReward: number;
  maxStakableAmount: string;
  cancellationFees: number;
  poolMetadata: string;
  isUnstakable: boolean;
  isLP: boolean;
  showOnCenther: boolean;
}

export interface AddAffiliateSettingsInput {
  levelOne: number;
  levelTwo: number;
  levelThree: number;
  levelFour: number;
  levelFive: number;
  levelSix: number;
}

export type ProgressCallback = (
  processName: CreatePoolStepsEnum,
  progress: number
) => void;
