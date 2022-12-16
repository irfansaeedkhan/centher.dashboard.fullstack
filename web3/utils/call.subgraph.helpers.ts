import { referrerQuery } from "@/subgraph/querys";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { ethers } from "ethers";
import { percent } from "../constants/common";

export const getReferrers = async (
  account: string | null | undefined,
  level: string
) => {
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
    cache: new InMemoryCache(),
  });
  const { data: result } = await client.query({
    query: gql(referrerQuery),
    variables: {
      referrer: account,
    },
    fetchPolicy: "cache-first",
  });

  if (result.users && result.users.length > 0) {
    const _genealogyBaseData = result.users.map((item: any, index: number) => {
      const people = item.userInfo[0].people;
      const generatedBUSD = item.userInfo
        .map((item2: any) => item2.earningBUSDFromInICO)
        .reduce(
          (pre: any, next: any) =>
            Number(pre) + Number(ethers.utils.formatEther(next))
        );
      const generatedNTR = item.userInfo
        .map((item2: any) => item2.earningNTRFromInICO)
        .reduce(
          (pre: any, next: any) =>
            Number(pre) + Number(ethers.utils.formatEther(next))
        );
      return {
        id: index + 1,
        address: item.publicKey,
        level: level,
        generatedBUSD: generatedBUSD,
        generatedNTR: generatedNTR,
        people: Number(people),
      };
    });
    return _genealogyBaseData;
  }
  return [];
};
