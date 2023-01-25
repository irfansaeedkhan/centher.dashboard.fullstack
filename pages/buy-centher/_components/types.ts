import { TokenName } from "@/web3/utils/call.helpers";

export interface SelectedTokenA {
  tokenName: TokenName;
  tokenIcon: React.ReactNode;
  tokenBalance: number;
  minContribution: number;
  maxContribution: number;
  rate: number;

  inputValue: number | "";
  inputMinValue: number;
  inputMaxValue: number;
}

export interface SelectedTokenB {
  tokenName: TokenName;
  tokenIcon: React.ReactNode;
  tokenBalance: number;

  inputValue: number;
}
