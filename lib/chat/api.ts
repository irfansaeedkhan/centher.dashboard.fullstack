/**
 * Phase 5: REST client for /api/chat/*. Uses the app's authed axios instance
 * so 401s flow through the same stale-session handling as everything else.
 */
import { axiosApi369x } from "@/utils/axios/centher-api";
import type { ChatConversation, ChatMessage } from "./types";

async function req<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const res = await promise;
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || `Chat request failed, please try again`
    );
  }
}

export const chatApi = {
  listConversations: () =>
    req(
      axiosApi369x.get<{ conversations: ChatConversation[] }>(
        "/api/chat/conversations"
      )
    ),

  createConversation: (user_ids: string[], title?: string) =>
    req(
      axiosApi369x.post<ChatConversation>("/api/chat/conversations", {
        user_ids,
        title,
      })
    ),

  deleteConversation: (id: string) =>
    req(axiosApi369x.delete<{ ok: true }>(`/api/chat/conversations/${id}`)),

  pinConversation: (id: string) =>
    req(
      axiosApi369x.post<{ ok: true }>(`/api/chat/conversations/${id}/pin`)
    ),

  unpinConversation: (id: string) =>
    req(
      axiosApi369x.post<{ ok: true }>(`/api/chat/conversations/${id}/unpin`)
    ),

  markAsRead: (id: string) =>
    req(
      axiosApi369x.post<{ ok: true }>(`/api/chat/conversations/${id}/read`)
    ),

  listMessages: (id: string, opts?: { limit?: number; before?: string }) =>
    req(
      axiosApi369x.get<{ messages: ChatMessage[] }>(
        `/api/chat/conversations/${id}/messages`,
        { params: { limit: opts?.limit, before: opts?.before } }
      )
    ),

  sendMessage: (id: string, body: string) =>
    req(
      axiosApi369x.post<ChatMessage>(
        `/api/chat/conversations/${id}/messages`,
        { body }
      )
    ),

  editMessage: (messageId: string, body: string) =>
    req(
      axiosApi369x.patch<ChatMessage>(`/api/chat/messages/${messageId}`, {
        body,
      })
    ),

  deleteMessage: (messageId: string) =>
    req(axiosApi369x.delete<{ ok: true }>(`/api/chat/messages/${messageId}`)),

  toggleReaction: (messageId: string, emoji: string) =>
    req(
      axiosApi369x.post<{ ok: true; reacted: boolean }>(
        `/api/chat/messages/${messageId}/reactions`,
        { emoji }
      )
    ),
};
