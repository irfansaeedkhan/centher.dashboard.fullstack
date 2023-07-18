import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { LoggedInUser } from "@/models/user";

export const updateCookiesConsent = async (
  cookiesConsent: boolean
): Promise<LoggedInUser> => {
  try {
    const { data } = await axiosCIS.patch<LoggedInUser>(
      "/users/cookies-consent",
      {
        consent_given: cookiesConsent,
      }
    );

    return data;
  } catch (err: any) {
    throw new AppError(
      err,
      "Failed to update cookies consent",
      "updateCookiesConsent"
    );
  }
};
