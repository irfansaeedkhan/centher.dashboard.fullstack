import { getAuthTokens } from "@/lib/auth/auth-tokens-storage";
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

  private static async getToken(): Promise<string> {
    return new Promise((res, rej) => {
      try {
        const tokens = getAuthTokens();
        if (tokens?.access_token) {
          res(tokens.access_token);
        } else {
          rej(new Error("Access token is undefined"));
        }
      } catch (error) {
        rej(error);
      }
    });
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
