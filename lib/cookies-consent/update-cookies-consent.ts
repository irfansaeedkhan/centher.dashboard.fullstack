import { axiosNodeApi } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const updateCookiesConsent = async (cookiesConsent: boolean) => {
  try {
    const res = await axiosNodeApi.patch("/api/users/cookies-consent", {
      consent_given: cookiesConsent,
    });

    return res.data;
  } catch (err: any) {
    throw new AppError(
      err,
      "Failed to update cookies consent",
      "updateCookiesConsent"
    );
  }
};
