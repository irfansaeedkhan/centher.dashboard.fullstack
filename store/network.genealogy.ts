import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ethers } from "ethers";

import { LoadingState } from "@/models/common";
import { Genealogy, GenealogyChild, RewardsTotal } from "@/models/referral";
import { getAllUserGenealogy } from "@/lib/get-user-genealogy";

export const referralPercent = [6, 4, 2, 2, 2, 2];

export interface GenealogyStore {
  users: any[];
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
      users: [],
      genealogies: null,
      rewardsTotal: { people: 0, busd: 0, bnb: 0, ntr: 0 },
      loading: "idle",
      updating: "loaded",
      fetchGenealogy: async (account) => {
        try {
          set({ loading: "loading" });

          const levels = await getAllUserGenealogy(account);

          const _genealogies = levels.map((e, i) => {
            if (!e?.length) {
              return {
                id: i + 1,
                level: `0${i + 1}`,
                percent: referralPercent[i],
                people: 0,
                generatedBUSD: 0,
                generatedNTR: 0,
                generatedBNB: 0,
                children: [],
              };
            } else {
              return {
                id: i + 1,
                level: `0${i + 1}`,
                percent: referralPercent[i],
                people: e.length,
                generatedBUSD: subByKey(e, "generatedBUSD"),
                generatedNTR: subByKey(e, "generatedNTR"),
                generatedBNB: subByKey(e, "generatedBNB"),
                children: [],
              };
            }
          });

          const flatedArray = levels.flat();
          const _rewardsTotal = {
            people: flatedArray.length,
            busd: subByKey(flatedArray, "generatedBUSD"),
            ntr: subByKey(flatedArray, "generatedNTR"),
            bnb: subByKey(flatedArray, "generatedBNB"),
          };

          set((state) => {
            return {
              users: levels,
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
          let _children: GenealogyChild[] = [];
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
          const users = get().users;
          if (users.length) {
            _children = users[level]
              .filter((e: any) => e.referrer == account)
              .map((e: any) => {
                return {
                  id: level + 1,
                  level: `0${level + 1}`,
                  user: e.publicKey,
                  people: users.flat().filter((r) => r.referrer == e.publicKey)
                    .length,
                  generatedBUSD: Number(
                    ethers.utils.formatEther(e.generatedBUSD[level])
                  ),
                  generatedNTR: Number(
                    ethers.utils.formatEther(e.generatedNTR[level])
                  ),
                  generatedBNB: Number(
                    ethers.utils.formatEther(e.generatedBNB[level])
                  ),
                  active: false,
                };
              });
          }

          if (_children && _children.length > 0) {
            if (_genealogies) {
              _genealogies = _genealogies.slice();
              _genealogies[level].children = _children;
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

function subByKey(array: any[], key: string): number {
  if (array.some((e) => !e[key])) {
    throw new Error("invalid key. All array memebers should have the key.");
  }
  return array.reduce(
    (a: number, b: any) => a + b[key].reduce((v: number, j: any) => v + +j, 0),
    0
  );
}
