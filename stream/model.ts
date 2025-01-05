export enum CentalkUserStatusEnum {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum CentalkUserRoleEnum {
  HOST = "HOST",
  LISTENER = "LISTENER",
  SPEAKER = "SPEAKER",
}

export enum StreamSubscriptionEnum {
  SUBSCRIBE_ALL = "SUBSCRIBE_ALL",
  SUBSCRIBE_MESSAGE = "SUBSCRIBE_MESSAGE",
  SUBSCRIBE_SPEAKERS = "SUBSCRIBE_SPEAKERS",
  SUBSCRIBE_CURRENT_USER = "SUBSCRIBE_CURRENT_USER",
  SUBSCRIBE_HAS_TALK_REQUEST_USERS = "SUBSCRIBE_HAS_TALK_REQUEST_USERS",
  SUBSCRIBE_CURRENT_STREAM = "SUBSCRIBE_CURRENT_STREAM",
}

export interface ICentalkUser {
  id: string;
  name: string;
  image: string;
  isVerified?: boolean;
  isMuted?: boolean;
  isChatPermission?: boolean;
  status?: CentalkUserStatusEnum;
  role?: CentalkUserRoleEnum;
  hasTalkRequest: boolean;
}

export interface ICentalkMessage {
  createdAt: Date;
  content: string;
  id: string;
  sender: Partial<ICentalkUser>;
}
