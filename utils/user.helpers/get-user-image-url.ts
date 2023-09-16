import { CFSBaseURL } from "@/constants/base-urls";

export const getUserImageUrl = (
  user_id: string,
  imageType: "profile-image" | "cover-image"
): string => {
  return `${CFSBaseURL}/users/${user_id}/${imageType}`;
};
