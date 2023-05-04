export const preBookingStatistics = {
  receivable_token_name: "DeXa",
  receivable_token_symbol: "DeXa",
  receivable_token_address: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
  receivable_token_image: "/images/dexa-icon.png",

  payment_token_name: "BUSD",
  payment_token_symbol: "BUSD",
  payment_token_address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  payment_token_image: "/images/busd-icon.png",

  pre_booking: {
    current_round: 1,
    is_sold_out: false,
    payment_address: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",

    rounds: {
      1: {
        payment_token_max_cap: 100_000,
        payment_tokens_collected: 40_550,
        receivable_token_price_in_payment_token: 0.05, // 1 receivable_token = 0.05 payment_token => 1 payment_token = 20 receivable_token => 1 BUSD = 20 DeXa
      },
      2: {
        payment_token_max_cap: 100_000,
        payment_tokens_collected: 0,
        receivable_token_price_in_payment_token: 0.1, // 1 receivable_token = 0.1 payment_token => 1 payment_token = 10 receivable_token => 1 BUSD = 10 DeXa
      },
      3: {
        payment_token_max_cap: 100_000,
        payment_tokens_collected: 0,
        receivable_token_price_in_payment_token: 0.2, // 1 receivable_token = 2 payment_token => 1 payment_token = 5 receivable_token => 1 BUSD = 5 DeXa
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
        id: 1,
        sender_address: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
        payment_token_amount: 100,
        payment_token_name: "BUSD",
        trx_hash: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
        round: 1,
        receivable_token_amount: 2000,
        receivable_token_name: "DeXa",
        createdAt: "2021-05-01T00:00:00Z",
      },
      {
        id: 2,
        sender_address: "0x4EE163a06a2deE907ff6b594F8e393e9fDC75bf3",
        payment_token_amount: 80,
        payment_token_name: "BUSD",
        trx_hash: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
        round: 2,
        receivable_token_amount: 800,
        receivable_token_name: "DeXa",
        createdAt: "2021-05-05T00:00:00Z",
      },
    ],
    my_bookings: [
      {
        id: 2,
        sender_address: "0x4EE163a06a2deE907ff6b594F8e393e9fDC75bf3",
        payment_token_amount: 80,
        payment_token_name: "BUSD",
        trx_hash: "0x048376534d3d8f5e4f3bde3fddcdddbd5d988b9a",
        round: 2,
        receivable_token_amount: 800,
        receivable_token_name: "DeXa",
        createdAt: "2021-05-05T00:00:00Z",
      },
    ],
  },
};
