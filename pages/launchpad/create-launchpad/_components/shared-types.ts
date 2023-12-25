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
    multilevel_reward: string;
    multilevel_reward_system: {
      level: string;
      reward: number;
    }[];
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

export const initialFormState: FormState = {
  current_round: "verify_token",
  verify_token: {
    token_address: "",
    sale_rounds: 0,
    currency: "BNB",
    fee_option: 5,
    liquidity_lockup: 30,
    release_month: 3,
    add_fee: 0,
    multilevel_reward: "no_referrals",
    multilevel_reward_system: [
      {
        level: "1",
        reward: 0,
      },
      {
        level: "2",
        reward: 0,
      },
      {
        level: "3",
        reward: 0,
      },
      {
        level: "4",
        reward: 0,
      },
      {
        level: "5",
        reward: 0,
      },
      {
        level: "6",
        reward: 0,
      },
    ],
  },
  add_additional_info: {
    logo_url: "",
    website_url: "",
    facebook: "",
    twitter: "",
    github: "",
    telegram: "",
    instagram: "",
    discord: "",
    reddit: "",
    description: "",
    memberData: [],
  },
  rounds_settings: {
    round: [],
  },
};
