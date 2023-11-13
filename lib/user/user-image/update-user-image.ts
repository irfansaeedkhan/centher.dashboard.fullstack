import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { UpdateImage } from "./shared-types";

export const updateUserImage = async (
  userImage: UpdateImage
): Promise<void> => {
  try {
    await axiosCIS.patch("/users/image", userImage);
  } catch (error: any) {
    let errorMessage = "Can not update user image";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "updateUserImage");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "updateUserImage"
      );
    }
  }
};
