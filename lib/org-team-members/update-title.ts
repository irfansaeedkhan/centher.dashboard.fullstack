import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { PendingInvite } from "./types";

export const updateTitle = async (
  title: string,
  userId: PendingInvite["_id"]
): Promise<void> => {
  try {
    await axiosCIS.patch(`/orgs/members/${userId}`, { title });
  } catch (error: any) {
    const errorMessage = "Failed to update title";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "updateTitle");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "updateTitle"
      );
    }
  }
};
