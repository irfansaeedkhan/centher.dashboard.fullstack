import { Events } from "../enums/events";

export type EventHandler = Record<
  keyof typeof Events,
  (...args: any[]) => void
>;
