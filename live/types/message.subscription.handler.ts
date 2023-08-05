import { CentherLive } from "..";

export type IMessageSubscriptionHander = (
  adapter: CentherLive,
  args: any
) => void;
