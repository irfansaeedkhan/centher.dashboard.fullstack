import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

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
  image?: string;
}
