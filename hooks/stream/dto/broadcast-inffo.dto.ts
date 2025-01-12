import { User } from "@/models/user";
import { ICentalkUser } from "@/stream/model";

export interface BroadcastMessage {
  id: string;
  content: string;
  sender: User;
  createdAt: Date;
}
