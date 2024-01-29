export type ClaimableDataType = {
  user_address: string;
  staking_started_at: string;
  level: number;
  staked_amount: number;
  staked_amount_coin: string;
  claimable_amount: number;
  claimable_amount_coin: string;
  rewards_available: Date;
};

export type EarnedDataType = {
  user_address: string;
  staking_started_at: string;
  level: number;
  staked_amount: number;
  staked_amount_coin: string;
  earned_reward_amount: number;
  earned_reward_amount_coin: string;
  rewards_available: Date;
  date_received: Date;
  status: "Claimed" | "Unclaimed";
};

export type ClaimedDataType = {
  claim_date: Date;
  claim_amount: number;
  claim_amount_coin: string;
  burn_tax: number;
  burn_amount: number;
  burn_amount_coin: string;
  net_profit: number;
  net_profit_coin: string;
  claim_number: number;
  transaction_hash: string;
};

export type StakingTokenDataType = {
  start_date: Date;
  token_staked: number;
  token_staked_coin: string;
  locked_expiration: Date;
  capital_available: Date;
};

export const ClaimableData: ClaimableDataType[] = [
  {
    user_address: "0x123abc456def789ghi",
    staking_started_at: "2023-01-01T12:00:00Z",
    level: 1,
    staked_amount: 100,
    staked_amount_coin: "ETH",
    claimable_amount: 10,
    claimable_amount_coin: "ETH",
    rewards_available: new Date("2023-02-01T12:00:00Z"),
  },
  {
    user_address: "0x456def789ghi123abc",
    staking_started_at: "2023-02-15T14:30:00Z",
    level: 2,
    staked_amount: 200,
    staked_amount_coin: "BTC",
    claimable_amount: 20,
    claimable_amount_coin: "BTC",
    rewards_available: new Date("2023-03-15T14:30:00Z"),
  },
  {
    user_address: "0x789ghi123abc456def",
    staking_started_at: "2023-03-20T10:45:00Z",
    level: 3,
    staked_amount: 300,
    staked_amount_coin: "LTC",
    claimable_amount: 30,
    claimable_amount_coin: "LTC",
    rewards_available: new Date("2024-04-20T10:45:00Z"),
  },
  {
    user_address: "0xdef789ghi123abc456",
    staking_started_at: "2023-04-05T18:15:00Z",
    level: 1,
    staked_amount: 150,
    staked_amount_coin: "ETH",
    claimable_amount: 15,
    claimable_amount_coin: "ETH",
    rewards_available: new Date("2023-05-05T18:15:00Z"),
  },
];

export const EarnedData: EarnedDataType[] = [
  {
    user_address: "0x123abc",
    staking_started_at: "2023-01-01T00:00:00Z",
    level: 1,
    staked_amount: 100,
    staked_amount_coin: "ETH",
    earned_reward_amount: 10,
    earned_reward_amount_coin: "ABC",
    rewards_available: new Date("2023-02-01T12:00:00Z"),
    date_received: new Date("2023-02-01T10:30:00Z"),
    status: "Claimed",
  },
  {
    user_address: "0x456def",
    staking_started_at: "2023-02-15T08:00:00Z",
    level: 2,
    staked_amount: 200,
    staked_amount_coin: "ETH",
    earned_reward_amount: 20,
    earned_reward_amount_coin: "ABC",
    rewards_available: new Date("2024-03-01T15:45:00Z"),
    date_received: new Date("2023-03-01T14:20:00Z"),
    status: "Unclaimed",
  },
  {
    user_address: "0x789ghi",
    staking_started_at: "2023-03-10T16:30:00Z",
    level: 3,
    staked_amount: 300,
    staked_amount_coin: "ETH",
    earned_reward_amount: 30,
    earned_reward_amount_coin: "ABC",
    rewards_available: new Date("2024-04-01T18:20:00Z"),
    date_received: new Date("2023-04-01T17:10:00Z"),
    status: "Unclaimed",
  },
  {
    user_address: "0xabc456",
    staking_started_at: "2023-04-05T12:00:00Z",
    level: 1,
    staked_amount: 150,
    staked_amount_coin: "ETH",
    earned_reward_amount: 15,
    earned_reward_amount_coin: "ABC",
    rewards_available: new Date("2023-05-01T09:30:00Z"),
    date_received: new Date("2023-05-01T08:15:00Z"),
    status: "Claimed",
  },
  {
    user_address: "0xdef789",
    staking_started_at: "2023-05-20T18:45:00Z",
    level: 2,
    staked_amount: 250,
    staked_amount_coin: "ETH",
    earned_reward_amount: 25,
    earned_reward_amount_coin: "ABC",
    rewards_available: new Date("2024-06-01T14:10:00Z"),
    date_received: new Date("2023-06-01T13:00:00Z"),
    status: "Unclaimed",
  },
  {
    user_address: "0xghi123",
    staking_started_at: "2023-06-25T09:30:00Z",
    level: 3,
    staked_amount: 350,
    staked_amount_coin: "ETH",
    earned_reward_amount: 35,
    earned_reward_amount_coin: "ABC",
    rewards_available: new Date("2023-07-01T19:45:00Z"),
    date_received: new Date("2023-07-01T18:30:00Z"),
    status: "Unclaimed",
  },
];

