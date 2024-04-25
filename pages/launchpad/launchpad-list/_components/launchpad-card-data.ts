import { BigNumber } from "ethers";

export type LaunchpadDataType = {
  id: string;
  token_name: string;
  token_symbol: string;
  start_date?: Date;
  end_date?: Date;
  status: string;
  launchpad_title: string;
  liquidity: string;
  lockup_time: string;
  soft_cap: BigNumber;
  currentPurchasesValue: string;
  fundType: string;
  progress: string;
  currentRound: number;
  totalRounds: number;
  minTokensToSell: BigNumber;
  maxTokensToSell: BigNumber;
};

export type TokenPurchaseWithBNB = {
  id: string;
  token: string;
  beneficiary: string;
  round: string;
  amount: string;
  amountForOwner: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  receivable?: string;
  pricePerToken?: string;
};

export type TokenPurchaseWithBUSD = {
  id: string;
  token: string;
  beneficiary: string;
  round: string;
  amount: string;
  amountForOwner: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  receivable?: string;
  pricePerToken?: string;
};

export type tokenClaim = {
  id: string;
  token: string;
  beneficiary: string;
  round: number;
  tokenAmount: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  presale: string;
};

export type PresaleDataType = {
  id: string;
  token: string;
  creator: string;
  owner: string;
  fundType: number;
  minTokensToSell: string;
  maxTokensToSell: string;
  isRefSupport: boolean;
  levelOne: string;
  levelTwo: string;
  levelThree: string;
  levelFour: string;
  levelFive: string;
  levelSix: string;
  coinFeeRate: string;
  tokenFeeRate: string;
  releaseMonth: string;
  refundAmount: string;
  metadata: string;
  isActive: boolean;
  round0Bookings: string;
  round1Bookings: string;
  round2Bookings: string;
  totalPurchasesInBuyingToken: string;
  roundDeep: string;
  roundInfos: {
    token: string;
    startTime: string;
    endTime: string;
    lockMonths: string;
    minContribution: string;
    maxContribution: string;
    tokensToSell: string;
    pricePerToken: string;
  }[];
  tokenPurchaseWithBNB: {
    id: string;
    token: string;
    beneficiary: string;
    round: string;
    amount: string;
    amountForOwner: string;
    blockNumber: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  tokenPurchaseWithBUSD: {
    id: string;
    token: string;
    beneficiary: string;
    round: string;
    amount: string;
    amountForOwner: string;
    blockNumber: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  tokenClaim: {
    id: string;
    token: string;
    beneficiary: string;
    round: number;
    tokenAmount: string;
    blockNumber: string;
    blockTimestamp: string;
    transactionHash: string;
    presale: string;
  }[];
  refRewardClaim: [];
};
