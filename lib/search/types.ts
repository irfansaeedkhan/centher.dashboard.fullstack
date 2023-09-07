import { User } from "@/models/user";

export enum SearchType {
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
  type: SearchType.search_result;
};

export interface RecentSearch {
  _id: string;
  user: string;
  query: string;
  result_count: number;
  createdAt: string;
  updatedAt: string;
}

export type RecentSearchWithType = RecentSearch & {
  type: SearchType.recent_search;
};

export type SearchPopupData = (SearchResultWithType | RecentSearchWithType)[];
