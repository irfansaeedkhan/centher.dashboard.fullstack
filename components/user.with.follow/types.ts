export interface IUserWithFollow {
  _id: string;
  display_name: string;
  profile_image: string;
  is_followed_by_loggedin_user: boolean;
  is_verified: boolean;
}
