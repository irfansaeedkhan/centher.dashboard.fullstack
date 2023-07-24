import { MessageTypeEnum } from "../enums/message.type";

export interface ISendMessage {
  conversationId: string;
  content: string;
  type: MessageTypeEnum;
  user?: string;
  repliedTo: string | null;
}
