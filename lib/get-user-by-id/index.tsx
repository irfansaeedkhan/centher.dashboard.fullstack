import { User } from "@/models/user";
import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getUserByIdFromDB = async (userId: string): Promise<User> => {
  try {
    const { data } = await axiosCIS.get<User>(`/api/users/${userId}`);
    return data;
  } catch (error: any) {
    throw new AppError(error, "Can not get user", "getUserByIdFromDB");
  }
};

type MappedUser = Pick<
  User,
  "_id" | "display_name" | "profile_image" | "membership"
> & {
  is_registered: boolean;
};
