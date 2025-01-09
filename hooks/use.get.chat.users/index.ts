import { useEffect, useState } from "react";
import { axiosApi369x } from "@/utils/axios";

const useGetChatUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<any>();

  const getUsers = async (userAddresses: string[]) => {
    try {
      setLoading(true);

      if (!userAddresses?.length) {
        return [];
      }

      const existUsers = getStoreUsers(userAddresses);
      const existingIds = new Set(existUsers.map((user) => user._id));
      const needToFetchUsers = userAddresses.filter((e) => !existingIds.has(e));

      if (!needToFetchUsers?.length) {
        return existUsers;
      }

      const request = await getUsersRequest(needToFetchUsers);
      const fetchedUsers = request?.data?.users || [];
      setUsers(fetchedUsers);

      return [...fetchedUsers, ...existUsers];
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStoreUsers = (filter: string[]) => {
    if (!filter?.length) {
      return users;
    }

    filter = filter.map((e) => e.toLowerCase());

    return [...(users || [])].filter(
      (e) => filter.indexOf(e._id.toLowerCase()) !== -1
    );
  };

  const getUsersRequest = (users: string[]): Promise<any> => {
    return axiosApi369x.get(`/cis/users?user_ids=${users.join(",")}`);
  };

  return {
    getUsers,
    users,
    loading,
  };
};

export default useGetChatUsers;
