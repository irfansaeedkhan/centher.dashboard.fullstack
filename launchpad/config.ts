import { ICentherLaunchpadConfig } from "./types/config.interface";

export const config: ICentherLaunchpadConfig = {
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.studio.thegraph.com/query/82021/centher-launchpad/version/latest"
      : "https://api.thegraph.com/subgraphs/name/sasimraza/centher-launchpad-sepolia",
};
