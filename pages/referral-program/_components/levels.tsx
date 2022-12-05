// App imports
import React from "react";
// Current directory imports
import { LevelParentCard } from "./index";
import { LevelChildCard } from "./index";

let dummyData = [
  {
    id: "1",
    title: "Level 1",
    children: [
      {
        id: "2",
        title: "Level 2",
      },
    ],
  },
  {
    id: "2",
    title: "Level 2",
    children: [
      {
        id: "2",
        title: "Level 2",
      },
    ],
  },
  {
    id: "3",
    title: "Level 3",
    children: [
      {
        id: "2",
        title: "Level 2",
      },
    ],
  },
  {
    id: "4",
    title: "Level 4",
    children: [
      {
        id: "2",
        title: "Level 2",
      },
    ],
  },
  {
    id: "5",
    title: "Level 5",
    children: [
      {
        id: "2",
        title: "Level 2",
      },
    ],
  },
  {
    id: "6",
    title: "Level 6",
    children: [
      {
        id: "2",
        title: "Level 2",
      },
    ],
  },
  {
    id: "7",
    title: "Level 7",
    children: [
      {
        id: "2",
        title: "Level 2",
      },
    ],
  },
];
export const Levels = () => {
  return (
    <div>
      {/* {dummyData.map(() => (
        <LevelParentCard />
      ))} */}
      <LevelParentCard />
      <LevelChildCard />
    </div>
  );
};
