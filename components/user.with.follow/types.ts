import { User } from "@/models/user";

export interface IUserWithFollow {
  _id: User["_id"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
  membership: User["membership"];
  is_followed_by_loggedin_user: boolean;
}
