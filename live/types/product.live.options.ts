import { EventHandler } from "./event.handler";

export interface IProductLiveOptions {
  ackInterval: number;
  url: string;
  eventHandlers: EventHandler;
  userAddress: string;
  userToken: string;
}
