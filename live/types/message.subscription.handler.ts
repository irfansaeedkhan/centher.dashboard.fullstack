import { ProductLive } from "..";

export type IMessageSubscriptionHander = (
  adapter: ProductLive,
  args: any
) => void;
