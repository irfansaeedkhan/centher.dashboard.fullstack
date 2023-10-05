import { axiosApiCenther } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import {
  RecentSearchExtended,
  RecentSearchExtendedWithType,
  SearchResponseType,
} from "./types";

export const getRecentSearch = async (): Promise<
  RecentSearchExtendedWithType[]
> => {
  try {
    const response = await axiosApiCenther.get<{
      recent_search: RecentSearchExtended[];
    }>("/api/search/recent");

    return response.data.recent_search.map((recentSearch) => ({
      response_type: SearchResponseType.recent_search,
      ...recentSearch,
    }));
  } catch (error: any) {
    throw new AppError(error, "Failed to get recent search", "GetRecentSearch");
  }
};