export const ClaimedData: ClaimedDataType[] = [
  {
    claim_date: new Date("2023-01-10T15:30:00Z"),
    claim_amount: 50,
    claim_amount_coin: "ABC",
    burn_tax: 2,
    burn_amount: 5,
    burn_amount_coin: "ETH",
    net_profit: 43,
    net_profit_coin: "ABC",
    claim_number: 1,
    transaction_hash: "0xabcdef1234567890",
  },
  {
    claim_date: new Date("2023-02-20T12:45:00Z"),
    claim_amount: 75,
    claim_amount_coin: "ABC",
    burn_tax: 3,
    burn_amount: 8,
    burn_amount_coin: "ETH",
    net_profit: 64,
    net_profit_coin: "ABC",
    claim_number: 2,
    transaction_hash: "0x1234567890abcdef",
  },
  {
    claim_date: new Date("2023-03-15T18:00:00Z"),
    claim_amount: 100,
    claim_amount_coin: "ABC",
    burn_tax: 5,
    burn_amount: 10,
    burn_amount_coin: "ETH",
    net_profit: 85,
    net_profit_coin: "ABC",
    claim_number: 3,
    transaction_hash: "0x7890abcdef12345",
  },
  {
    claim_date: new Date("2023-04-05T09:15:00Z"),
    claim_amount: 120,
    claim_amount_coin: "ABC",
    burn_tax: 6,
    burn_amount: 12,
    burn_amount_coin: "ETH",
    net_profit: 102,
    net_profit_coin: "ABC",
    claim_number: 4,
    transaction_hash: "0xabcdef5678901234",
  },
  {
    claim_date: new Date("2023-05-12T14:30:00Z"),
    claim_amount: 90,
    claim_amount_coin: "ABC",
    burn_tax: 4,
    burn_amount: 7,
    burn_amount_coin: "ETH",
    net_profit: 79,
    net_profit_coin: "ABC",
    claim_number: 5,
    transaction_hash: "0x567890abcdef0123",
  },
  {
    claim_date: new Date("2023-06-18T11:45:00Z"),
    claim_amount: 110,
    claim_amount_coin: "ABC",
    burn_tax: 5,
    burn_amount: 11,
    burn_amount_coin: "ETH",
    net_profit: 94,
    net_profit_coin: "ABC",
    claim_number: 6,
    transaction_hash: "0xabcdef0123456789",
  },
  {
    claim_date: new Date("2023-07-25T17:00:00Z"),
    claim_amount: 130,
    claim_amount_coin: "ABC",
    burn_tax: 7,
    burn_amount: 13,
    burn_amount_coin: "ETH",
    net_profit: 110,
    net_profit_coin: "ABC",
    claim_number: 7,
    transaction_hash: "0x0123456789abcdef",
  },
];

export const StakingTokenData: StakingTokenDataType[] = [
  {
    start_date: new Date("2023-01-01T12:00:00Z"),
    token_staked: 1000,
    token_staked_coin: "ETH",
    locked_expiration: new Date("2023-02-01T12:00:00Z"),
    capital_available: new Date("2023-02-01T10:30:00Z"),
  },
  {
    start_date: new Date("2023-02-15T08:00:00Z"),
    token_staked: 2000,
    token_staked_coin: "ETH",
    locked_expiration: new Date("2023-03-01T15:45:00Z"),
    capital_available: new Date("2024-03-01T14:20:00Z"),
  },
  {
    start_date: new Date("2023-03-10T16:30:00Z"),
    token_staked: 3000,
    token_staked_coin: "ETH",
    locked_expiration: new Date("2023-04-01T18:20:00Z"),
    capital_available: new Date("2023-04-01T17:10:00Z"),
  },
  {
    start_date: new Date("2023-04-05T12:00:00Z"),
    token_staked: 1500,
    token_staked_coin: "ETH",
    locked_expiration: new Date("2023-05-01T09:30:00Z"),
    capital_available: new Date("2023-05-01T08:15:00Z"),
  },
  {
    start_date: new Date("2023-05-20T18:45:00Z"),
    token_staked: 2500,
    token_staked_coin: "ETH",
    locked_expiration: new Date("2023-06-01T14:10:00Z"),
    capital_available: new Date("2023-06-01T13:00:00Z"),
  },
  {
    start_date: new Date("2023-06-25T09:30:00Z"),
    token_staked: 3500,
    token_staked_coin: "ETH",
    locked_expiration: new Date("2023-07-01T19:45:00Z"),
    capital_available: new Date("2023-07-01T18:30:00Z"),
  },
];
