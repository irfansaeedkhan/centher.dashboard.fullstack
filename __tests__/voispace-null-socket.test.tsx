/**
 * VoiSpace null-socket regression tests.
 *
 * Irfan reported live (2026-10-12): creating a VoiSpace room crashed with
 * "TypeError: Cannot read properties of null (reading 'emit')" when the
 * voice server rejected the connection (3000 "origin not allowed"), and the
 * modal then stuck on "setting up room..." forever.
 *
 * createRoom/joinRoom must throw/reject a friendly, catchable error when no
 * socket is available — never a TypeError on null.emit. The modal's catch
 * turns that error into a toast + stops the loader.
 */
import { renderHook } from "@testing-library/react";
import { useAMA } from "@/hooks/stream/use.ama";
import { useLive } from "@/hooks/stream/use.live";
import { SocketClientService } from "@/stream/clients/socket-client";

jest.mock("@/stream/clients/socket-client", () => ({
  SocketClientService: { build: jest.fn() },
}));

const mockedBuild = SocketClientService.build as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  // Voice server unreachable: build() resolves null (no URL configured, or
  // the connection was rejected before "connection-accepted").
  mockedBuild.mockResolvedValue(null);
});

describe("useAMA null socket", () => {
  test("createRoom throws a friendly error, not a TypeError on null.emit", async () => {
    const { result } = renderHook(() => useAMA({ deviceInstance: {} as any }));
    await expect(
      result.current.createRoom({ name: "test room" } as any, "user-1")
    ).rejects.toThrow("Could not connect to the voice server");
  });

  test("joinRoom rejects with a friendly error, not a TypeError", async () => {
    const { result } = renderHook(() => useAMA({ deviceInstance: {} as any }));
    await expect(result.current.joinRoom("room-1", "user-1")).rejects.toThrow(
      "Could not connect to the voice server"
    );
  });

  test("leave() does not throw when the socket is null", () => {
    const { result } = renderHook(() => useAMA({ deviceInstance: {} as any }));
    expect(() => result.current.leave()).not.toThrow();
  });
});

describe("useLive null socket", () => {
  test("createRoom throws a friendly error, not a TypeError on null.emit", async () => {
    const { result } = renderHook(() => useLive({ deviceInstance: {} as any }));
    await expect(
      result.current.createRoom({ name: "test room" } as any, "user-1")
    ).rejects.toThrow("Could not connect to the voice server");
  });

  test("joinRoom rejects with a friendly error, not a TypeError", async () => {
    const { result } = renderHook(() => useLive({ deviceInstance: {} as any }));
    await expect(result.current.joinRoom("room-1", "user-1")).rejects.toThrow(
      "Could not connect to the voice server"
    );
  });

  test("leave() does not throw when the socket is null", () => {
    const { result } = renderHook(() => useLive({ deviceInstance: {} as any }));
    expect(() => result.current.leave()).not.toThrow();
  });
});
