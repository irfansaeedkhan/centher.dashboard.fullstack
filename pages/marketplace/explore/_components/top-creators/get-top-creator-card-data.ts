import { TopCreator } from "@/models/top-creator";
import { getUserByIdFromDB } from "@/lib/get-user-by-id";
import { AppError } from "@/utils/app-error";
import { TopCreatorCardData } from "./creator-card";

export const getTopCreatorCardData = async (
  topCreator: TopCreator
): Promise<TopCreatorCardData> => {
  try {
    const user = await getUserByIdFromDB(topCreator.publicKey);

    return {
      _id: topCreator.publicKey,
      display_name: user.display_name,
      profile_image: user.profile_image,
      membership: user.membership,
      is_registered: true,
    };
  } catch (error: any) {
    // If user is not registered, we will return a default user data
    if (error?.originalError?.response?.status === 404) {
      return {
        _id: topCreator.publicKey,
        display_name: topCreator.publicKey,
        profile_image: "https://static.centher.io/avatars/avatar-1.png",
        membership: {
          last_status: "none",
          status: "none",
          endAt: 0,
        },
        is_registered: false,
      };
    }

    throw new AppError(
      error,
      "Can not load Top Creators Data",
      "getTopCreatorCardData"
    );
  }
};
