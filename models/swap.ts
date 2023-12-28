export interface SwapToken {
  address: string;
  icon: string;
  name: string;
  symbol: string;
  is_native: boolean;
  decimal: number;
  projectLink: string;
  ChainId: number;
}

export interface SwapRates {
  base: SwapToken;
  quote: SwapToken;
  rate: number;
  id: string;
}

export interface GetSwapRates {
  swaps: SwapRates[];
  wallet: string;
}
