import { axiosApiCenther } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export interface CreateRecentSearch {
  user: string;
  query: string;
  result_count: number;
}

export const createRecentSearch = async (
  query: string
): Promise<CreateRecentSearch> => {
  try {
    const response = await axiosApiCenther.post("/api/search/recent", {
      query,
    });

    return response.data;
  } catch (error: any) {
    throw new AppError(
      error,
      "Failed to create recent search",
      "createRecentSearch"
    );
  }
};
