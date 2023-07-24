import { IActivity } from "./activity";
import { IUserConversations } from "./user.conversation";

export interface IMessage {
  id: string;
  content: string;
  created_at: string;
  replied_to: string;
  type: string;
  user_conversation: IUserConversations;
  medias: any[];
  activities: IActivity[];
}
