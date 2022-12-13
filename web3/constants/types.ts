export interface Address {
  97: string;
  56: string;
  5: string;
  4: string;
  1: string;
}

export type RoundStatus = "not-started" | "active" | "ended" | undefined;
export type RoundNumber = 0 | 1 | 2;

export interface RoundInfo {
  round: RoundNumber;
  status: RoundStatus;
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

export interface ContributionInfo {
  contributedBusdAmount: number;
  contributedNtrAmount: number;
  purchaseTimeForBusd: string;
  purchaseTimeForNtr: string;
  claimedTokenAmountForBusd: number;
  claimedTokenAmountForNtr: number;
  totalClaimableTokenAmountForBusd: number;
  totalClaimableTokenAmountForNtr: number;
  isClaimableForBusd: boolean;
  isClaimableForNtr: boolean;
  hasClaimedAllForBusd: boolean;
  hasClaimedAllForNtr: boolean;
}

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
  RoundsEnded = -4,
  Round3NotStarted,
  Round2NotStarted,
  RoundsNotStarted,
  Round1Started,
  Round2Started,
  Round3Started,
}
