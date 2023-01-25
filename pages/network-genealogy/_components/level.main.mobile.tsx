import React from "react";
import { LevelChildCard } from "./level.child.card";
import { LevelParentCard } from "./level.parent.card";

export const LevelMainMobile = ({ mobileData, handleCard }: any) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <LevelParentCard parentData={mobileData} />
      {mobileData?.children?.map((childData: any, index: number) => {
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
