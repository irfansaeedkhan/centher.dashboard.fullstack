import { axiosApi369x } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import {
  SearchResult,
  SearchResultWithType,
  SearchResponseType,
} from "./types";

export const search = async (
  query: string
): Promise<SearchResultWithType[]> => {
  try {
    const response = await axiosApi369x.get<{
      search_results: SearchResult[];
    }>(`/api/search?q=${query}&limit=5&offset=0`);

    return response.data.search_results.map((searchResult) => ({
      response_type: SearchResponseType.search_result,
      ...searchResult,
    }));
  } catch (error: any) {
    throw new AppError(error, "Failed to get search results", "Search");
  }
};
