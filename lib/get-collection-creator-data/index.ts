import { CollectionCardData } from "@/components/collection.card/collection-card-v2";
import { AppError } from "@/utils/app-error";

import { getUserByAddressFromDB } from "../get-user-by-address";

export const getCollectionCreatorData = async (
  account_address: string
): Promise<CollectionCardData["creator"]> => {
  try {
    const user = await getUserByAddressFromDB(account_address);

    return {
      account_address,
      display_name: user.display_name,
      is_registered: true,
    };
  } catch (error: any) {
    // If user is not registered, we will return a default user data
    if (error?.originalError?.response?.status === 404) {
      return {
        account_address,
        display_name: account_address,
        is_registered: false,
      };
    }
    throw new AppError(
      error,
      "Can not load Collection Creator Data",
      "getCollectionCreatorData"
    );
  }
};
