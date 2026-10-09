import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { AutoRestakeStatus } from "./types";

export const getAutoRestakeStatus = async (): Promise<AutoRestakeStatus> => {
  try {
    const { data } = await axiosCIS.get<AutoRestakeStatus>(`/api/auto-restake`);
    return data;
  } catch (error: any) {
    const errorMessage = "Failed to get auto restake status";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "getAutoRestakeStatus");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getAutoRestakeStatus"
      );
    }
  }
};
