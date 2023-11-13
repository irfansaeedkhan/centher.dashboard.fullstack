import { CFSBaseURL } from "@/constants/base-urls";

type Params =
  | {
      type: "default-avatar" | "default-cover-image";
    }
  | {
      type: "custom-image";
      object_name: string;
    };

export const getUserImageUrl = (params: Params): string => {
  if (params.type === "default-avatar") {
    return `${CFSBaseURL}/users?key=users/avatars/avatar-1.png`;
  } else if (params.type === "default-cover-image") {
    return `${CFSBaseURL}/users?key=users/covers/default-cover.png`;
  } else if (params.type === "custom-image") {
    return `${CFSBaseURL}/users?key=${params.object_name}`;
  } else {
    throw new Error("Invalid params");
  }
};
