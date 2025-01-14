import { IsArray, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { BroadcastTypeEnum } from "../enum/stream-type.enum";
import { StreamAccessModeEnum } from "../enum/stream-access-mode.enum";

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
