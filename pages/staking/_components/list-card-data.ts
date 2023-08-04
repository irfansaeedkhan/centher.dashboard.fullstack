export const ListCardData: ListCardData = [
  {
    pack: "Pack 1",
    token_address: "0x018rhf63hjj7763kuxx098nbvxx90cc23BBK99KXX028",
    apy: "10%",
    price: "200 BNB",
    sybmol: "DPI",
    staking_period: "3 months",
    claim_period: "Monthly",
    liquidity_pool_provided: "yes",
    is_cancelable: "yes",
    show_on_centher: "yes",
    charge_fee_on_cancel: 0.8,
    start_time: "13 jully, 2023, 12 PM",
    max_staking_amount: 200,
    min_staking_amount: 10,
    multilevel_rewards: "level 3",
    rewards_level: [
      {
        level: 1,
        percent: 10,
      },
      {
        level: 2,
        percent: 4,
      },
      {
        level: 3,
        percent: 3,
      },
      {
        level: 4,
        percent: 0,
      },
      {
        level: 5,
        percent: 0,
      },
      {
        level: 6,
        percent: 0,
      },
    ],
    project_metadata: [
      {
        title: "Project Name",
        data: "Centher",
      },
    ],
  },
  {
    pack: "Pack 2",
    token_address: "0x018rhf63hjj7763kuxx098nbvxx90cc23BBK99KXX028",
    apy: "10%",
    price: "200 BNB",
    sybmol: "DPI",
    staking_period: "6 months",
    claim_period: "Monthly",
    liquidity_pool_provided: "no",
    is_cancelable: "no",
    show_on_centher: "no",
    charge_fee_on_cancel: 0.8,
    start_time: "13 jully, 2023, 12 PM",
    max_staking_amount: 200,
    min_staking_amount: 10,
    multilevel_rewards: "level 6",
    rewards_level: [
      {
        level: 1,
        percent: 10,
      },
      {
        level: 2,
        percent: 4,
      },
      {
        level: 3,
        percent: 3,
      },
      {
        level: 4,
        percent: 5,
      },
      {
        level: 5,
        percent: 2,
      },
      {
        level: 6,
        percent: 9,
      },
    ],
    project_metadata: [
      {
        title: "Project 2",
        data: "Dexa",
      },
      {
        title: "Project 3",
        data: "Dexa 2",
      },
    ],
  },
];

type ListCardData = {
  pack: string;
  price: string;
  sybmol: string;
  token_address: string;
  apy: string;
  staking_period: string;
  claim_period: string;
  liquidity_pool_provided: "yes" | "no";
  is_cancelable: "yes" | "no";
  show_on_centher: "yes" | "no";
  charge_fee_on_cancel: number;
  start_time: string;
  max_staking_amount: number;
  min_staking_amount: number;
  multilevel_rewards?: "no level" | "level 3" | "level 6";
  rewards_level?: { level: number; percent: number }[];
  project_metadata?: {
    title: string;
    data: string;
  }[];
}[];
export type ListCardDataOBj = {
  pack: string;
  price: string;
  sybmol: string;
  token_address: string;
  apy: string;
  staking_period: string;
  claim_period: string;
  liquidity_pool_provided: "yes" | "no";
  is_cancelable: "yes" | "no";
  show_on_centher: "yes" | "no";
  charge_fee_on_cancel: number;
  start_time: string;
  max_staking_amount: number;
  min_staking_amount: number;
  multilevel_rewards?: "no level" | "level 3" | "level 6";
  rewards_level?: { level: number; percent: number }[];
  project_metadata?: {
    title: string;
    data: string;
  }[];
};
