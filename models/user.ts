export interface User {
  _id: string;
  account_address: string;
  display_name: string;
  profile_image: string;
  custom_image: boolean;
  cover_image?: string;
  website_url: string;
}

export interface LoggedInUser {
  _id: string;
  account_address?: string;
  display_name?: string;
  profile_image?: string;
  custom_image?: boolean;
  first_name?: string;
  last_name?: string;
  profile_bio?: string;
  pseudonym?: string;
  cover_image?: string;
  website_url?: string;
}
type UserRole =
  | "user"
  | "admin"
  | "influencer"
  | "pending_influencer"
  | "rejected_influencer";

type UserStatus = "active" | "inactive" | "delete";
