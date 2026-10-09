import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const removeOrgMembers = async (user_id: string): Promise<void> => {
  try {
    await axiosCIS.delete("/api/orgs/members/" + user_id);
  } catch (error: any) {
    const errorMessage = "Cannot remove organization member";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "removeOrgMembers");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "removeOrgMembers"
      );
    }
  }
};
