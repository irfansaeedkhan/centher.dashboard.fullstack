import { NFTCardData } from "@/components/nft.card/nft.card.v2";
import { AppError } from "@/utils/app-error";

import { getUserByAddressFromDB } from "../get-user-by-address";

export const getNFTOwnerData = async (
  account_address: string
): Promise<NFTCardData["owner"]> => {
  try {
    const user = await getUserByAddressFromDB(account_address);

    return {
      account_address,
      display_name: user.display_name,
      is_registered: true,
      profile_image: user.profile_image,
    };
  } catch (error: any) {
    // If user is not registered, we will return a default user data
    if (error?.originalError?.response?.status === 404) {
      return {
        account_address,
        display_name: account_address,
        is_registered: false,
        profile_image: {
          object_name: "https://static.centher.io/avatars/avatar-1.png",
          path: "https://static.centher.io/avatars/avatar-1.png",
        },
      };
    }
    throw new AppError(error, "Can not load NFT Owner Data", "getNFTOwnerData");
  }
};
