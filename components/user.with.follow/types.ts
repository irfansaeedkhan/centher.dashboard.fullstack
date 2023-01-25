export interface IUserWithFollow {
  _id: string;
  display_name: string;
  account_address: string;
  profile_image: {
    path: string;
    object_name: string;
  };
  is_followed_by_loggedin_user: boolean;
}
