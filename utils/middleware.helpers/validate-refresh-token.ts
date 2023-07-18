import { AuthTokens } from "@/lib/auth";
import { CISBaseURL } from "@/constants/base-urls";
import { customLog } from "../custom.log";

const validateRefreshTokenRoute = `${CISBaseURL}/auth/validate/refresh-token`;

type ValidateRefreshTokenResponse = {
  sub: string;
  roles: string[];
  token_family: string;
  refresh_token: string;
};

// Validate Refresh from CIS
export async function validateRefreshToken(
  authTokens: AuthTokens
): Promise<ValidateRefreshTokenResponse | null> {
  try {
    let res = await fetch(validateRefreshTokenRoute, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.refresh_token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data;
  } catch (err: any) {
    customLog(err, ["development"]);
    return null;
  }
}
