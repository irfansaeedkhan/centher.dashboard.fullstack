import { User } from "@/models/user";
import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getUserByIdFromDB = async (userId: string): Promise<User> => {
  try {
    const { data } = await axiosCIS.get<User>(`/users/${userId}`);
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

export const getUsersByIdsFromDB = async (
  addresses: string[]
): Promise<MappedUser[]> => {
  const arr: string[] = [];
  addresses.forEach((e) => {
    if (arr.indexOf(e) === -1) {
      arr.push(e);
    }
  });

  try {
    const requests = arr.map((address) => getUserByIdFromDB(address));

    const users = (await Promise.allSettled(requests)).filter(
      (item) => item.status === "fulfilled"
    ) as PromiseFulfilledResult<User>[];

    const mappedUsers = users.map((e) => e.value);

    return addresses
      .map((e) => {
        return userMapper(
          mappedUsers.find(
            (user) => user._id.toLowerCase() === e.toLowerCase()
          ) as User
        );
      })
      .filter((e) => e != null) as MappedUser[];
  } catch (err) {
    throw err;
  }
};

function userMapper(user: User | undefined): MappedUser | null {
  if (!user) {
    return null;
  }
  return {
    _id: user._id,
    display_name: user.display_name,
    profile_image: user.profile_image,
    membership: user.membership,
    is_registered: true,
  };
}
