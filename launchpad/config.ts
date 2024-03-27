import { ICentherLaunchpadConfig } from "./types/config.interface";

export const config: ICentherLaunchpadConfig = {
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.thegraph.com/subgraphs/name/sasimraza/centher-launchpadv2-testnet"
      : "https://api.thegraph.com/subgraphs/name/sasimraza/centher-launchpad-sepolia",
};
