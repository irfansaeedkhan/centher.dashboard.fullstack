import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { AutoRestakeStatus } from "./types";

export interface ToggleAutoRestakeStatusParams {
  pool_id: number;
  is_auto_restake_enabled: boolean;
}

export const toggleAutoRestakeStatus = async (
  params: ToggleAutoRestakeStatusParams
): Promise<AutoRestakeStatus> => {
  try {
    const { data } = await axiosCIS.patch<AutoRestakeStatus>(
      `/auto-restake`,
      params
    );
    return data;
  } catch (error: any) {
    const errorMessage = "Failed to update auto restake status";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "toggleAutoRestakeStatus");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "toggleAutoRestakeStatus"
      );
    }
  }
};
