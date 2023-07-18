import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { UpdateImage } from "./shared-types";

interface UserImageUploadUrlResponse {
  presignedPostData: PresignedPostData;
  objectName: string;
}

interface PresignedPostData {
  url: string;
  fields: Fields;
}

interface Fields {
  key: string;
  acl: string;
  "Content-Type": string;
  bucket: string;
  "X-Amz-Algorithm": string;
  "X-Amz-Credential": string;
  "X-Amz-Date": string;
  Policy: string;
  "X-Amz-Signature": string;
}

export const getUserImageUploadUrl = async (
  filename: string,
  type: UpdateImage["type"]
): Promise<UserImageUploadUrlResponse> => {
  try {
    const { data } = await axiosCFS.get<UserImageUploadUrlResponse>(
      "/users/image-upload-url?filename=" + filename + "&type=" + type
    );

    return data;
  } catch (error: any) {
    let errorMessage = "Can not get user image upload url";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "getUserImageUploadUrl");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getUserImageUploadUrl"
      );
    }
  }
};
