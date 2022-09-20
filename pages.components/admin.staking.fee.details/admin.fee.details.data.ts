//types
export interface FeeDetails {
  Email: string;
  Publickey: string;
  Date: string;
  TransactionHash: string;
  TransactionDetail: string;
  TransactionValid: string;
  Issue: string;
  Amount: number;
  AmountInBNB: number;
  CorrectInBNB: number;
  InDifference: "%";
  Status: string;
  Action: string;
}

export const AdminFeeDetailsData: FeeDetails[] = [
  {
    Email: "talha@gmail.com",
    Publickey: "0x123456789",
    Date: "2021-05-01",
    TransactionHash: "0x123456789",
    TransactionDetail: "0x123456789",
    TransactionValid: "true",
    Issue: "0x123456789",
    Amount: 100,
    AmountInBNB: 100,
    CorrectInBNB: 100,
    InDifference: "%",
    Status: "Pending",
    Action: "Edit",
  },
];
