import { ICentherStakingConfig } from "./types/config.interface";

export const config: ICentherStakingConfig = {
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.thegraph.com/subgraphs/name/rezahssini/staking"
      : "https://thegraph.com/hosted-service/subgraph/sasimraza/centher-staking",
};
