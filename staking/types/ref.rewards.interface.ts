import { PaginatedRequest } from "./general";

export interface RefReward {
  user: string;
  type: string;
  txId: string;
  startDuration: string;
  referral: string;
  projectId: string;
  id: string;
  endDuration: string;
  createdAt: string;
  amount: string;
  paidTax: string;
}

export class GetRefRewardInput {
  poolId: string = "";
  user: string = "";

  constructor(poolId: string, user: string) {
    this.poolId = poolId;
    this.user = user;
  }
}
