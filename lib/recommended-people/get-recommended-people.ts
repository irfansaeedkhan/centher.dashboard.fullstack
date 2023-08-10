import { User } from "@/models/user";
import { AppError } from "@/utils/app-error";
import { axiosApiCenther } from "@/utils/axios";

export interface RecommendedPeople {
  _id: User["_id"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
  membership: User["membership"];
  is_followed_by_loggedin_user: boolean;
}

export const getRecommendedPeople = async (): Promise<RecommendedPeople[]> => {
  try {
    const res = await axiosApiCenther.get<{ users: RecommendedPeople[] }>(
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
