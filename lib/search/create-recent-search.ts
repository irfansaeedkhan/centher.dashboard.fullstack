import { axiosApiCenther } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export interface CreateRecentSearch {
  user: string;
  query: string;
  result_count: number;
}

type CreateRecentSearchUserType = {
  search_type: "user";
  searched_user: string;
};

type CreateRecentSearchQueryType = {
  search_type: "query";
  query: string;
};

export type CreateRecentSearchParams =
  | CreateRecentSearchUserType
  | CreateRecentSearchQueryType;

export const createRecentSearch = async (
  data: CreateRecentSearchParams
): Promise<CreateRecentSearch> => {
  try {
    const response = await axiosApiCenther.post("/api/search/recent", data);

    return response.data;
  } catch (error: any) {
    throw new AppError(
      error,
      "Failed to create recent search",
      "createRecentSearch"
    );
  }
};
