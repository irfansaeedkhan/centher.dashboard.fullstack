import { EventHandler } from "./event.handler";

export interface ICentherLiveOptions {
  ackInterval: number;
  url: string;
  eventHandlers: EventHandler;
  userAddress: string;
  userToken: string;
}
