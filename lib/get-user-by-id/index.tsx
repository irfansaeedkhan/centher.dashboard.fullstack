import { User } from "@/models/user";
import { axiosCIS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export interface IMappedUser {
  _id: string;
  display_name: string;
  is_verified: boolean;
  is_registered?: boolean;
}

export interface NFTLockedDetailsProps {
  id: string;
  collection: string;
  tokenId: number;
  creator: IMappedUser | null;
  owner: IMappedUser | null;
  mintHash: string;
  createTime: number;
  ipfs: string;
  saleState: string;
  price: number;
  endTime: number;
  unlock: number;
  external?: boolean;
}

export const getUserByIdFromDB = async (userId: string): Promise<User> => {
  try {
    const { data } = await axiosCIS.get<User>(`/users/${userId}`);
    return data;
  } catch (error: any) {
    throw new AppError(error, "Can not get user", "getUserByIdFromDB");
  }
};

export const getUsersByIdsFromDB = async (
  addresses: string[]
): Promise<IMappedUser[]> => {
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

    return addresses.map((e) => {
      return userMapper(
        mappedUsers.find(
          (user) => user._id.toLowerCase() === e.toLowerCase()
        ) as User
      );
    }) as any;
  } catch (err) {
    throw err;
  }
};

function userMapper(user: User | undefined): IMappedUser | null {
  if (!user) {
    return null;
  }
  return {
    _id: user._id,
    display_name: user.display_name,
    is_verified: user.is_verified,
    is_registered: true,
  };
}
