import { ICentherStakingConfig } from "./types/config.interface";

export const config: ICentherStakingConfig = {
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.thegraph.com/subgraphs/name/sasimraza/centher-staking-mainnet"
      : "https://api.thegraph.com/subgraphs/name/sasimraza/centher-staking",
};

export const SwappingProjects: string[] = ["30", "19"];
