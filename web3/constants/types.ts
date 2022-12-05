export interface Address {
  97: string;
  56: string;
  5: string;
  4: string;
  1: string;
}

export interface RoundInfo {
  rateForBusd: number;
  rateForNtr: number;
  startTime: number;
  duration: number;
  lockMonths: number;
  busdRaised: number;
  ntrRaised: number;
  minContributionForBusd: number;
  maxContributionForBusd: number;
  minContributionForNtr: number;
  maxContributionForNtr: number;
}

// uint256 rateForBusd;
// uint256 rateForNtr;
// uint256 startTime;
// uint256 duration;
// uint8 lockMonths;
// uint256 busdRaised;
// uint256 ntrRaised;
// uint256 minContributionForBusd;
// uint256 minContributionForNtr;
// uint256 maxContributionForBusd;
// uint256 maxContributionForNtr;

export interface PurchasedInfoResponse {
  contributedBusdAmount: number;
  contributedNtrAmount: number;
  purchaseTime: number;
  claimedTokenAmount: number;
  totalClaimableTokenAmount: number;
}

// uint256 contributedBusdAmount;
// uint256 contributedNtrAmount;
// uint256 purchaseTime;
// uint256 claimedTokenAmount;
// uint256 totalClaimableTokenAmount;

export interface PurchasedInfo {
  purchasedDate: string;
  contributedBusdAmount: number;
  ntrdaoAmount: number;
  bonusAmount: number;
  lockmonths: number;
  remainingDate: number;
  claimed: boolean;
}

export enum RoundState {
  RoundsNotStarted,
  Round1Started,
  Round2NotStarted,
  Round2Started,
  Round3NotStarted,
  Round3Started,
  RoundsEnded,
}

export type RoundStatus = "not-started" | "active" | "ended" | undefined;
