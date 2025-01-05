import { EventNameEnum } from "../enum/event-name.enum";

export interface IEventBus {
  emit: (name: EventNameEnum, data?: any) => void;
  on: (name: EventNameEnum, callback: any) => void;
}
