export interface User {
  _id: string;
  display_name: string;
  profile_image: string;
  cover_image: string;
  is_verified: boolean;
  profile_bio: string;
  social_media: SocialMedia;
  createdAt: string;
  updatedAt: string;
}

export interface SocialMedia {
  website_url: string;
  twitter_username: string;
  facebook_username: string;
  instagram_username: string;
  twitch_username: string;
  onlyfans_username: string;
  youtube_url: string;
  tiktok_username: string;
  telegram_username: string;
}

export interface UserImage {
  path: string;
  object_name: string;
}

export interface CookiesConsent {
  consent_given: boolean;
  timestamp: Date;
}

export interface LoggedInUser extends User {
  first_name: string;
  last_name: string;
  pseudonym: string;
  referrer_address: string | null;
  display_name_field: "real_name" | "pseudonym" | "account_address";
  has_seen_notifications_page: boolean;
  cookies_consent: CookiesConsent | undefined;
}

export interface MutualFollowersData {
  other_users_count: number;
  users: {
    _id: string;
    display_name: string;
    profile_image: string;
  }[];
}
