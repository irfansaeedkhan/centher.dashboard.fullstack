export type BookingTableData = {
  account_address: string;
  payment: number;
  receiveable: number;
  dxc_price: number;
  round: number;
  trx_hash: string;
  date: Date;
};

export const bookingsData: BookingTableData[] = [
  {
    account_address: "0x123456789abcdef",
    payment: 1000,
    receiveable: 1200,
    dxc_price: 150,
    round: 1,
    trx_hash: "0xabcdef123456789",
    date: new Date("2024-01-22T12:30:00"),
  },
  {
    account_address: "0x987654321abcdef",
    payment: 800,
    receiveable: 950,
    dxc_price: 120,
    round: 2,
    trx_hash: "0x7890123456789abc",
    date: new Date("2024-01-23T14:45:00"),
  },
  {
    account_address: "0xfedcba987654321",
    payment: 1200,
    receiveable: 1400,
    dxc_price: 180,
    round: 3,
    trx_hash: "0xcdef0123456789ab",
    date: new Date("2024-01-24T10:15:00"),
  },
  {
    account_address: "0x123456789abcdef",
    payment: 1000,
    receiveable: 1200,
    dxc_price: 150,
    round: 1,
    trx_hash: "0xabcdef123456789",
    date: new Date("2024-01-22T12:30:00"),
  },
  {
    account_address: "0x987654321abcdef",
    payment: 800,
    receiveable: 950,
    dxc_price: 120,
    round: 2,
    trx_hash: "0x7890123456789abc",
    date: new Date("2024-01-23T14:45:00"),
  },
  {
    account_address: "0xfedcba987654321",
    payment: 1200,
    receiveable: 1400,
    dxc_price: 180,
    round: 3,
    trx_hash: "0xcdef0123456789ab",
    date: new Date("2024-01-24T10:15:00"),
  },
  {
    account_address: "0x456789abcdef0123",
    payment: 1500,
    receiveable: 1800,
    dxc_price: 200,
    round: 4,
    trx_hash: "0x0123456789abcdef",
    date: new Date("2024-01-25T08:00:00"),
  },
  {
    account_address: "0xcdef0123456789ab",
    payment: 600,
    receiveable: 750,
    dxc_price: 100,
    round: 5,
    trx_hash: "0xfedcba9876543210",
    date: new Date("2024-01-26T16:30:00"),
  },
];
