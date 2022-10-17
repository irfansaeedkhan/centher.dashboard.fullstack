export interface User {
  _id: string;
  account_address: string;
  display_name: string;
  profile_image: UserImage;
  cover_image: UserImage;
  website_url: string;
  profile_bio: string;
  twitter_username: string;
}

export interface UserImage {
  name: string; // TODO: Mubashir: No need of this. Remove it.
  path: string;
  object_name: string;
}

export interface LoggedInUser extends User {
  first_name: string;
  last_name: string;
  pseudonym: string;
  display_name_field: "real_name" | "pseudonym" | "account_address";
}
