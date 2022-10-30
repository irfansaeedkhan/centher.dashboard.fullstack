
export interface Address {
  97: string;
  56: string;
  5: string;
  4: string;
  1: string;
}


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
