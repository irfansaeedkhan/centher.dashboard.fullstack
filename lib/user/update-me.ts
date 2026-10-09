import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { LoggedInUser } from "@/models/user";

export const updateMe = async (
  user: Partial<LoggedInUser>
): Promise<LoggedInUser> => {
  try {
    const social_media = { ...user.social_media } ?? {};
    delete user.social_media;

    const userUpdateObject: Partial<LoggedInUser> = {
      ...user,
      ...social_media,
    };

    const { data } = await axiosCIS.patch<LoggedInUser>(
      `/api/users/me`,
      userUpdateObject
    );

    return data;
  } catch (error: any) {
    let errorMessage = "Can not update user";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "updateMe");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "updateMe"
      );
    }
  }
};
