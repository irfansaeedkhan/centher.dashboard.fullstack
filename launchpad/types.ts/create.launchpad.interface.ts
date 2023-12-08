import { parseUnits } from "ethers/lib/utils";
// import { CreatePoolStepsEnum } from "../enum/create-pool-steps.enum";
import { OptionalType } from "./general";

export interface CreatePoolMetadata {
  library: { title: string; data: string }[];
  banner: string;
  icon: string;
  socialMedias: { name: string; link: string }[];
  categories: { value: string; label: string }[];
  description: string;
  team: { jobTitle: string; walletAddress: string }[];
}

export interface LaunchpadFiles {
  banner: OptionalType<Blob>;
  logo: OptionalType<Blob>;
}

export interface CreatePoolInput {
  owner: string;
  token: string;
  minTokensToSell: number;
  maxTokensToSell: number;
  roundDeep: number;
  coinFeeRate: number;
  tokenFeeRate: number;
  releaseMonth: number;
  isRefSupport: boolean;
  fundType: number;
  metadata: string;
}

export interface RoundInput {
  startTime: number;
  endTime: number;
  lockMonths: number;
  minContribution: number;
  maxContribution: number;
  tokensToSell: number;
  pricePerToken: number;
}

export interface MappedCreateLaunchpadInput {
  createPoolInput: CreatePoolInput;
  RoundInput: RoundInput[];
}

export interface AddAffiliateSettingsInput {
  levelOne: number;
  levelTwo: number;
  levelThree: number;
  levelFour: number;
  levelFive: number;
  levelSix: number;
}

// export type ProgressCallback = (
//   processName: CreatePoolStepsEnum,
//   progress: number
// ) => void;
