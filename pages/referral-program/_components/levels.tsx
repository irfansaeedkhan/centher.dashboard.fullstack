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
];
export const Levels = () => {
  return (
    <div>
      <LevelParentCard />
      <LevelChildCard />
    </div>
  );
};
