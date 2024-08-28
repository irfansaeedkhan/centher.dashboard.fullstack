import { customLog } from "@/utils/custom.log";
import { IProductLiveOptions } from "./types/product.live.options";

export const productLiveoptions: IProductLiveOptions = {
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
