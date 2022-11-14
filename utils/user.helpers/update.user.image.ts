import { CoverImage, UserImage } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";

interface CoverImageExtended extends UserImage {
  type: "cover_image";
  y: string;
}

interface ProfileImageExtended extends UserImage {
  type: "profile_image";
}

type Image = CoverImageExtended | ProfileImageExtended;

export const updateUserImage = async (userImage: Image) => {
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
