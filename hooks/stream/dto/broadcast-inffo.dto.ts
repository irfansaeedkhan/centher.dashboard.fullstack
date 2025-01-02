import { ICentalkUser } from "../model";

export class BroadcastMessage {
  id: string;
  content: string;
  sender: ICentalkUser;
  createdAt: Date;
}
