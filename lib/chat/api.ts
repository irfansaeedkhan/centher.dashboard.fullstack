/**
 * Phase 5: REST client for /api/chat/*. Uses the app's authed axios instance
 * so 401s flow through the same stale-session handling as everything else.
 */
import { axiosApi369x } from "@/utils/axios/centher-api";
import type {
  ChatAttachment,
  ChatConversation,
  ChatMessage,
  ChatMessageKind,
  TypingUser,
} from "./types";

async function req<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const res = await promise;
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || `Chat request failed, please try again`,
    );
  }
}

export const chatApi = {
  listConversations: () =>
    req(
      axiosApi369x.get<{ conversations: ChatConversation[] }>(
        "/api/chat/conversations",
      ),
    ),

  createConversation: (user_ids: string[], title?: string) =>
    req(
      axiosApi369x.post<ChatConversation>("/api/chat/conversations", {
        user_ids,
        title,
      }),
    ),

  deleteConversation: (id: string) =>
    req(axiosApi369x.delete<{ ok: true }>(`/api/chat/conversations/${id}`)),

  pinConversation: (id: string) =>
    req(axiosApi369x.post<{ ok: true }>(`/api/chat/conversations/${id}/pin`)),

  unpinConversation: (id: string) =>
    req(axiosApi369x.post<{ ok: true }>(`/api/chat/conversations/${id}/unpin`)),

  markAsRead: (id: string, opts?: { upToMessageId?: string }) =>
    req(
      axiosApi369x.post<{ ok: true }>(`/api/chat/conversations/${id}/read`, {
        up_to_message_id: opts?.upToMessageId,
      }),
    ),

  listMessages: (id: string, opts?: { limit?: number; before?: string }) =>
    req(
      axiosApi369x.get<{ messages: ChatMessage[] }>(
        `/api/chat/conversations/${id}/messages`,
        { params: { limit: opts?.limit, before: opts?.before } },
      ),
    ),

  sendMessage: (
    id: string,
    body: string,
    opts?: {
      kind?: ChatMessageKind;
      attachment_id?: string;
      reply_to_id?: string;
    },
  ) =>
    req(
      axiosApi369x.post<ChatMessage>(`/api/chat/conversations/${id}/messages`, {
        body,
        kind: opts?.kind ?? "text",
        attachment_id: opts?.attachment_id,
        reply_to_id: opts?.reply_to_id,
      }),
    ),

  registerAttachment: (data: {
    kind: "image" | "video" | "audio" | "file";
    mime_type: string;
    file_name: string;
    file_size: number;
    url: string;
    duration_sec?: number;
    width?: number;
    height?: number;
    thumbnail_url?: string;
  }) => req(axiosApi369x.post<ChatAttachment>("/api/chat/attachments", data)),

  markMessageRead: (messageId: string) =>
    req(
      axiosApi369x.post<{ ok: true }>(`/api/chat/messages/${messageId}/read`),
    ),

  sendTyping: (id: string) =>
    req(
      axiosApi369x.post<{ ok: true }>(`/api/chat/conversations/${id}/typing`),
    ),

  getTyping: (id: string) =>
    req(
      axiosApi369x.get<{ typing: TypingUser[] }>(
        `/api/chat/conversations/${id}/typing`,
      ),
    ),

  editMessage: (messageId: string, body: string) =>
    req(
      axiosApi369x.patch<ChatMessage>(`/api/chat/messages/${messageId}`, {
        body,
      }),
    ),

  deleteMessage: (messageId: string) =>
    req(axiosApi369x.delete<{ ok: true }>(`/api/chat/messages/${messageId}`)),

  toggleReaction: (messageId: string, emoji: string) =>
    req(
      axiosApi369x.post<{ ok: true; reacted: boolean }>(
        `/api/chat/messages/${messageId}/reactions`,
        { emoji },
      ),
    ),
};
