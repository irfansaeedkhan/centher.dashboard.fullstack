export interface User {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified: string;
  profile_image: string;
  custom_image: boolean;
  account_address: string;
  roles: UserRole[];
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

type UserRole =
  | "user"
  | "admin"
  | "influencer"
  | "pending_influencer"
  | "rejected_influencer";

type UserStatus = "active" | "inactive" | "delete" | "registration_fee_pending";
