import { axiosApiCenther } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { RecentSearch, RecentSearchWithType, SearchType } from "./types";

export const getRecentSearch = async (): Promise<RecentSearchWithType[]> => {
  try {
    const response = await axiosApiCenther.get<{
      recent_search: RecentSearch[];
    }>("/api/search/recent");

    return response.data.recent_search.map((recentSearch) => ({
      type: SearchType.recent_search,
      ...recentSearch,
    }));
  } catch (error: any) {
    throw new AppError(error, "Failed to get recent search", "GetRecentSearch");
  }
};
