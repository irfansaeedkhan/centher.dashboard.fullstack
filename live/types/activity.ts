import { IMessage } from "./message";
import { IUser } from "./user";

export interface IActivity {
  id: string;
  type: string;
  user_address: string;
  created_at: string;
  code: string;
  message: IMessage;
  user: IUser;
}
