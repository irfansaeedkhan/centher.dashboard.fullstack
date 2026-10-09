import { useCallback, useEffect, useState } from "react";
import { User } from "@/models/user";
import { LoadingState } from "@/models/common";
import { axiosCIS } from "@/utils/axios";
import { ZeroAddress } from "@/web3/constants/common";

export const useGetMultiUsers = (userIds?: string[]) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    setLoading("loading");
    (async () => {
      try {
        const users = await fetchUsers(userIds);
        setUsers(users);
        setLoading("loaded");
      } catch (error) {
        setUsers([]);
        setLoading("failed");
      }
    })();
  }, [userIds]);

  const mutateUsers = useCallback(async (updatedUsers: User[]) => {
    setUsers(updatedUsers);
  }, []);

  return {
    users,
    loading,
    mutateUsers,
  };
};

export async function fetchUsers(
  userIds: string[] | undefined
): Promise<User[]> {
  if (userIds && userIds.length > 0 && !userIds.includes(ZeroAddress)) {
    const userIdsString = userIds.join(",");
    const { data } = await axiosCIS.get<{ users: User[] }>(
      `/api/users?user_ids=${userIdsString}`
    );
    return data.users;
  } else throw new Error("Invalid params");
}
