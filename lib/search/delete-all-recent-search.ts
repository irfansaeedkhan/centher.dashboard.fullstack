import { AppError } from "@/utils/app-error";
import { axiosApiCenther } from "@/utils/axios";

export const deleteAllRecentSearch = async () => {
  try {
    await axiosApiCenther.delete("/api/search/recent");
  } catch (error: any) {
    throw new AppError(
      error,
      "Failed to delete recent search",
      "deleteRecentSearch"
    );
  }
};
