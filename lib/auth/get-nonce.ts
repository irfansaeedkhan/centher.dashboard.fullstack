import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export type AuthNonce = {
  nonce: string;
  nonce_with_message: string;
};

export const getNonce = async (account_address: string): Promise<AuthNonce> => {
  try {
    const { data } = await axiosCIS.get<AuthNonce>(
      `/auth/nonce/${account_address}`
    );
    return data;
  } catch (error: any) {
    let errorMessage = "Can not get nonce" + error;
    if (error.response?.status === 500) {
      throw new AppError(error, "Can not get nonce" + error, "getNonce");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getNonce"
      );
    }
  }
};
