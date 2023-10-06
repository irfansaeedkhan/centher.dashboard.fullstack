import { User } from "@/models/user";

export enum SearchResponseType {
  "search_result" = "search_result",
  "recent_search" = "recent_search",
}

export interface SearchResult {
  _id: User["_id"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
  membership: User["membership"];
  is_followed_by_loggedin_user: boolean;
}

export type SearchResultWithType = SearchResult & {
  response_type: SearchResponseType.search_result;
};

export interface RecentSearch {
  _id: string;
  user: string;
  result_count: number;
  createdAt: string;
  updatedAt: string;
}

export type RecentSearchWithUser = RecentSearch & {
  search_type: "user";
  user_data: {
    _id: User["_id"];
    display_name: User["display_name"];
    profile_image: User["profile_image"];
    membership: User["membership"];
  };
};

export type RecentSearchWithQuery = RecentSearch & {
  search_type: "query";
  query: string;
};

export type RecentSearchExtended = RecentSearchWithUser | RecentSearchWithQuery;

export type RecentSearchExtendedWithType = RecentSearchExtended & {
  response_type: SearchResponseType.recent_search;
};

export type SearchPopupItem =
  | SearchResultWithType
  | RecentSearchExtendedWithType;
