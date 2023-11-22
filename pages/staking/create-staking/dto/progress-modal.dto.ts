import { CreatePoolStepsEnum } from "@/staking/enum/create-pool-steps.enum";

export interface ProgressModal {
  title: CreatePoolStepsEnum;
  value: number;
}
