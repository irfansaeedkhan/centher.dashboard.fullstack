import { TopCreator } from "@/models/top-creator";
import { getUserByAddressFromDB } from "@/lib/get-user-by-address";
import { AppError } from "@/utils/app-error";

import { TopCreatorCardData } from "./creator-card";

export const getTopCreatorCardData = async (
  topCreator: TopCreator
): Promise<TopCreatorCardData> => {
  try {
    const user = await getUserByAddressFromDB(topCreator.publicKey);

    return {
      account_address: topCreator.publicKey,
      display_name: user.display_name,
      profile_image: user.profile_image,
    };
  } catch (error: any) {
    // If user is not registered, we will return a default user data
    if (error?.originalError?.response?.status === 404) {
      return {
        account_address: topCreator.publicKey,
        display_name: topCreator.publicKey,
        profile_image: {
          object_name: "https://static.centher.io/avatars/avatar-1.png",
          path: "https://static.centher.io/avatars/avatar-1.png",
        },
      };
    }

    throw new AppError(
      error,
      "Can not load Top Creators Data",
      "getTopCreatorCardData"
    );
  }
};
