import { User } from "@/models/user";
import { NODE_API_URL } from "@/constants/common";

export const getProfileImage = (user: User) => {
  if (user.custom_image) {
    return user.profile_image;
  }
  return `${NODE_API_URL}${user.profile_image}`;
};
