import { ICentherStakingConfig } from "./types/config.interface";

export const config: ICentherStakingConfig = {
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.studio.thegraph.com/query/82021/centher-stacking/version/latest"
      : "https://api.studio.thegraph.com/query/82021/centher-staking-sepolia/version/latest",
};

export const SwappingProjects: string[] =
  process.env.NEXT_PUBLIC_APP_ENV === "production" ? ["4"] : ["41"];
