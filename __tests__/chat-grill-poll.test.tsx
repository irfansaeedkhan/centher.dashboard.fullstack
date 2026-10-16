/**
 * @jest-environment jsdom
 *
 * Chat-grill Q19: the 5s poll used to POST markAsRead on every tick even
 * with zero new messages (~24 pointless writes/min per idle open chat).
 * Now markAsRead fires only when the newest message id actually changed.
 */
import { renderHook, act, waitFor } from "@testing-library/react";
import { useChatMessages } from "@/hooks/chat/useChat";

jest.mock("@/lib/chat/api", () => ({
  chatApi: {
    listMessages: jest.fn(),
    markAsRead: jest.fn().mockResolvedValue({ ok: true }),
    getTyping: jest.fn().mockResolvedValue({ typing: [] }),
  },
}));
jest.mock("@/hooks/use.user", () => {
  // Stable across renders — like the real SWR-backed hook. A fresh object
  // per render would change fetchMessages's identity and retrigger the
  // mount effect in a loop (pre-existing hook sensitivity, not test intent).
  const stable = { user: { _id: "me" } };
  return { __esModule: true, default: () => stable };
});

const { chatApi } = require("@/lib/chat/api");
const listMessages = chatApi.listMessages as jest.Mock;
const markAsRead = chatApi.markAsRead as jest.Mock;

const msg = (id: string, created: string) => ({
  id,
  body: `b-${id}`,
  kind: "text",
  sender_id: "peer",
  created_at: created,
  status: "sent",
  is_deleted: false,
  edited_at: null,
  sender: null,
  attachment: null,
  reply_to: null,
  reactions: [],
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe("Q19 poll skips markAsRead when nothing is new", () => {
  test("markAsRead fires on mount, but not on a poll with an unchanged newest id", async () => {
    listMessages.mockResolvedValue({
      messages: [msg("m1", "2026-10-16T10:00:01Z")],
      has_more: false,
    });
    const { result, unmount } = renderHook(() => useChatMessages("c1"));
    await waitFor(() => expect(markAsRead).toHaveBeenCalled());
    const callsAfterMount = markAsRead.mock.calls.length;
    expect(callsAfterMount).toBeGreaterThan(0);

    markAsRead.mockClear();
    await act(async () => {
      await result.current.refresh();
    });
    // Same newest id ("m1") → no write.
    expect(markAsRead).not.toHaveBeenCalled();
    unmount();
  });

  test("markAsRead fires again when a newer message arrives", async () => {
    listMessages.mockResolvedValue({
      messages: [msg("m1", "2026-10-16T10:00:01Z")],
      has_more: false,
    });
    const { result, unmount } = renderHook(() => useChatMessages("c1"));
    await waitFor(() => expect(markAsRead).toHaveBeenCalled());
    markAsRead.mockClear();

    listMessages.mockResolvedValue({
      messages: [
        msg("m1", "2026-10-16T10:00:01Z"),
        msg("m2", "2026-10-16T10:00:05Z"),
      ],
      has_more: false,
    });
    await act(async () => {
      await result.current.refresh();
    });
    expect(markAsRead).toHaveBeenCalledTimes(1);
    expect(markAsRead.mock.calls[0][1]).toEqual({ upToMessageId: "m2" });
    unmount();
  });
});

// Module scope guard.
export {};
