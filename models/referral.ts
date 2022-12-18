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

export interface ReferralRewardInLaunchpad {
  id: string;
  createdAt: number;
  user: string;
  level: number;
  round: number;
  isBusd: boolean;
  amount: number;
}

export interface RewardsEachAsset {
  busd: number;
  ntr: number;
  bnb: number;
}
