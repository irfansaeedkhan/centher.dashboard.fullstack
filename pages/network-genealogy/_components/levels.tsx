// App imports
import React, { useEffect, useState } from "react";
// Current directory imports
import { LevelMain } from "./level.main";
import useUser from "@/hooks/use.user";
import { useGenealogyStore } from "@/store/network.genealogy";
import NetworkGenealogySkeleton from "@/components/loading.skeletons/network.genealogy.skeleton";

export const Levels = () => {
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
    genealogies.map((level) => level.people).reduce((a, b) => a + b, 0);
  return (
    <div>
      {totalPeople ? (
        <div className="pl-1 pr-2 ">
          <div className="w-full rounded-t-lg  bg-background-shade-3 px-4 py-3 flex flex-col gap-2  mb-4 max-w-[300px]">
            <h5 className="text-gray-shade-19 text-14px font-medium">
              Total Numbers Of People
            </h5>
            <h6 className="text-white-shade-1 text-14px font-semibold">
              {totalPeople ?? "N/A"}
            </h6>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-t-lg  bg-background-shade-3 mb-4 max-w-[300px] h-16 animate-pulse"></div>
      )}

      {!!genealogies?.length ? (
        <div className="w-full customScrollbar flex gap-3 pl-1 pr-2 geonologyScroll">
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
