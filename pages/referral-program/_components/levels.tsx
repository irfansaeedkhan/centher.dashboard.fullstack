// App imports
import React, { useEffect, useState } from "react";
// Current directory imports
import { LevelMain } from "./level.main";
//  first array for parents second for children

let Data = [
  {
    id: 1,
    level: "01",
    percent: 9,
    children: [
      { id: 1, name: "irfan", level: "01" },
      { id: 2, name: "arsalan", level: "01" },
      { id: 3, name: "jibran", level: "01" },
      { id: 4, name: "shivam", level: "01" },
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
  const [dummyData, setDummyData] = useState<any>(Data);
  const [activeCard, setActiveCard] = useState(false);
  // const handleCard = (id: any) => {
  //   switch (id) {
  //     case "01":
  //       setDummyData((prev: any) => [
  //         ...prev,
  //         prev[1].children.push("new value"),
  //       ]);
  //       break;
  //   }
  // };
  function handleCard(id: any) {
    setActiveCard(true);
    const mutatedData = dummyData.map((data: any) => {
      console.log("data:::", data);
      if (id === "01" && data.level === "02") {
        return {
          ...data,
          children: [
            { id: 1, name: "irfan", level: "02" },
            { id: 2, name: "irfan", level: "02" },
            { id: 2, name: "irfan", level: "02" },
          ],
        };
      } else if (id === "02" && data.level === "03") {
        return {
          ...data,
          children: [
            { id: 1, name: "jibran", level: "03" },
            { id: 2, name: "jibran", level: "03" },
            { id: 2, name: "jibran", level: "03" },
            { id: 2, name: "jibran", level: "03" },
          ],
        };
      } else if (id === "03" && data.level === "04") {
        return {
          ...data,
          children: [
            { id: 1, name: "Arsalan", level: "04" },
            { id: 2, name: "Arsalan", level: "04" },
          ],
        };
      } else if (id === "04" && data.level === "05") {
        return {
          ...data,
          children: [
            { id: 1, name: "Shivam", level: "05" },
            { id: 2, name: "Shivam", level: "05" },
            { id: 1, name: "Shivam", level: "05" },
            { id: 2, name: "Shivam", level: "05" },
            { id: 1, name: "Shivam", level: "05" },
            { id: 2, name: "Shivam", level: "05" },
          ],
        };
      } else if (id === "05" && data.level === "06") {
        return {
          ...data,
          children: [
            { id: 1, name: "talha", level: "06" },
            { id: 2, name: "talha", level: "06" },
            { id: 2, name: "talha", level: "06" },
            { id: 2, name: "talha", level: "06" },
            { id: 2, name: "talha", level: "06" },
            { id: 2, name: "talha", level: "06" },
            { id: 2, name: "talha", level: "06" },
            { id: 2, name: "talha", level: "06" },
            { id: 2, name: "talha", level: "06" },
          ],
        };
      } else {
        return data;
      }
    });
    // Re-render with the new array
    setDummyData(mutatedData);
  }

  console.log("dummyData", dummyData);
  return (
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
  );
};
