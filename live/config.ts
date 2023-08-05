import { customLog } from "@/utils/custom.log";
import { ICentherLiveOptions } from "./types/centher.live.options";

export const centherLiveoptions: ICentherLiveOptions = {
  ackInterval: 10000,
  url: process.env.NEXT_PUBLIC_HASURA_URL
    ? process.env.NEXT_PUBLIC_HASURA_URL
    : "wss://testingapi.centher.io/v1/graphql",
  userAddress: "",
  userToken: "",
  eventHandlers: {
    OnContactChanged: (e) => {
      customLog(["development", "staging"], e);
    },
    OnNotificationReceived: (e) => {
      customLog(["development", "staging"], e);
    },
  },
};
