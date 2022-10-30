import { UserImage } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";

export const updateUserImage = async (
  userImage: UserImage & { type: "cover_image" | "profile_image" }
) => {
  try {
    await axiosNodeApi.patch("/api/users/me/user-image", userImage);
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
