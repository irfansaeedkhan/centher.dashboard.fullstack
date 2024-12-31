import { IsArray, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { BroadcastTypeEnum } from "../enum/stream-type.enum";
import { StreamAccessModeEnum } from "../enum/stream-access-mode.enum";
import { AmaAgent } from "../stream-workers/ama";
import { LiveAgent } from "../stream-workers/live";
import { Socket } from "socket.io-client";
import { IEventBus } from "./event-bus";

export class CreateBroadcastDto {
  @IsOptional()
  name?: string;
  @IsOptional()
  description?: string;
  @IsNotEmpty()
  @IsEnum(StreamAccessModeEnum)
  accessMode!: StreamAccessModeEnum;
  @IsNotEmpty()
  @IsEnum(BroadcastTypeEnum)
  type!: BroadcastTypeEnum;
  @IsArray()
  tokenAddress!: string[];
  @IsArray()
  invitedUsers!: string[];
  image!: string;
}

export type StreamAgentType =
  | AmaAgent<IEventBus, Socket>
  | LiveAgent<IEventBus, Socket>;
