// App imports
import React, { useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";
// Current directory imports
import { LevelMain } from "./level.main";
import { LevelMainMobile } from "./level.main.mobile";
import { ActiveCardMobile } from "./active.card.mobile";
import useUser from "@/hooks/use.user";
import { useGenealogyStore } from "@/store/network.genealogy";

export const Levels = () => {
  const { width } = useWindowSize();
  const [level, setLevel] = useState(0);
  const [activeParent, setActiveParent] = useState<any>([]);
  const [mobileView, setMobileView] = useState<any>(true);
  const { user: loggedInUser } = useUser();

  const { genealogies, fetchGenealogy, fetchReferrers, loading, updating } =
    useGenealogyStore((state) => ({
      genealogies: state.genealogies,
      fetchGenealogy: state.fetchGenealogy,
      fetchReferrers: state.fetchReferrers,
      loading: state.loading,
      updating: state.updating,
    }));
  console.log("sniper: genealogies: ", genealogies);
  useEffect(() => {
    const fetchGeealogyBaseData = async (account: string) => {
      await fetchGenealogy(account);
      await fetchReferrers(account, 1);
    };
    if (loggedInUser?.account_address) {
      fetchGeealogyBaseData(loggedInUser?.account_address);
    }
  }, [fetchGenealogy, fetchReferrers, loggedInUser?.account_address]);

  // handles the active parentCard and list shown
  const handleCard = async (childData: any) => {
    const level = Number(childData.level);
    if (updating === "loading") return;
    if (level === 6) return;
    childData.level !== "06" &&
      setActiveParent((prev: any) => {
        if (prev.length > 0) {
          return [...prev, childData];
        } else {
          return [childData];
        }
      });
    fetchReferrers(childData.user, level + 1);
  };

  // handle the backbutton - previous active parent - level to show
  function handleMobileBack(activeParentLevel: any) {
    let newParentList = activeParent;
    newParentList.pop();
    setActiveParent(newParentList);
    if (activeParentLevel === "01") {
      setActiveParent([]);
      setLevel(0);
    } else if (activeParentLevel === "02") {
      setLevel(1);
    } else if (activeParentLevel === "03") {
      setLevel(2);
    } else if (activeParentLevel === "04") {
      setLevel(3);
    } else if (activeParentLevel === "05") {
      setLevel(4);
    } else if (activeParentLevel === "06") {
      setLevel(5);
    } else {
      setActiveParent([]);
    }
  }

  useEffect(() => {
    if (width > 1000) {
      setMobileView(false);
    }
  }, [width]);
  return (
    <>
      {mobileView ? (
        <div className="w-full flex flex-col gap-3">
          {activeParent?.length > 0 && (
            <ActiveCardMobile
              activeParent={activeParent}
              handleMobileBack={handleMobileBack}
            />
          )}
          {genealogies && genealogies.length > level && (
            <LevelMainMobile
              mobileData={genealogies[level]}
              handleCard={handleCard}
            />
          )}
        </div>
      ) : (
        <div className="w-full flex gap-3">
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
      )}
    </>
  );
};
