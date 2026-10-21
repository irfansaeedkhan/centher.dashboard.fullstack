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
  /**
   * Feed product calls (2026-10-21): ISO timestamp of the last edit
   * (15-minute window, server-enforced), null if never edited. Rendered
   * as the subtle "edited" mark next to the post time.
   */
  edited_at?: string | null;
  /** Tombstone flag: deleted posts/replies render as a placeholder. */
  is_deleted?: boolean;
  /**
   * Post-grill Q15: archived flag for posts (mapPostRow surfaces it).
   * An archived post opened by its owner must render as archived —
   * banner + Restore — not as a live post offering Archive again.
   * Always false/absent for replies (comments can't be archived).
   */
  is_archived?: boolean;
  /**
   * Nested replies (2026-10-21): the reply's TRUE direct parent
   * comment id — null/absent for top-level replies and for posts.
   * The post page assembles the X-style thread tree from this.
   */
  parent_comment_id?: string | null;
  /**
   * Nested replies: the parent comment's author, present on replies
   * whose parent is another comment. Used only by the orphan fallback
   * ("Replying to @name") when a reply renders before its parent's
   * page has loaded; normal rendering connects via the thread line.
   */
  parent_comment_author?: { _id: string; display_name: string } | null;
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
