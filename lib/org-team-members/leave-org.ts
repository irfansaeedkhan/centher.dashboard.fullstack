import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const leaveOrg = async (): Promise<void> => {
  try {
    await axiosCIS.delete("/api/orgs/leave");
  } catch (error: any) {
    const errorMessage = "Cannot leave organization";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "leaveOrg");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "leaveOrg"
      );
    }
  }
};
