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
