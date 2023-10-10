import { ICentherStakingConfig } from "./types/config.interface";

export const config: ICentherStakingConfig = {
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.thegraph.com/subgraphs/name/rezahssini/staking-prod"
      : "https://api.thegraph.com/subgraphs/name/sasimraza/centher-staking",
};
