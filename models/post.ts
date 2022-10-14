import { User } from "./user";

export interface Post {
  _id: string;
  parent_post?: {
    _id: string;
    user: PostUser;
  };
  text_content?: string;
  user: PostUser;
  media?: Media[];
  viewed_by_loggedin_user: boolean;
  liked_by_loggedin_user: boolean;
  replies_count: number;
  shares_count: number;
  likes_count: number;
  createdAt: string;
}

interface Media {
  url: string;
  type: "image" | "video";
  alt?: string;
}

type PostUser = Pick<
  User,
  "_id" | "account_address" | "display_name" | "profile_image"
>;
