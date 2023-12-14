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
  token_price: string;
  total_selling_amount: string;
  soft_cap_busd: string;
  start_time: Date | null;
  end_time: Date | null;
  min_contribution: string;
  max_contribution: string;
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
    fee_option: string;
    liquidity_lockup: string;
    release_month: string;
    add_fee?: string;
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
      token_price: string;
      total_selling_amount: string;
      soft_cap_busd: string;
      start_time: Date | null;
      end_time: Date | null;
      min_contribution: string;
      max_contribution: string;
    }[];
  };
};
