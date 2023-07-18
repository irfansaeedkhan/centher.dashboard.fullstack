import { CollectionCardData } from "@/components/collection.card/collection-card-v2";
import { AppError } from "@/utils/app-error";
import { getUserByIdFromDB } from "../get-user-by-id";

export const getCollectionCreatorData = async (
  userId: string
): Promise<CollectionCardData["creator"]> => {
  try {
    const user = await getUserByIdFromDB(userId);

    return {
      _id: userId,
      display_name: user.display_name,
      is_verified: user.is_verified,
      is_registered: true,
    };
  } catch (error: any) {
    // If user is not registered, we will return a default user data
    if (error?.originalError?.response?.status === 404) {
      return {
        _id: userId,
        display_name: userId,
        is_verified: false,
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
