import { NFTCardData } from "@/components/nft.card";
import { AppError } from "@/utils/app-error";
import { getUserByIdFromDB } from "../get-user-by-id";

export const getNFTOwnerData = async (
  userId: string
): Promise<NFTCardData["owner"]> => {
  try {
    const user = await getUserByIdFromDB(userId);

    return {
      _id: userId,
      display_name: user.display_name,
      is_verified: user.is_verified,
      is_registered: true,
      profile_image: user.profile_image,
    };
  } catch (error: any) {
    // If user is not registered, we will return a default user data
    if (error?.originalError?.response?.status === 404) {
      return {
        _id: userId,
        display_name: userId,
        is_verified: false,
        is_registered: false,
        profile_image: "https://static.centher.io/avatars/avatar-1.png",
      };
    }
    throw new AppError(error, "Can not load NFT Owner Data", "getNFTOwnerData");
  }
};
