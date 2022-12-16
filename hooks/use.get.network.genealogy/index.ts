import { genealogyBaseDataQuery, referrerQuery } from "@/subgraph/querys";
import { percent } from "@/web3/constants/common";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export interface IGenealogyChildren {
  id: number;
  address: string;
  level: string;
  generatedBUSD: number;
  generatedNTR: number;
  people: number;
}

export interface IGenealogy {
  id: number;
  level: string;
  percent: number;
  generatedBUSD: number;
  generatedNTR: number;
  people: number;
  children: IGenealogyChildren[];
}

export const useGetNetworkGenealogyBaseData = (
  account: string | null | undefined
) => {
  const [genealogyBaseData, setGenealogyBaseData] = useState<IGenealogy[]>([]);

  useEffect(() => {
    const fetchGenealogyBaseData = async (account: string) => {
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data: result } = await client.query({
        query: gql(genealogyBaseDataQuery),
        variables: {
          publicKey: account,
        },
        fetchPolicy: "cache-first",
      });

      if (result.users && result.users.length > 0) {
        const _genealogyBaseData = result.users[0].userInfo.map(
          (item: any, index: number) => {
            const level = `0${index + 1}`;
            return {
              id: index + 1,
              level: level,
              percent: percent[index],
              generatedBUSD: Number(
                ethers.utils.formatEther(item.earningBUSDFromInICO)
              ),
              generatedNTR: Number(
                ethers.utils.formatEther(item.earningBUSDFromInICO)
              ),
              people: Number(item.people),
              children: [],
            };
          }
        );

        setGenealogyBaseData(_genealogyBaseData);
      }
    };

    if (account) {
      fetchGenealogyBaseData(account);
    }
  }, [account]);
  return genealogyBaseData;
};
