export interface User {
  _id: string;
  account_address: string;
  display_name: string;
  profile_image: UserImage;
  cover_image: UserImage;
  website_url: string;
}

interface UserImage {
  name: string;
  path: string;
  object_name: string;
}

export interface LoggedInUser {
  _id: string;
  account_address: string;
  display_name: string;
  profile_image: UserImage;
  first_name: string;
  last_name: string;
  profile_bio: string;
  pseudonym: string;
  cover_image: UserImage;
  website_url: string;
}

type UserRole =
  | "user"
  | "admin"
  | "influencer"
  | "pending_influencer"
  | "rejected_influencer";

type UserStatus = "active" | "inactive" | "delete";
