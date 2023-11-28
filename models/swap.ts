export interface SwapToken {
  address: string;
  icon: string;
  id: string;
  name: string;
  symbol: string;
  is_native: boolean;
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
