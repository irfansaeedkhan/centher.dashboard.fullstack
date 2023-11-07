import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getMentionPermission = async () => {
  try {
    const response = await axiosCIS.get("/users/mention-permission");
    return response.data.mention_permission;
  } catch (error: any) {
    throw new AppError(
      error,
      "Failed to get mention permission",
      "GetMentionPermission"
    );
  }
};
