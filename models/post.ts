import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { User } from "./user";

export interface BasePost {
  _id: string;
  user: PostUser;
  viewed_by_loggedin_user: boolean;
  liked_by_loggedin_user: boolean;
  replies_count: number;
  likes_count: number;
  is_thread: boolean;
  thread_id: string | undefined;
  thread_index: number | undefined;
  createdAt: string;
  version: number;
  /** Plain-text extracted from the stored editor state (Phase 2). */
  text_content: string;
}

export interface DeletedPost extends BasePost {
  status: "deleted";
}

export interface ArchivedPost extends BasePost {
  status: "archived";
  parent_post_id: string | undefined;
  post_editor_state: SerializedEditorState<SerializedLexicalNode>;
  media: PostMedia[];
}

export interface CompletedPost extends BasePost {
  status: "complete";
  parent_post: ParentPost | undefined;
  post_editor_state: SerializedEditorState<SerializedLexicalNode>;
  media: PostMedia[];
}

export type Post = DeletedPost | CompletedPost;

export interface PostMedia {
  object_name: string;
  url: string;
  type: string;
  alt?: string;
}

export type PostUser = Pick<
  User,
  "_id" | "display_name" | "profile_image" | "membership"
>;

export interface ParentPost {
  _id: string;
  createdAt: string;
  user: PostUser;
}

interface PostMention {
  user_id: string;
  display_name: string;
  indices: [number, number];
}

interface PostHashtag {
  text: string;
  indices: [number, number];
}

export interface PostEntities {
  mentions: PostMention[];
  hashtags: PostHashtag[];
}
