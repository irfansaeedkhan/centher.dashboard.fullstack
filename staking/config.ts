import { ICentherStakingConfig } from "./types/config.interface";

export const config: ICentherStakingConfig = {
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.thegraph.com/subgraphs/name/sasimraza/centher-stakingv2-mainnet"
      : "https://api.thegraph.com/subgraphs/name/rezahssini/new-staking-with-ref-restake",
};

export const SwappingProjects: string[] =
  process.env.NEXT_PUBLIC_APP_ENV === "production" ? ["4"] : ["41"];
