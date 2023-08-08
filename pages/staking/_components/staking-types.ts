export type multilevel =
  | "Select Any"
  | "multilevel1"
  | "multilevel2"
  | "multilevel3";

export const multilevel: multilevel[] = [
  "Select Any",
  "multilevel1",
  "multilevel2",
  "multilevel3",
];

export interface stakingFormInterface {
  pack: string;
  token_address: string;
  multilevel_rewards:
    | "No referral"
    | "Recurring Return (0 to 6 levels)"
    | "Fix Commission (0 to 6 levels)"
    | "";

  apy: number | null;
  staking_period: string;
  start_time: string;
  claim_period: string;
  show_on_centher: "yes" | "no";
  liquidity_pool_provided: "yes" | "no";
  is_cancelable: "yes" | "no";
  charge_fee_on_cancel: number | null;
  min_staking_amount: number | null;
  max_staking_amount: number | null;
  project_metadata?: metaDataType[];
  rewards_level?: levelDataType[];
}

export type metaDataType = {
  title: string;
  data: string;
};
export type levelDataType = {
  level: number;
  percent: number;
};

export type teamMember = {
  jobTitle: string;
  walletAddress: string;
};

export interface citizenshipFormInterface {
  websiteUrl: string;
  facebook: string;
  twitter: string;
  github: string;
  telegram: string;
  instagram: string;
  discord: string;
  reddit: string;
  explorers: string;
  category: string;
  description: string;
  members?: teamMember[];
}
