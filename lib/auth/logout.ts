import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { setAuthTokens } from "./auth-tokens-storage";

export type LogoutResponse = {
  status: string;
  message: string;
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const { data } = await axiosCIS.post<LogoutResponse>(`/auth/logout`);

    setAuthTokens({
      access_token: "",
      refresh_token: "",
    });

    return data;
  } catch (error: any) {
    let errorMessage = "Can not logout";
    if (error.response.status === 401) {
      setAuthTokens({
        access_token: "",
        refresh_token: "",
      });

      return {
        status: "success",
        message: "Successfully logged out",
      };
    } else if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "logout");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "logout"
      );
    }
  }
};
