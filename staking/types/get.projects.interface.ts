import { PaginatedRequest } from "./general";

export class GetStakingProjectInput extends PaginatedRequest {
  constructor(page: number, pageSize: number) {
    super();
    this.page = page;
    this.pageSize = pageSize;
  }
}

export interface StakingReward {
  user: string;
  type: string;
  txId: string;
  startDuration: number;
  referral: string;
  projectId: number;
  id: string;
  endDuration: number;
  createdAt: number;
  amount: string;
}

export interface UserStakingTransfers {
  amount: number;
  createdAt: number;
  endAt: number;
  id: number;
  paidFee: number;
  projectId: number;
  txId: string;
  type: string;
  user: string;
}

export interface StakingUser {
  referrer: string;
  joinedAt: number;
  id: string;
  transfers?: UserStakingTransfers[];
}

export interface AffiliateLevelInfo {
  percent: number;
  level: number;
  id: string;
}

export interface AffiliateSettings {
  transactionHash: string;
  poolId: number;
  id: string;
  blockTimestamp: number;
  blockNumber: number;
  affiliateSetting?: AffiliateLevelInfo;
}

export interface StakingProject {
  id: number;
  name: string;
  startTime: number;
  poolOwner: string;
  annualStakingRewardRate: number;
  cancellationFees: number;
  claimDuration: number;
  createdAt: number;
  firstRewardDuration: number;
  isActive: boolean;
  isLP: boolean;
  isUnstakable: boolean;
  levelFive: number;
  levelFour: number;
  levelOne: number;
  levelSix: number;
  levelThree: number;
  levelTwo: number;
  maxStakableAmount: string;
  maxStakeAmount: string;
  metadataUri: string;
  minStakeAmount: string;
  rate: string;
  rewardModeForRef: number;
  rewardToken: string;
  showOnCenther: true;
  stakeToken: string;
  stakingDurationPeriod: number;
  totalPaidReward: number;
  totalStakedAmount: string;
  rewards?: StakingReward[];
  transfers?: UserStakingTransfers[];
  users?: StakingUser[];
  affiliate?: AffiliateSettings;
  tax: number;
}
