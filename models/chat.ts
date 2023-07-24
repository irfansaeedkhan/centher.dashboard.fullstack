export interface Reactions {
  code: string;
  sender: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  type: string;
  medias: any[];
  isSeen: boolean;
  seenAt: string;
  isFetched: boolean;
  fetchedAt: string;
  isSent: boolean;
  isMine: boolean;
  reactions: Reactions[];
  create_at: Date;
}

export interface DoingChatAction {
  displayName: string;
  address: string;
}

export interface ConversationHeadPropModel {
  isChannel: boolean;
  address: string;
  conversationId: string;
  displayName: string;
  followers: number;
  followings: number;
  channelName: string;
  channelDescription: string;
  channelCover: string;
  typings: DoingChatAction[];
  recordings: DoingChatAction[];
}
