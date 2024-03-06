import { User } from "@/models/user";
import { axiosApiCenther } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const searchMentions = async ({
  query,
  limit = 5,
  offset = 0,
}: {
  query: string;
  limit?: number;
  offset?: number;
}): Promise<SearchMentionResult[]> => {
  try {
    const response = await axiosApiCenther.get<{
      mention_users: SearchMentionResult[];
    }>(`/api/socials/posts/mention`, {
      params: {
        q: query,
        limit,
        offset,
      },
    });

    return response.data.mention_users;
  } catch (error: any) {
    const errorMessage = "Failed to get search mention results";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "searchMentions");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "searchMentions"
      );
    }
  }
};

interface SearchMentionResult {
  _id: User["_id"];
  display_name: User["display_name"];
  membership: User["membership"];
  profile_image: User["profile_image"];
  mention_permission:
    | "everyone"
    | "followers"
    | "followings"
    | "followers_and_followings"
    | "no_one";
}
