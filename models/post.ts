import { User } from "./user";

export interface BasePost {
  _id: string;
  parent_post?: {
    _id: string;
    user: PostUser;
  };
  user: PostUser;
  viewed_by_loggedin_user: boolean;
  liked_by_loggedin_user: boolean;
  replies_count: number;
  shares_count: number;
  likes_count: number;
  createdAt: string;
}

export interface DeletedPost extends BasePost {
  status: "deleted";
}

export interface CompletedPost extends BasePost {
  status: "complete";
  text_content?: string;
  media?: PostMedia[];
}

export type Post = DeletedPost | CompletedPost;

export interface PostMedia {
  url: string;
  type: "image" | "video";
  alt?: string;
}

type PostUser = Pick<
  User,
  "_id" | "account_address" | "display_name" | "profile_image"
>;
