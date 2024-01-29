import { PaginatedRequest } from "./general";

export interface ClaimedRewards {
  user: string;
  txId: string;
  poolId: number;
  id: string;
  createdAt: number;
  blockNumber: number;
  amount: string;
  paidTax: string;
  destination: string;
}

export class GetClaimedRewardsInput extends PaginatedRequest {
  user: string = "";
  poolId: string = "";

  constructor(user: string, poolId: string, page: number, pageSize: number) {
    super();
    this.user = user;
    this.poolId = poolId;
    this.page = page;
    this.pageSize = pageSize;
  }
}

export interface RewardsStat {
  totalClaimableReward: string;
  totalReward: string;
  totalStakeAmount: string;
  totolUnclaimableReward: string;
}
