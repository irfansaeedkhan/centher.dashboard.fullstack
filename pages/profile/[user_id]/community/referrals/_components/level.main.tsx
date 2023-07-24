import React from "react";
import { LevelChildCard } from "./level.child.card";
import { LevelParentCard } from "./level.parent.card";

export const LevelMain = ({ parentData, handleCard }: any) => {
  return (
    <div className="customScrollbar flex w-full min-w-[100%] flex-col gap-1 overscroll-auto fsm:min-w-[240px] ">
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
