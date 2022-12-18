// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { genealogyAtLevelQuery, genealogyQuery } from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import { Genealogy, GenealogyChild } from "@/models/referral";
import { ethers } from "ethers";
import { any } from "joi";
import { getItem } from "localforage";

export const referralPercent = [6, 4, 2, 2, 2, 2];

export interface GenealogyStore {
  genealogies: Genealogy[] | null;
  fetchGenealogy: (account: string | undefined) => Promise<void>;
  fetchReferrers: (account: string | undefined, level: number) => Promise<void>;
  loading: LoadingState;
  updating: LoadingState;
}

export const useGenealogyStore = create<GenealogyStore>()(
  devtools(
    (set, get) => ({
      genealogies: null,
      loading: "idle",
      updating: "loaded",
      fetchGenealogy: async (account) => {
        try {
          set({ loading: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _genealogies: Genealogy[];
          const {
            data: result,
            error,
            loading,
          } = await client.query({
            query: gql(genealogyQuery),
            variables: {
              referrer: account,
            },
            fetchPolicy: "cache-first",
          });
          if (!loading) {
            if (result && !error) {
              _genealogies = [];
              for (let i = 0; i < 6; i++) {
                let levelArray = result.genealogies.filter(
                  (item: any) => item.level === i + 1
                );
                let generatedBUSD = 0,
                  generatedBNB = 0,
                  generatedNTR = 0;
                for (let j = 0; j < levelArray.length; j++) {
                  generatedBUSD += Number(
                    ethers.utils.formatEther(
                      levelArray[j].user.generatedBUSD[i]
                    )
                  );
                  generatedBNB += Number(
                    ethers.utils.formatEther(levelArray[j].user.generatedBNB[i])
                  );
                  generatedNTR += Number(
                    ethers.utils.formatEther(levelArray[j].user.generatedNTR[i])
                  );
                }
                let levelInfo = {
                  id: i + 1,
                  level: `0${i + 1}`,
                  percent: referralPercent[i],
                  people: levelArray.length,
                  generatedBUSD: generatedBUSD,
                  generatedNTR: generatedNTR,
                  generatedBNB: generatedBNB,
                  children: [],
                };
                _genealogies.push(levelInfo);
              }
            }
          }

          set((state) => {
            return {
              genealogies: _genealogies,
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },
      fetchReferrers: async (account, level) => {
        try {
          set({ updating: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _children: GenealogyChild[];
          let _genealogies: Genealogy[] | null = get().genealogies;
          if (_genealogies) {
            for (let i = level - 1; i < 6; i++) {
              _genealogies[i].children = [];
            }
          }
          const {
            data: result,
            error,
            loading,
          } = await client.query({
            query: gql(genealogyAtLevelQuery),
            variables: {
              referrer: account,
              level: 1,
            },
            fetchPolicy: "cache-first",
          });
          if (!loading) {
            if (result && !error) {
              _children = result.genealogies.map((item: any) => {
                const people = item.user.people.reduce(
                  (prev: any, next: any) => Number(prev) + Number(next),
                  0
                );
                return {
                  id: level,
                  level: `0${level}`,
                  user: item.user.publicKey,
                  people: people,
                  generatedBUSD: Number(
                    ethers.utils.formatEther(item.user.generatedBUSD[level - 1])
                  ),
                  generatedNTR: Number(
                    ethers.utils.formatEther(item.user.generatedNTR[level - 1])
                  ),
                  generatedBNB: Number(
                    ethers.utils.formatEther(item.user.generatedBNB[level - 1])
                  ),
                };
              });
              if (_children && _children.length > 0) {
                if (_genealogies) {
                  _genealogies = _genealogies.slice();
                  _genealogies[level - 1].children = _children;

                  set((state) => {
                    return {
                      genealogies: _genealogies,
                      updating: "loaded",
                    };
                  });
                }
              }
            }
          }
        } catch (error) {
          set({ updating: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },
    }),
    { name: "GenealogyStore" }
  )
);
