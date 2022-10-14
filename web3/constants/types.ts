export interface RoundInfo {
  price: number;
  startTime: number;
  duration: number;
  bonusRate: number;
  lockMonths: number;
  busdRaised: number;
  minContribution: number;
  maxContribution: number;
}

export interface PurchasedInfoResponse {
  purchasedDate: number;
  contributedBusdAmount: number;
  claimedAmount: number;
  // ntrdaoAmount: number
  // bonusAmount: number
  // lockmonths: number
  // remainingDate: number
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
  Round1,
  Round2,
  Round3,
  Undefind,
}
