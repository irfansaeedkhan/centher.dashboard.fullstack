/**
 * Phase 5: chat types — the REST shapes returned by /api/chat/*.
 */

export interface ChatMember {
  user_id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  membership?: string | null;
  is_followed_by_logged_in_user?: boolean;
}

export interface ChatLastMessage {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  is_pinned: boolean;
  members: ChatMember[];
  last_message: ChatLastMessage | null;
  unread_count: number;
}

export interface ChatReaction {
  emoji: string;
  count: number;
  reacted_by_me: boolean;
}

export type ChatMessageKind =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "voice";
export type ChatMessageStatus = "sent" | "delivered" | "read";

export interface ChatAttachment {
  id: string;
  kind: "image" | "video" | "audio" | "file";
  mime_type: string;
  file_name: string;
  file_size: number;
  url: string;
  duration_sec: number | null;
  width: number | null;
  height: number | null;
  thumbnail_url: string | null;
}

export interface ChatReplyPreview {
  id: string;
  body: string;
  kind: string;
  sender_name: string;
}

export interface ChatMessage {
  id: string;
  body: string;
  kind: ChatMessageKind;
  sender_id: string;
  created_at: string;
  status: ChatMessageStatus;
  is_deleted: boolean;
  sender: ChatMember | null;
  attachment: ChatAttachment | null;
  reply_to: ChatReplyPreview | null;
  reactions: ChatReaction[];
}

export interface TypingUser {
  user_id: string;
  display_name: string | null;
}

/** Display name for a conversation: group title, or the other member's name. */
export function conversationDisplayName(
  convo: ChatConversation,
  myId: string
): string {
  if (convo.title?.trim()) return convo.title;
  const others = convo.members.filter((m) => m.user_id !== myId);
  if (others.length === 1) {
    return others[0].display_name || "Chat";
  }
  if (others.length > 1) {
    return others
      .slice(0, 3)
      .map((m) => m.display_name || "Someone")
      .join(", ");
  }
  return "Chat";
}

export function conversationAvatar(
  convo: ChatConversation,
  myId: string
): string | null {
  const others = convo.members.filter((m) => m.user_id !== myId);
  return others[0]?.avatar_url ?? null;
}

/** Legacy Apollo provider type (kept for staking/launchpad web3 helpers). */
export type IApolloProvider =
  | import("@apollo/client").ApolloClient<
      import("@apollo/client").NormalizedCacheObject
    >
  | null;

/** Legacy notification shape (kept for the notifications page). */
export interface Notify {
  id: string;
  create_at: Date;
  is_sent: boolean;
  is_seen: boolean;
  is_fetched: boolean;
  is_clickable: boolean;
  is_clicked: boolean;
  seen_Date: Date;
  title: string;
  topic: string;
  data: string;
  link: string;
  user_id: string;
  user: any;
}
