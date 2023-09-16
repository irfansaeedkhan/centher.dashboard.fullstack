import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const deleteSentInvite = async (invite_id: string): Promise<void> => {
  try {
    await axiosCIS.delete("/orgs/members/invites/" + invite_id);
  } catch (error: any) {
    const errorMessage = "Cannot delete sent invite";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "deleteSentInvite");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "deleteSentInvite"
      );
    }
  }
};
