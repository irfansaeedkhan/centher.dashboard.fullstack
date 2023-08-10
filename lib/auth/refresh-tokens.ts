import { axiosCIS } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { getAuthTokens, setAuthTokens } from "./auth-tokens-storage";
import { AuthTokens } from "./types";

export type RefreshTokensResponse = AuthTokens;

export const refreshTokens =
  async (): Promise<RefreshTokensResponse | null> => {
    try {
      const authTokens = getAuthTokens();

      if (!authTokens) {
        return null;
      }

      const { data } = await axiosCIS.post<RefreshTokensResponse>(
        `/auth/refresh-tokens`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens.refresh_token}`,
          },
        }
      );

      setAuthTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      return data;
    } catch (error: any) {
      customLog(["development", "staging"], error);
      throw error;
    }
  };
