import { IProductLaunchpadConfig } from "./types/config.interface";

export const config: IProductLaunchpadConfig = {
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.studio.thegraph.com/query/82021/centher-launchpad/version/latest"
      : "https://api.studio.thegraph.com/query/82021/centher-launchpad-sepolia/version/latest",
};
