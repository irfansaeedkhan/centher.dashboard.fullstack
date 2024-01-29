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
  nextTime?: string;
  user: string;
}

export class GetReferralsInput {
  poolId: string = "";
  user: string = "";
  levels: number;
  isClaimable: boolean = false;

  constructor(
    poolId: string,
    user: string,
    levels: number,
    claimable: boolean
  ) {
    this.poolId = poolId;
    this.user = user;
    this.levels = levels;
    this.isClaimable = claimable;
  }
}
