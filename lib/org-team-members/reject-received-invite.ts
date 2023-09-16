import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { PendingInvite } from "./types";

export const rejectReceivedInvite = async (
  inviteId: PendingInvite["_id"]
): Promise<void> => {
  try {
    await axiosCIS.post(`/orgs/members/invites/${inviteId}/reject`);
  } catch (error: any) {
    const errorMessage = "Failed to reject received invite";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "rejectReceivedInvite");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "rejectReceivedInvite"
      );
    }
  }
};
