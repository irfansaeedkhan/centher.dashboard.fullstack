import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export type AuthNonce = {
  nonce: string;
  nonce_with_message: string;
};

export const getNonce = async (account_address: string): Promise<AuthNonce> => {
  try {
    const { data } = await axiosCIS.get<AuthNonce>(
      `/api/wallet/nonce/${account_address}`
    );
    return data;
  } catch (error: any) {
    let errorMessage = "Can not get nonce";
    if (error.response?.status === 500) {
      throw new AppError(error, "Can not get nonce", "getNonce");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getNonce"
      );
    }
  }
};
