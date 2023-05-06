export interface PreBookingStats {
  receivable_token_name: string;
  receivable_token_symbol: string;
  receivable_token_address: string;
  receivable_token_image: string;
  payment_token_name: string;
  payment_token_symbol: string;
  payment_token_address: string;
  payment_token_image: string;
  pre_booking: PreBooking;
  presale: Presale;
  bookings: Bookings;
  my_rewards: Reward[];
}

export interface PreBooking {
  current_round: number;
  minimum_payment_token_amount: number;
  is_sold_out: boolean;
  payment_wallet_address: string;
  rounds: PreBookingRounds;
}

export interface PreBookingRounds {
  [key: number]: {
    receivable_token_max_cap: number;
    receivable_tokens_collected: number;
    receivable_token_price_in_payment_token: number;
  };
}

export interface Presale {
  rounds: PresaleRounds;
}

export interface PresaleRounds {
  [key: number]: {
    start_time: number;
    end_time: number;
  };
}

export interface Bookings {
  recent_bookings: Booking[];
  my_bookings: Booking[];
}

export interface Booking {
  id: string;
  sender_address: string;
  payment_token_amount: number;
  payment_token_name: string;
  payment_token_symbol: string;
  receivable_token_amount: number;
  receivable_token_name: string;
  receivable_token_symbol: string;
  trx_hash: string;
  round: number;
  createdAt: number;
}

export interface Reward {
  id: string;
  sender_address: string;
  payment_token_amount: number;
  payment_token_name: string;
  payment_token_symbol: string;
  receivable_token_amount: number;
  receivable_token_name: string;
  receivable_token_symbol: string;
  reward_token_amount: number;
  reward_token_name: string;
  reward_token_symbol: string;
  trx_hash: string;
  level: number;
  createdAt: number;
}
