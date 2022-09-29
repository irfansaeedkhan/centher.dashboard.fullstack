export interface User {
  _id: string;
  account_address: string;
  display_name: string;
  profile_image: string;
  custom_image: boolean;
}

type UserRole =
  | "user"
  | "admin"
  | "influencer"
  | "pending_influencer"
  | "rejected_influencer";

type UserStatus = "active" | "inactive" | "delete" | "registration_fee_pending";
