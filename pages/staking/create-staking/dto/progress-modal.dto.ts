import {
  CreatePoolStepsEnum,
  ProgressStatus,
} from "@/staking/enum/create-pool-steps.enum";

export interface ProgressModal {
  title: CreatePoolStepsEnum;
  status: ProgressStatus;
  value: number;
}
