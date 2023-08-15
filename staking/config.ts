import { ICentherStakingConfig } from "./types/config.interface";

export const config: ICentherStakingConfig = {
  coinMarketCapUrl:
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?platform=ethereum&aux=num_market_pairs,tags,platform,max_supply,circulating_supply,total_supply,cmc_rank",
  coinMarketCapKey: "c1cf099a-bca6-4256-ab96-3d4fbf392092",
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? ""
      : "https://api.thegraph.com/subgraphs/name/sasimraza/centher-staking",
};
