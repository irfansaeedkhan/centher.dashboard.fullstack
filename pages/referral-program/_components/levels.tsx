// App imports
import React, { useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";
// Current directory imports
import { LevelMain } from "./level.main";
import { LevelMainMobile } from "./level.main.mobile";
import { ActiveCardMobile } from "./active.card.mobile";

let Data = [
  {
    id: 1,
    level: "01",
    percent: 9,
    children: [
      { id: 1, name: "irfan", level: "01" },
      { id: 2, name: "irfan", level: "01" },
      { id: 3, name: "irfan", level: "01" },
      { id: 4, name: "irfan", level: "01" },
    ],
  },
  {
    id: 2,
    level: "02",
    percent: 7,
    children: [],
  },
  {
    id: 3,
    level: "03",
    percent: 5,
    children: [],
  },
  {
    id: 4,
    level: "04",
    percent: 3,
    children: [],
  },
  {
    id: 5,
    level: "05",
    percent: 2,
    children: [],
  },
  {
    id: 6,
    level: "06",
    percent: 3,
    children: [],
  },
];

export const Levels = () => {
  const { width } = useWindowSize();
  const [dummyData, setDummyData] = useState<any>(Data);
  const [level, setLevel] = useState(0);
  const [activeParent, setActiveParent] = useState<any>([]);
  const [mobileView, setMobileView] = useState<any>(true);

  // handles the active parentCard and list shown
  function handleCard(childData: any) {
    childData.level !== "06" &&
      setActiveParent((prev: any) => {
        if (prev.length > 0) {
          return [...prev, childData];
        } else {
          return [childData];
        }
      });

    const mutatedData = dummyData.map((data: any) => {
      if (childData.level === "01" && data.level === "02") {
        setLevel(1);
        return {
          ...data,
          children: [
            { id: 123423, name: "ghafoor", level: "02" },
            { id: 2342, name: "ghafoor", level: "02" },
            { id: 234234, name: "ghafoor", level: "02" },
          ],
        };
      } else if (childData.level === "02" && data.level === "03") {
        setLevel(2);
        return {
          ...data,
          children: [
            { id: 234234, name: "jibran", level: "03" },
            { id: 789789, name: "jibran", level: "03" },
            { id: 78978, name: "jibran", level: "03" },
            { id: 567567, name: "jibran", level: "03" },
          ],
        };
      } else if (childData.level === "03" && data.level === "04") {
        setLevel(3);
        return {
          ...data,
          children: [
            { id: 34563456466, name: "Arsalan", level: "04" },
            { id: 45645664, name: "Arsalan", level: "04" },
          ],
        };
      } else if (childData.level === "04" && data.level === "05") {
        setLevel(4);
        return {
          ...data,
          children: [
            { id: 9343, name: "Shivam", level: "05" },
            { id: 3436775, name: "Shivam", level: "05" },
            { id: 76855674563, name: "Shivam", level: "05" },
            { id: 23435646, name: "Shivam", level: "05" },
          ],
        };
      } else if (childData.level === "05" && data.level === "06") {
        setLevel(5);
        return {
          ...data,
          children: [
            { id: 99, name: "Mubashir", level: "06" },
            { id: 8888, name: "talha", level: "06" },
            { id: 7777, name: "ishtiaq", level: "06" },
            { id: 6666, name: "talha", level: "06" },
            { id: 55, name: "talha", level: "06" },
            { id: 44, name: "talha", level: "06" },
            { id: 3333333, name: "talha", level: "06" },
            { id: 22222, name: "talha", level: "06" },
            { id: 2657654, name: "talha", level: "06" },
          ],
        };
      } else {
        return data;
      }
    });
    // Re-render with the new array
    setDummyData(mutatedData);
  }

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
          <LevelMainMobile
            mobileData={dummyData[level]}
            handleCard={handleCard}
          />
        </div>
      ) : (
        <div className="w-full flex gap-3">
          {dummyData?.length > 0 &&
            dummyData?.map((parentData: any) => {
              return (
                <LevelMain
                  parentData={parentData}
                  handleCard={handleCard}
                  key={parentData?.id}
                />
              );
            })}
        </div>
      )}
    </>
  );
};
