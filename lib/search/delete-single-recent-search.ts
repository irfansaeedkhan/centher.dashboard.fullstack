import { AppError } from "@/utils/app-error";
import { axiosApiCenther } from "@/utils/axios";

export const deleteSingleRecentSearch = async (searchId: string) => {
  try {
    await axiosApiCenther.delete(`/api/search/recent/${searchId}`);
  } catch (error: any) {
    throw new AppError(
      error,
      "Failed to delete recent search",
      "deleteRecentSearch"
    );
  }
};
