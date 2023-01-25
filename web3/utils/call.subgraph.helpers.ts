import { genealogyAtLevelQuery, referrerQuery } from "@/subgraph/querys";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { ethers } from "ethers";
import { percent, SUBGRAPH_URL } from "../constants/common";

export const getReferrers = async (
  account: string | null | undefined,
  level: string
) => {
  const client = new ApolloClient({
    uri: SUBGRAPH_URL,
    cache: new InMemoryCache(),
  });
  const { data: result } = await client.query({
    query: gql(genealogyAtLevelQuery),
    variables: {
      referrer: account,
      level: Number(level),
    },
    fetchPolicy: "cache-first",
  });

  if (result.genealogies && result.genealogies.length > 0) {
    const _genealogyBaseData = result.genealogies.map(
      (item: any, index: number) => {
        const people = item.user.people.reduce(
          (partialSum: any, a: any) => partialSum + a,
          0
        );
        return {
          id: index + 1,
          address: item.user.publicKey,
          level: level,
          generatedBUSD: item.user.generatedBUSD[0],
          generatedNTR: item.user.generatedNTR[0],
          people: people,
        };
      }
    );
    return _genealogyBaseData;
  }
  return [];
};
