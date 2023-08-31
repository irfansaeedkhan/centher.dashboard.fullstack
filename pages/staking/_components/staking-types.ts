import { OptionalType } from "@/staking/types";

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

export interface CategoryOption {
  value: string;
  label: string;
}

export type MultiLevelRewards =
  | "No referral"
  | "Recurring Return (0 to 6 levels)"
  | "Fix Commission (0 to 6 levels)"
  | ""
  | number;

export interface stakingFormInterface {
  staking_name: string;
  token_address: string;
  reward_token_address: string;
  multilevel_rewards: MultiLevelRewards;
  apy: number | null;
  staking_reward_token_price_ratio: number | null;
  staking_period: string;
  start_date: string;
  claim_period: string;
  rewards_release_start: string;
  show_on_centher: "yes" | "no";
  liquidity_pool_provided: "yes" | "no";
  is_cancelable: "yes" | "no";
  charge_fee_on_cancel: number | null;
  min_staking_amount: number | null;
  max_staking_amount: number | null;
  total_supply: number | null;
  project_metadata?: metaDataType[];
  rewards_level?: levelDataType[];
  website_url: string;
  whitepaper: string;
  facebook: string;
  twitter: string;
  github: string;
  telegram: string;
  instagram: string;
  discord: string;
  centher: string;
  reddit: string;
  explorers: string;
  category: CategoryOption[] | [];
  description: string;
  members?: teamMember[];
}

export interface stakingFormInterfaceUpdated extends stakingFormInterface {
  cover_image: OptionalType<Blob>;
  profile_image: OptionalType<Blob>;
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

export interface citizenshipFormInterface {}
