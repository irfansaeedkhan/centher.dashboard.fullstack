import { Column } from "react-table";

export const Columns: Column[] = [
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "PublicKey",
    accessor: "public_key",
  },
  {
    Header: "Date",
    accessor: "date",
  },
  {
    Header: "Transaction Hash",
    accessor: "transaction_hash",
  },
  {
    Header: "Transaction Detail",
    accessor: "transaction_detail",
  },
  {
    id: "transaction_valid",
    Header: "Transaction Valid",
    // TODO: Mubashir - fix typing any
    accessor: (data: any) => data.transaction_valid.toString(),
  },
  {
    Header: "Issue",
    accessor: "issue",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: `Amount In BNB`,
    accessor: "amount_in_bnb",
  },
  {
    Header: `Correct In BNB`,
    accessor: "correct_in_bnb",
  },
  {
    Header: "In Difference",
    accessor: "in_difference",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  // {
  //   Header: "Action",
  //   accessor: "action",
  // },
];
