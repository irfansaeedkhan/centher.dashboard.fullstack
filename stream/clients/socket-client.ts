import { SocketOptions, ManagerOptions, io, Socket } from "socket.io-client";

export class SocketClientService {
  static async build(): Promise<Socket | null> {
    const url = this.getSocketAddress();
    // No socket URL configured (e.g. Vercel, which doesn't support WebSockets)
    // — skip silently instead of failing to wss://<origin>/feed.
    if (!url) return null;
    const options = await this.getOptions();
    const socket = io(url, options);

    return socket;
  }

  /**
   * Fetches a short-lived voice JWT from the app's own API (session-gated).
   * This replaced the legacy wallet `access_token` path, which was dead —
   * `getAuthTokens()` is never populated, so room creation died client-side
   * before any socket traffic.
   *
   * Pattern #7: on ANY failure the caller gets the friendly message, never
   * the raw reason (which could leak internals).
   */
  private static async getToken(): Promise<string> {
    try {
      const res = await fetch("/api/voice/token", { credentials: "include" });
      if (!res.ok) {
        throw new Error(`voice token request failed: ${res.status}`);
      }
      const data = (await res.json()) as { token?: unknown };
      if (typeof data?.token !== "string" || !data.token) {
        throw new Error("voice token response had no token");
      }
      return data.token;
    } catch (error) {
      // Log the real reason for diagnostics; the user only sees the
      // friendly message.
      console.error("[voice] could not get voice token:", error);
      throw new Error(
        "Could not connect to the voice server. Please try again."
      );
    }
  }

  private static getSocketAddress(): string {
    return process.env.NEXT_PUBLIC_GQL_URL_WEBSOCKET || "";
  }

  private static async getOptions(): Promise<
    Partial<ManagerOptions & SocketOptions>
  > {
    const token = await this.getToken();

    return {
      transportOptions: {
        polling: {
          extraHeaders:
            token != null
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
        },
      },
    };
  }
}
