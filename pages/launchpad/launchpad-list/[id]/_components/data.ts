export type ClaimableDataType = {
  id: string;
  user: string;
  referrer: string;
  round: number;
  amount: string;
  fundType: number;
  token: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type ClaimedDataType = {
  id: string;
  token: string;
  referrer: string;
  fundType: number;
  amount: string;
  transactionHash: string;
  blockTimestamp: string;
};

export type EarnedDataType = {
  user_address: string;
  earned_reward_amount: number;
  earned_reward_amount_coin: string;
  date_received: Date;
  status: "Claimed" | "Unclaimed";
};

// export type ClaimableDataType = {
//   user_address: string;
//   round: number;
//   rewards_available: number;
//   rewards_available_coin: string;
//   booking_amount: number;
//   booking_amount_coin: string;
//   booking_date: Date;
// };

// export type ClaimedDataType = {
//   user_address: string;
//   claim_date: Date;
//   claim_amount: number;
//   claim_amount_coin: string;
//   transaction_hash: string;
//   claimed: boolean;
// };

// export const ClaimableData: ClaimableDataType[] = [
//   {
//     user_address: "0x123abc456def789ghi",
//     round: 1,
//     booking_amount: 100,
//     booking_amount_coin: "ETH",
//     rewards_available: 10,
//     rewards_available_coin: "ETH",
//     booking_date: new Date("2023-02-01T12:00:00Z"),
//   },
//   // {
//   //   user_address: "0x456def789ghi123abc",
//   //   round: 2,
//   //   booking_amount: 200,
//   //   booking_amount_coin: "BTC",
//   //   rewards_available: 20,
//   //   rewards_available_coin: "BTC",
//   //   booking_date: new Date("2023-03-15T14:30:00Z"),
//   // },
//   // {
//   //   user_address: "0x789ghi123abc456def",
//   //   round: 3,
//   //   booking_amount: 300,
//   //   booking_amount_coin: "LTC",
//   //   rewards_available: 30,
//   //   rewards_available_coin: "LTC",
//   //   booking_date: new Date("2024-04-20T10:45:00Z"),
//   // },
//   // {
//   //   user_address: "0xdef789ghi123abc456",
//   //   round: 1,
//   //   booking_amount: 150,
//   //   booking_amount_coin: "ETH",
//   //   rewards_available: 15,
//   //   rewards_available_coin: "ETH",
//   //   booking_date: new Date("2023-05-05T18:15:00Z"),
//   // },
// ];

export const EarnedData: EarnedDataType[] = [
  {
    user_address: "0x123abc",
    earned_reward_amount: 10,
    earned_reward_amount_coin: "ABC",
    date_received: new Date("2023-02-01T10:30:00Z"),
    status: "Claimed",
  },
  // {
  //   user_address: "0x456def",
  //   earned_reward_amount: 20,
  //   earned_reward_amount_coin: "ABC",
  //   date_received: new Date("2023-03-01T14:20:00Z"),
  //   status: "Unclaimed",
  // },
  // {
  //   user_address: "0x789ghi",
  //   earned_reward_amount: 30,
  //   earned_reward_amount_coin: "ABC",
  //   date_received: new Date("2023-04-01T17:10:00Z"),
  //   status: "Unclaimed",
  // },
  // {
  //   user_address: "0xabc456",
  //   earned_reward_amount: 15,
  //   earned_reward_amount_coin: "ABC",
  //   date_received: new Date("2023-05-01T08:15:00Z"),
  //   status: "Claimed",
  // },
  // {
  //   user_address: "0xdef789",
  //   earned_reward_amount: 25,
  //   earned_reward_amount_coin: "ABC",
  //   date_received: new Date("2023-06-01T13:00:00Z"),
  //   status: "Unclaimed",
  // },
  // {
  //   user_address: "0xghi123",
  //   earned_reward_amount: 35,
  //   earned_reward_amount_coin: "ABC",
  //   date_received: new Date("2023-07-01T18:30:00Z"),
  //   status: "Unclaimed",
  // },
];

// export const ClaimedData: ClaimedDataType[] = [
//   {
//     user_address: "0xabcdef1234567890",
//     claim_date: new Date("2023-01-10T15:30:00Z"),
//     claim_amount: 50,
//     claim_amount_coin: "ABC",
//     transaction_hash: "0xabcdef1234567890",
//     claimed: true,
//   },
//   // {
//   //   user_address: "0x1234567890abcdef",
//   //   claim_date: new Date("2023-02-20T12:45:00Z"),
//   //   claim_amount: 75,
//   //   claim_amount_coin: "ABC",
//   //   transaction_hash: "0x1234567890abcdef",
//   //   claimed: false,
//   // },
//   // {
//   //   user_address: "0x7890abcdef12345",
//   //   claim_date: new Date("2023-03-15T18:00:00Z"),
//   //   claim_amount: 100,
//   //   claim_amount_coin: "ABC",
//   //   transaction_hash: "0x7890abcdef12345",
//   //   claimed: false,
//   // },
//   // {
//   //   user_address: "0xabcdef5678901234",
//   //   claim_date: new Date("2023-04-05T09:15:00Z"),
//   //   claim_amount: 120,
//   //   claim_amount_coin: "ABC",
//   //   transaction_hash: "0xabcdef5678901234",
//   //   claimed: false,
//   // },
//   // {
//   //   user_address: "0x567890abcdef0123",
//   //   claim_date: new Date("2023-05-12T14:30:00Z"),
//   //   claim_amount: 90,
//   //   claim_amount_coin: "ABC",
//   //   transaction_hash: "0x567890abcdef0123",
//   //   claimed: true,
//   // },
//   // {
//   //   user_address: "0xabcdef0123456789",
//   //   claim_date: new Date("2023-06-18T11:45:00Z"),
//   //   claim_amount: 110,
//   //   claim_amount_coin: "ABC",
//   //   transaction_hash: "0xabcdef0123456789",
//   //   claimed: false,
//   // },
//   // {
//   //   user_address: "0x0123456789abcdef",
//   //   claim_date: new Date("2023-07-25T17:00:00Z"),
//   //   claim_amount: 130,
//   //   claim_amount_coin: "ABC",
//   //   transaction_hash: "0x0123456789abcdef",
//   //   claimed: true,
//   // },
// ];
