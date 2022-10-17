import { UserImage } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";

export const updateProfileImage = async (userImage: UserImage) => {
  try {
    await axiosNodeApi.patch("/api/users/me/profile-image", userImage);
  } catch (error: any) {
    throw (
      error.response?.data ?? {
        status: "error",
        message: "server_error",
        message_description: "Something went wrong",
      }
    );
  }
};
