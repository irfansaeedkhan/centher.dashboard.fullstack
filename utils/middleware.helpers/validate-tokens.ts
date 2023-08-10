import { AuthTokens } from "@/lib/auth";
import { CISBaseURL } from "@/constants/base-urls";
import { customLog } from "../custom.log";

const validateAccessTokenRoute = `${CISBaseURL}/auth/validate/access-token`;
const validateRefreshTokenRoute = `${CISBaseURL}/auth/validate/refresh-token`;

type ValidateTokenResponse = {
  sub: string;
  roles: string[];
  token_family: string;
  membership: "citizen" | "verified" | "none";
};

// Validate Tokens from CIS
export async function validateTokens(
  authTokens: AuthTokens
): Promise<ValidateTokenResponse | null> {
  try {
    let res = await fetch(validateAccessTokenRoute, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.access_token}`,
      },
    });

    if (!res.ok) {
      res = await fetch(validateRefreshTokenRoute, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.refresh_token}`,
        },
      });

      if (!res.ok) {
        return null;
      }
    }

    const data = await res.json();

    return data;
  } catch (err: any) {
    customLog(["development"], err);
    return null;
  }
}
