import {
  StakingUser,
  UserStakingTransfers,
} from "@/staking/types/get.projects.interface";

export type ListCardDataOBj = {
  id: string;
  pack: string;
  price: string;
  sybmol: string;
  token_address: string;
  reward_token_address: string;
  apy: string;
  staking_period: string;
  claim_period: string;
  liquidity_pool_provided: "yes" | "no";
  is_cancelable: "yes" | "no";
  show_on_centher: "yes" | "no";
  charge_fee_on_cancel: string;
  start_time: string;
  max_staking_amount: string;
  min_staking_amount: string;
  is_active: boolean;
  supply: string;
  totalStakedAmount: string;
  totalPaidReward: string;
  rate: number;
  multilevel_rewards?:
    | "No referral"
    | "Fix Commission (0 to 6 levels)"
    | "Recurring Return (0 to 6 levels)";
  rewards_level?: { level: number; percent: number }[];
  metadata: any;
  metadataUrl: string;
  users: StakingUser[] | undefined;
  transfers: UserStakingTransfers[] | undefined;
};
