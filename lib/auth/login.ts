import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { User } from "@/models/user";
import { setAuthTokens } from "./auth-tokens-storage";
import { AuthTokens } from "./types";

export type LoginResponse = AuthTokens & {
  message: string;
  user: User;
};

export const login = async (
  account_address: string,
  signature: string
): Promise<LoginResponse> => {
  try {
    const { data } = await axiosCIS.post<LoginResponse>(`/api/wallet/login`, {
      account_address,
      signature,
    });

    setAuthTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    return data;
  } catch (error: any) {
    let errorMessage = "Can not login";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "login");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "login"
      );
    }
  }
};
