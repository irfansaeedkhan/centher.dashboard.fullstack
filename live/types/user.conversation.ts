import { IConversation } from "./conversation";
import { IMessage } from "./message";
import { IUser } from "./user";

export interface IUserConversations {
  id: string;
  is_typing: string;
  is_recording: string;
  is_owner: boolean;
  is_pinned: boolean;
  user_address: string;
  messages: IMessage[];
  conversation: IConversation;
  user: IUser;
}
