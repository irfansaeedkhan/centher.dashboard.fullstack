import React from "react";
import { LevelChildCard } from "./level.child.card";
import { LevelParentCard } from "./level.parent.card";

export const LevelMain = ({ parentData, handleCard }: any) => {
  return (
    <div className="w-full flex flex-col gap-1 min-w-[100%] fsm:min-w-[181px] customScrollbar overscroll-auto ">
      <LevelParentCard parentData={parentData} />
      {parentData?.children?.map((childData: any, index: number) => {
        return (
          <LevelChildCard
            childData={childData}
            key={index}
            handleCard={handleCard}
          />
        );
      })}
    </div>
  );
};
