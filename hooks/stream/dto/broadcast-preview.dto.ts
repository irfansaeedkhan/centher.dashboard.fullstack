import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";

export interface BroadcastPreviewDto {
  id: string;
  image: string;
  title: string;
  accessMode: StreamAccessModeEnum;
  type: BroadcastTypeEnum;
  description?: string;
  // host: Partial<ICentalkUser>;
  // latestParticipants: Partial<ICentalkUser>[];
  speakersCount: number;
  participatorsCount: number;
  createdAt?: Date;
}
