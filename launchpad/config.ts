import { ICentherLaunchpadConfig } from "./types/config.interface";

export const config: ICentherLaunchpadConfig = {
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.thegraph.com/subgraphs/name/sasimraza/centher-production-26628907"
      : "https://api.thegraph.com/subgraphs/name/sasimraza/centher-launchpad-sepolia",
};
