export interface Genealogy {
  id: number;
  level: string;
  percent: number;
  people: number;
  generatedBUSD: number;
  generatedNTR: number;
  generatedBNB: number;
  children: GenealogyChild[];
}

export interface GenealogyChild {
  id: number;
  level: string;
  user: string;
  people: number;
  generatedBUSD: number;
  generatedNTR: number;
  generatedBNB: number;
  active: boolean;
}

export interface RewardsTotal {
  people: number;
  busd: number;
  ntr: number;
  bnb: number;
}
export interface ReferralReward {
  id: string;
  createdAt: number;
  user: string;
  level: number;
  round: number;
  isBusd: boolean;
  amount: number;
}

export interface ReferralClaimItem {
  createdAt: number;
  amount: number;
}

export interface ReferralClaim {
  busd: ReferralClaimItem[];
  ntr: ReferralClaimItem[];
}

export interface RewardsEachAsset {
  busd: number;
  ntr: number;
  bnb: number;
}
