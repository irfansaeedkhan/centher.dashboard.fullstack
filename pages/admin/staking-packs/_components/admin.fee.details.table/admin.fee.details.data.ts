// Fee details are on-chain records. There is no backend for them yet,
// so the table renders an honest empty state instead of dummy rows.
export interface AdminFeeDetail {
  email: string;
  public_key: string;
  date: string;
  transaction_hash: string;
  transaction_detail: string;
  transaction_valid: boolean;
  issue: string;
  amount: string;
  status: string;
  amount_in_bnb: number;
  correct_in_bnb: number;
  in_difference: string;
}

export const AdminFeeDetailsData: AdminFeeDetail[] = [];
