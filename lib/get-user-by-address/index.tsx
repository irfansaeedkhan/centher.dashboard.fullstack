import { User } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getUserByAddressFromDB = async (
  account_address: string
): Promise<User> => {
  try {
    const { data } = await axiosNodeApi.get<{ user: User }>(
      `/api/users/${account_address}`
    );
    return data.user;
  } catch (error: any) {
    throw new AppError(error, "Can not get user", "getUserByAddressFromDB");
  }
};
