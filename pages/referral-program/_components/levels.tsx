// App imports
import React from "react";
// Current directory imports
import { LevelMain } from "./level.main";
//  first array for parents second for children

let dummyData = [
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
  return (
    <div className="w-full flex gap-3">
      {dummyData?.map((parentData: any) => {
        return <LevelMain parentData={parentData} key={parentData?.id} />;
      })}
    </div>
  );
};
