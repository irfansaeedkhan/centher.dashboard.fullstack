import React, { useEffect, useState } from "react";

import NetworkGenealogySkeleton from "@/components/loading.skeletons/network.genealogy.skeleton";
import useUser from "@/hooks/use.user";
import { useGenealogyStore } from "@/store/network.genealogy";
import ProfileCommunityLayout from "@/layouts/profile.community.layout";
import { NextPageWithLayout } from "@/pages/_app.page";

import { LevelMain } from "./_components/level.main";

const Referrals: NextPageWithLayout = () => {
  const [level, setLevel] = useState(0);
  const [activeParent, setActiveParent] = useState<any>([]);
  const { user: loggedInUser } = useUser();

  const { genealogies, fetchGenealogy, fetchReferrers, loading, updating } =
    useGenealogyStore((state) => ({
      genealogies: state.genealogies,
      fetchGenealogy: state.fetchGenealogy,
      fetchReferrers: state.fetchReferrers,
      loading: state.loading,
      updating: state.updating,
    }));

  useEffect(() => {
    const fetchGeealogyBaseData = async (account: string) => {
      await fetchGenealogy(account);
      await fetchReferrers(account, 0);
    };
    if (loggedInUser?.account_address) {
      fetchGeealogyBaseData(loggedInUser?.account_address);
    }
  }, [fetchGenealogy, fetchReferrers, loggedInUser?.account_address]);

  // handles the active parentCard and list shown
  const handleCard = async (childData: any) => {
    const _level = Number(childData.level);
    if (updating === "loading") return;
    if (_level === 6) return;
    childData.level !== "06" &&
      setActiveParent((prev: any) => {
        if (prev.length > 0) {
          return [...prev, childData];
        } else {
          return [childData];
        }
      });
    await fetchReferrers(childData.user, _level);
    setLevel(_level);
  };
  const totalPeople =
    genealogies &&
    genealogies.length > 0 &&
    genealogies
      .map((level) => level.people)
      .reduce((a, b) => Number(a) + Number(b), 0);

  return (
    <div className="w-full">
      {!!genealogies?.length ? (
        <div className="customScrollbar flex w-full gap-3 overflow-auto pl-1 pr-2 pb-4">
          {genealogies &&
            genealogies.length > 0 &&
            genealogies.map((parentData: any, index: number) => {
              return (
                <LevelMain
                  parentData={parentData}
                  handleCard={handleCard}
                  key={index}
                />
              );
            })}
        </div>
      ) : (
        <NetworkGenealogySkeleton />
      )}
    </div>
  );
};

Referrals.getLayout = (page) => (
  <ProfileCommunityLayout>
    <div>{page}</div>
  </ProfileCommunityLayout>
);

export default Referrals;
