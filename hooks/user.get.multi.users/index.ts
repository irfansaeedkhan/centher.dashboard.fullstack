import { useCallback, useEffect, useState } from "react";
import { User } from "@/models/user";
import { LoadingState } from "@/models/common";
import { axiosCIS } from "@/utils/axios";
import { ZeroAddress } from "@/web3/constants/common";

const useGetMultiUsers = (userIds?: string[]) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<LoadingState>("idle");

  useEffect(() => {
    if (userIds && userIds.length > 0 && !userIds.includes(ZeroAddress)) {
      setLoading("loading");
      (async () => {
        try {
          const userIdsString = userIds.join(",");
          const { data } = await axiosCIS.get<{ users: User[] }>(
            `/users?user_ids=${userIdsString}`
          );
          setUsers(data.users);
          setLoading("loaded");
        } catch (error) {
          setUsers([]);
          setLoading("failed");
        }
      })();
    }
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

export default useGetMultiUsers;
