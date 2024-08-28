import { ProductLive } from "..";

export type ConversationActionHandler = (
  sdk: ProductLive,
  params: any,
  account: string
) => void;
