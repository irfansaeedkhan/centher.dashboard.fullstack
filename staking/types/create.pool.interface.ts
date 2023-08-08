export interface CreatePoolMetadata {
  library: { key: string; value: string };
  banner: string;
  log: string;
  socialMedias: { name: string; link: string }[];
  categories: string[];
  description: string;
  team: { address: string; position: string }[];
}

export interface CreatePoolInput {
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
  isUnstakable: boolean;
  isLP: boolean;
  showOnCenther: boolean;
}

export interface CreatePoolResult {
  success: boolean;
  trxHash: string;
}

export interface AddAffiliateSettingsInput {
  levelOne: number;
  levelTwo: number;
  levelThree: number;
  levelFour: number;
  levelFive: number;
  levelSix: number;
}

export interface AddAffiliateSettingsResult {
  success: boolean;
  trxHash: string;
}
