// export const LaunchpadData: LaunchpadDataType[] = [
//   {
//     soft_cap: 30,
//     lockup_time: 250,
//     liquidity: 60,
//     launchpad_title: "Galactic Harmony",
//     status: "live",
//     end_date: new Date("2024-12-31T23:59:59Z"),
//   },
//   {
//     soft_cap: 20,
//     lockup_time: 200,
//     liquidity: 45,
//     launchpad_title: "Cosmic Unity",
//     status: "upcoming",
//     start_date: new Date("2024-01-01T00:00:00Z"),
//   },
//   {
//     soft_cap: 35,
//     lockup_time: 280,
//     liquidity: 75,
//     launchpad_title: "Stellar Nexus",
//     status: "ended",
//   },
//   {
//     soft_cap: 28,
//     lockup_time: 270,
//     liquidity: 55,
//     launchpad_title: "Interstellar Connection",
//     status: "live",
//     end_date: new Date("2024-12-31T23:59:59Z"),
//   },
//   {
//     soft_cap: 22,
//     lockup_time: 220,
//     liquidity: 50,
//     launchpad_title: "Celestial Bonds",
//     status: "upcoming",
//     start_date: new Date("2024-01-01T00:00:00Z"),
//   },
//   {
//     soft_cap: 32,
//     lockup_time: 290,
//     liquidity: 70,
//     launchpad_title: "Planetary Coalition",
//     status: "ended",
//   },
//   {
//     soft_cap: 30,
//     lockup_time: 250,
//     liquidity: 60,
//     launchpad_title: "Galactic Harmony",
//     status: "live",
//     end_date: new Date("2024-12-31T23:59:59Z"),
//   },
//   {
//     soft_cap: 20,
//     lockup_time: 200,
//     liquidity: 45,
//     launchpad_title: "Cosmic Unity",
//     status: "upcoming",
//     start_date: new Date("2024-01-01T00:00:00Z"),
//   },
//   {
//     soft_cap: 35,
//     lockup_time: 280,
//     liquidity: 75,
//     launchpad_title: "Stellar Nexus",
//     status: "ended",
//   },
//   {
//     soft_cap: 28,
//     lockup_time: 270,
//     liquidity: 55,
//     launchpad_title: "Interstellar Connection",
//     status: "live",
//     end_date: new Date("2024-12-31T23:59:59Z"),
//   },
//   {
//     soft_cap: 22,
//     lockup_time: 220,
//     liquidity: 50,
//     launchpad_title: "Celestial Bonds",
//     status: "upcoming",
//     start_date: new Date("2024-01-01T00:00:00Z"),
//   },
//   {
//     soft_cap: 32,
//     lockup_time: 290,
//     liquidity: 70,
//     launchpad_title: "Planetary Coalition",
//     status: "ended",
//   },
//   {
//     soft_cap: 25,
//     lockup_time: 300,
//     liquidity: 53,
//     launchpad_title: "Solar Alliance",
//     status: "live",
//     end_date: new Date("2024-12-31T23:59:59Z"),
//   },
//   {
//     soft_cap: 18,
//     lockup_time: 180,
//     liquidity: 48,
//     launchpad_title: "Orbit Odyssey",
//     status: "upcoming",
//     start_date: new Date("2024-01-01T00:00:00Z"),
//   },
//   {
//     soft_cap: 38,
//     lockup_time: 260,
//     liquidity: 80,
//     launchpad_title: "Astro Ventures",
//     status: "ended",
//   },
//   {
//     soft_cap: 26,
//     lockup_time: 310,
//     liquidity: 58,
//     launchpad_title: "Starlight Syndicate",
//     status: "live",
//     end_date: new Date("2024-12-31T23:59:59Z"),
//   },
// ];

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
  soft_cap: number;
  currentPurchasesValue: string;
  fundType: string;
  progress: string;
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
  totalPurchasesInBuyingToken: string;
  roundDeep: string;
  roundInfos: [
    {
      token: string;
      startTime: string;
      endTime: string;
      lockMonths: string;
      minContribution: string;
      maxContribution: string;
      tokensToSell: string;
      pricePerToken: string;
    }
  ];
  tokenPurchaseWithBNB: [
    {
      id: string;
      token: string;
      beneficiary: string;
      round: string;
      bnbAmount: string;
      bnbAmountForOwner: string;
      blockNumber: string;
      blockTimestamp: string;
      transactionHash: string;
    }
  ];
  tokenPurchaseWithBUSD: [
    {
      id: string;
      token: string;
      beneficiary: string;
      round: string;
      busdAmount: string;
      busdAmountForOwner: string;
      blockNumber: string;
      blockTimestamp: string;
      transactionHash: string;
    }
  ];
  tokenClaim: [
    {
      id: string;
      token: string;
      beneficiary: string;
      round: number;
      tokenAmount: string;
      blockNumber: string;
      blockTimestamp: string;
      transactionHash: string;
      presale: string;
    }
  ];
  refRewardClaim: [];
};
