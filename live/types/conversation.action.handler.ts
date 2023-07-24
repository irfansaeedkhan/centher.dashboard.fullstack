import { CentherLive } from "..";

export type ConversationActionHandler = (
  sdk: CentherLive,
  params: any,
  account: string
) => void;
