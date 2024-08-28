import { AppError } from "@/utils/app-error";
import { axiosApi369x } from "@/utils/axios";

export const deleteSingleRecentSearch = async (searchId: string) => {
  try {
    await axiosApi369x.delete(`/api/search/recent/${searchId}`);
  } catch (error: any) {
    throw new AppError(
      error,
      "Failed to delete recent search",
      "deleteRecentSearch"
    );
  }
};
