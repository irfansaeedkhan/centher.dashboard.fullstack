import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { LoggedInUser } from "@/models/user";

export const updateMentionPermission = async (
  mentionPermission: string
): Promise<LoggedInUser> => {
  try {
    const response = await axiosCIS.patch<LoggedInUser>(
      "/users/mention-permission",
      {
        mention_permission: mentionPermission,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new AppError(
      error,
      "Failed to update mention permission",
      "UpdateMentionPermission"
    );
  }
};
