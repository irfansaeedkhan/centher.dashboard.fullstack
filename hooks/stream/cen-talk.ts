import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { CentalkUserRoleEnum } from "@/stream/enum/user-role";

export interface CentalkUser {
  id: string;
  lastSeen: Date;
  user_broadcasts?: UserBroadcast[];
  citizenshipEnd?: Date;
  createdAt: Date;
  deletedAt: Date;
}

export interface UserBroadcast {
  id?: string;
  socketId: string;
  type: CentalkUserRoleEnum;
  broadcast?: ICentalkBroadcast;
  user?: CentalkUser;
  deletedAt: Date;
  createdAt: Date;
  hasTalkRequest: boolean;
  hasPermissionToMessage: boolean;
  isMuted: boolean;
}

interface IAggregateCount {
  aggregate: {
    count: number;
  };
}

export interface ICentalkBroadcast {
  id?: string;
  name?: string;
  image: string | File;
  description?: string;
  accessMode: StreamAccessModeEnum;
  type: BroadcastTypeEnum;
  tokenAddress?: string;
  createdAt?: Date;
  deletedAt?: Date;
  hosts?: UserBroadcast[];
  latestParticipants: UserBroadcast[];
  speakersCount: IAggregateCount;
  participatorsCount: IAggregateCount;
  invitedUsers: string[];
  hasTalkRequestUsers: IAggregateCount;
}

export interface IBroadcastMessage {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
}

interface User {
  citizenshipEnd: string;
  createdAt: string;
  id: string;
  lastSeen: string;
}

export interface Participator {
  id: string;
  hasTalkRequest: boolean;
  createdAt: string;
  user: User;
  mappedUser?: any;
  type: string;
  hasPermissionToMessage: boolean;
  isMuted: boolean;
}

export interface ParticipatorsResponse {
  participators: Participator[];
  aggregates: {
    aggregate: {
      count: number;
    };
  };
}
