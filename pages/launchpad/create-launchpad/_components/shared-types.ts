import { CreateLaunchpadStepsEnum } from "./shared-enum";

export interface FormStateProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}

export interface RoundCardProps {
  current_round:
    | "verify_token"
    | "rounds_settings"
    | "add_additional_info"
    | "finish";
  round: string;
  round_no: number;
  title: string;
  description: string;
}

export type RoundCardData = {
  round_no: number;
  round: string;
  title: string;
  description: string;
};

export type CurrentComponent = {
  token_price: number | string;
  total_selling_amount: number | string;
  soft_cap_busd: number | string;
  start_time: Date | null;
  end_time: Date | null;
  min_contribution: number | string;
  max_contribution: number | string;
};

export type FormState = {
  current_round:
    | "verify_token"
    | "rounds_settings"
    | "add_additional_info"
    | "finish";
  verify_token: {
    token_address: string;
    sale_rounds: number;
    currency: "BNB" | "USDT";
    fee_option: number | string;
    liquidity_lockup: number;
    release_month: number;
    add_fee?: number;
  };
  add_additional_info: {
    logo_url: string;
    website_url: string;
    facebook: string;
    twitter: string;
    github: string;
    telegram: string;
    instagram: string;
    discord: string;
    reddit: string;
    description: string;
    memberData: {
      jobTitle: string;
      walletAddress: string;
    }[];
  };
  rounds_settings: {
    round: {
      round_no: number;
      token_price: number | string;
      total_selling_amount: number | string;
      soft_cap_busd: number | string;
      start_time: Date | null;
      end_time: Date | null;
      min_contribution: number | string;
      max_contribution: number | string;
    }[];
  };
};

export type TokenDetail = {
  token_name: string;
  token_symbol: string;
  token_decimal: string | number;
  total_selling: string | number;
};

export type ProgressCallback = (
  processName: CreateLaunchpadStepsEnum,
  progress: number
) => void;

export interface ProgressModal {
  title: CreateLaunchpadStepsEnum;
  value: number;
}
