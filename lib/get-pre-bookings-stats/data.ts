import { PreBookingStats } from "./types";

export const preBookingStatistics: PreBookingStats = {
  receivable_token_name: "DeXa",
  receivable_token_symbol: "DeXa",
  receivable_token_address: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
  receivable_token_image: "/images/dexa-icon.png",

  payment_token_name: "BUSD Token",
  payment_token_symbol: "BUSD",
  payment_token_address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  payment_token_image: "/images/busd-icon.png",

  pre_booking: {
    current_round: 3,
    is_sold_out: false,
    payment_wallet_address: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
    minimum_payment_token_amount: 150,

    rounds: {
      1: {
        receivable_token_max_cap: 100_000,
        receivable_tokens_collected: 40_550,
        receivable_token_price_in_payment_token: 0.8, // 1 receivable_token = 0.8 payment_token => 1 payment_token = 1.25 receivable_token => 1 BUSD = 1.25 DeXa
      },
      2: {
        receivable_token_max_cap: 100_000,
        receivable_tokens_collected: 0,
        receivable_token_price_in_payment_token: 1.2, // 1 receivable_token = 1.2 payment_token => 1 payment_token = 0.83 receivable_token => 1 BUSD = 0.83 DeXa
      },
      3: {
        receivable_token_max_cap: 100_000,
        receivable_tokens_collected: 99950,
        receivable_token_price_in_payment_token: 1.8, // 1 receivable_token = 1.8 payment_token => 1 payment_token = 0.55 receivable_token => 1 BUSD = 0.55 DeXa
      },
    },
  },

  presale: {
    rounds: {
      1: {
        start_time: 1684155739, // seconds from 1970-01-01T00:00:00Z UTC - Unix Epoch
        end_time: 1686834139,
      },
      2: {
        start_time: 1686834139,
        end_time: 1689426139,
      },
      3: {
        start_time: 1689426139,
        end_time: 1692104539,
      },
    },
  },

  bookings: {
    recent_bookings: [
      {
        id: "1",
        sender_address: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
        payment_token_amount: 100,
        payment_token_name: "BUSD Token",
        payment_token_symbol: "BUSD",
        trx_hash: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
        round: 1,
        receivable_token_amount: 100 / 0.8,
        receivable_token_name: "DeXa Coin",
        receivable_token_symbol: "DXC",
        roundPrice: "0.8",
        createdAt: 1620187200,
      },
      {
        id: "2",
        sender_address: "0x4EE163a06a2deE907ff6b594F8e393e9fDC75bf3",
        payment_token_amount: 179910,
        payment_token_name: "BUSD Token",
        payment_token_symbol: "BUSD",
        trx_hash: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
        round: 3,
        receivable_token_amount: 179910 / 1.8,
        receivable_token_name: "DeXa Coin",
        receivable_token_symbol: "DXC",
        roundPrice: "1.2",
        createdAt: 1620197200,
      },
    ],
    my_bookings: [
      {
        id: "2",
        sender_address: "0x4EE163a06a2deE907ff6b594F8e393e9fDC75bf3",
        payment_token_amount: 179910,
        payment_token_name: "BUSD Token",
        payment_token_symbol: "BUSD",
        trx_hash: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
        round: 3,
        receivable_token_amount: 179910 / 1.8, // 179820 BUSD / 1.8 BUSD = 99900 DeXa
        receivable_token_name: "DeXa Coin",
        receivable_token_symbol: "DXC",
        roundPrice: "1.5",
        createdAt: 1620197200,
      },
    ],
  },

  my_rewards: [
    {
      id: "1",
      sender_address: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
      payment_token_amount: 100,
      payment_token_name: "BUSD Token",
      payment_token_symbol: "BUSD",
      trx_hash: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
      level: 1,
      receivable_token_amount: 100 / 0.8,
      receivable_token_name: "DeXa Coin",
      receivable_token_symbol: "DXC",
      reward_token_amount: 100 * 0.04, // 4% of 100 Payment Tokens
      reward_token_name: "DeXa Coin",
      reward_token_symbol: "DXC",
      createdAt: 1620187200,
    },
  ],
};
