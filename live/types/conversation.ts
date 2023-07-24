import { IUserConversations } from "./user.conversation";

export interface IConversation {
  channel_description?: string;
  channel_name?: string;
  created_at: string;
  updated_at: string;
  id: string;
  is_active: boolean;
  is_channel: boolean;
  is_public: boolean;
  cover_path: string;
  user_conversations: IUserConversations[];
}
