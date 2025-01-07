import { SocketOptions, ManagerOptions, io, Socket } from "socket.io-client";
import { getAuthTokens } from "@/lib/auth/auth-tokens-storage";

export class SocketClientService {
  static async build(): Promise<Socket> {
    const url = this.getSocketAddress();
    const options = await this.getOptions();
    const socket = io(url, options);

    return socket;
  }

  private static async getToken(): Promise<string> {
    return new Promise((res, rej) => {
      try {
        //TODO: return token from store
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
    //RETURN server address from envs
    return "SERVER_ADRESS";
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
