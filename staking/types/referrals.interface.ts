import { PaginatedRequest } from "./general";

// export interface RefStake {
//   type: string;
//   amount: string;
//   endAt: string;
// }

export interface Referral {
  referrer: string;
  joinedAt: string;
  id: string;
  level: string;
  // transfers: RefStake[];
  stakedAmount?: string;
  claimableReward?: string;
}

export class GetReferralsInput extends PaginatedRequest {
  poolId: string = "";
  user: string = "";
  levels: number;
  isClaimable: boolean = false;

  constructor(
    poolId: string,
    user: string,
    levels: number,
    claimable: boolean,
    page: number,
    pageSize: number
  ) {
    super();
    this.poolId = poolId;
    this.user = user;
    this.page = page;
    this.pageSize = pageSize;
    this.levels = levels;
    this.isClaimable = claimable;
  }
}
