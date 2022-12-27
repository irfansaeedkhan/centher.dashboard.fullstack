import { User } from "./user";

export interface BasePost {
  _id: string;
  user: PostUser;
  viewed_by_loggedin_user: boolean;
  liked_by_loggedin_user: boolean;
  replies_count: number;
  likes_count: number;
  createdAt: string;
}

export interface DeletedPost extends BasePost {
  status: "deleted";
}

export interface ArchivedPost extends BasePost {
  status: "archived";
  parent_post_id: string | undefined;
  text_content?: string;
  media?: PostMedia[];
}

export interface CompletedPost extends BasePost {
  status: "complete";
  parent_post: ParentPost | undefined;
  text_content?: string;
  media?: PostMedia[];
}

export type Post = DeletedPost | CompletedPost;

export interface PostMedia {
  url: string;
  type: "image" | "video";
  alt?: string;
}

export type PostUser = Pick<
  User,
  "_id" | "account_address" | "display_name" | "profile_image"
>;

export interface ParentPost {
  _id: string;
  createdAt: string;
  user: PostUser;
}
