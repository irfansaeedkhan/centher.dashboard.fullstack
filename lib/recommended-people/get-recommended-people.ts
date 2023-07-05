import { UserImage } from "@/models/user";
import { AppError } from "@/utils/app-error";
import { axiosNodeApi } from "@/utils/axios";

export interface RecommendedPeople {
  _id: string;
  display_name: string;
  account_address: string;
  profile_image: UserImage;
  is_verified: boolean;
  is_followed_by_loggedin_user: boolean;
}

export const getRecommendedPeople = async (): Promise<RecommendedPeople[]> => {
  try {
    const res = await axiosNodeApi.get<{ users: RecommendedPeople[] }>(
      "/api/socials/recommended-people"
    );
    return res.data.users;
  } catch (err: any) {
    throw new AppError(
      err,
      "Failed to get recommended people",
      "getRecommendedPeople"
    );
  }
};
