import { PaginatedRequest } from "./general";

export interface RefReward {
  referrer: string;
  reward: string;
  transactionHash: string;
  staker: string;
  poolId: number;
  id: string;
  blockTimestamp: number;
  blockNumber: number;
}

export class GetRefRewardInput extends PaginatedRequest {
  poolId: string = "";
  user: string = "";

  constructor(page: number, pageSize: number, poolId: string, user: string) {
    super();
    this.page = page;
    this.pageSize = pageSize;
    this.poolId = poolId;
    this.user = user;
  }
}
