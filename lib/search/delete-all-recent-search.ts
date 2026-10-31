import { AppError } from "@/utils/app-error";
import { axiosApi } from "@/utils/axios";

export const deleteAllRecentSearch = async () => {
  try {
    await axiosApi.delete("/api/search/recent");
  } catch (error: any) {
    throw new AppError(
      error,
      "Failed to delete recent search",
      "deleteRecentSearch"
    );
  }
};
