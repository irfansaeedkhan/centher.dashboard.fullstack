import { useState } from "react";
import { StreamHooksHelper } from "./helper";
import { getStreams } from "@/stream/graphql/subscription";

export const useCoreStream = () => {
  const helper = new StreamHooksHelper();

  const useGetSubscribes = async () => {
    console.log("useGetSubscribes");
    const [data, setData] = useState<any>(null);
    const apollo = await helper.getApolloClientInstance();
    const query = getStreams();
    const result = apollo.subscribe({
      query,
      variables: {
        limit: 100,
      },
    });

    result.subscribe((data) => {
      console.log("Data1", data);
      setData(data);
    });

    return data;
  };

  return { useGetSubscribes };
};
