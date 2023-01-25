export interface User {
  _id: string;
  account_address: string;
  display_name: string;
  profile_image: UserImage;
  cover_image: CoverImage;
  createdAt: string;
  website_url: string;
  profile_bio: string;
  twitter_username: string;
  instagram_username: string;
  facebook_username: string;
  tiktok_username: string;
  twitch_username: string;
  onlyfans_username: string;
  youtube_url: string;
}

export interface UserImage {
  path: string;
  object_name: string;
}

export interface CoverImage extends UserImage {
  y: string;
}

export interface LoggedInUser extends User {
  first_name: string;
  last_name: string;
  pseudonym: string;
  display_name_field: "real_name" | "pseudonym" | "account_address";
  has_seen_notifications_page: boolean;
}

export interface MutualFollowersData {
  other_users_count: number;
  users: {
    _id: string;
    account_address: string;
    display_name: string;
    profile_image: UserImage;
  }[];
}
