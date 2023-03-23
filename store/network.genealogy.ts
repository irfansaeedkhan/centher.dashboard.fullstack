// React, Next, NPM Packages
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { LoadingState } from "@/models/common";
import { Genealogy, GenealogyChild, RewardsTotal } from "@/models/referral";
import { BlockchainRead } from "@/web3/blockchain";
import { ethers } from "ethers";

export const referralPercent = [6, 4, 2, 2, 2, 2];

export interface GenealogyStore {
  genealogies: Genealogy[] | null;
  rewardsTotal: RewardsTotal;
  fetchGenealogy: (account: string) => Promise<void>;
  fetchReferrers: (account: string, level: number) => Promise<void>;
  loading: LoadingState;
  updating: LoadingState;
}

export const useGenealogyStore = create<GenealogyStore>()(
  devtools(
    (set, get) => ({
      genealogies: null,
      rewardsTotal: { people: 0, busd: 0, bnb: 0, ntr: 0 },
      loading: "idle",
      updating: "loaded",
      fetchGenealogy: async (account) => {
        try {
          set({ loading: "loading" });

          let _genealogies: Genealogy[];
          let _rewardsTotal: RewardsTotal;

          const result = await BlockchainRead.getGenealogy(account, 1000, 0);
          _genealogies = [];
          if (result) {
            _rewardsTotal = { people: 0, busd: 0, bnb: 0, ntr: 0 };
            for (let i = 0; i < 6; i++) {
              let levelArray = result.filter(
                (item: any) => item.level === i + 1
              );
              let generatedBUSD = 0,
                generatedBNB = 0,
                generatedNTR = 0;
              for (let j = 0; j < levelArray.length; j++) {
                generatedBUSD += Number(
                  ethers.utils.formatEther(levelArray[j].user.generatedBUSD[i])
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

              _rewardsTotal.people += levelArray.length;
              _rewardsTotal.bnb += generatedBNB;
              _rewardsTotal.busd += generatedBUSD;
              _rewardsTotal.ntr += generatedNTR;
            }
          }
          set((state) => {
            return {
              genealogies: _genealogies,
              rewardsTotal: _rewardsTotal,
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
      fetchReferrers: async (account, level) => {
        try {
          set({ updating: "loading" });
          let _children: GenealogyChild[];
          let _genealogies: Genealogy[] | null = get().genealogies;

          if (_genealogies?.length) {
            for (let i = level; i < 6; i++) {
              _genealogies[i].children = [];
            }
            if (level > 0 && level < 6) {
              for (
                let i = 0;
                i < _genealogies[level - 1].children.length;
                i++
              ) {
                _genealogies[level - 1].children[i].active = false;
                if (
                  _genealogies[level - 1].children[
                    i
                  ].user.toLocaleLowerCase() === account?.toLocaleLowerCase()
                ) {
                  _genealogies[level - 1].children[i].active = true;
                }
              }
            }
          }
          const result = await BlockchainRead.getGenealogyAt(account, 1);
          if (result) {
            _children = result.map((item: any) => {
              const people = item.user.people.reduce(
                (prev: any, next: any) => Number(prev) + Number(next),
                0
              );
              return {
                id: level + 1,
                level: `0${level + 1}`,
                user: item.user.publicKey,
                people: people,
                generatedBUSD: Number(
                  ethers.utils.formatEther(item.user.generatedBUSD[level])
                ),
                generatedNTR: Number(
                  ethers.utils.formatEther(item.user.generatedNTR[level])
                ),
                generatedBNB: Number(
                  ethers.utils.formatEther(item.user.generatedBNB[level])
                ),
                active: false,
              };
            });
            if (_children && _children.length > 0) {
              if (_genealogies) {
                _genealogies = _genealogies.slice();
                _genealogies[level].children = _children;
              }
            }
          }

          set((state) => {
            return {
              genealogies: _genealogies,
              updating: "loaded",
            };
          });
        } catch (error) {
          set({ updating: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
    }),
    { name: "GenealogyStore" }
  )
);
