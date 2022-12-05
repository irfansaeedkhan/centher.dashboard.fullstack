import React from "react";
import { LevelChildCard } from "./level.child.card";
import { LevelParentCard } from "./level.parent.card";

export const LevelMain = ({ parentData }: any) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <LevelParentCard parentData={parentData} />
      {parentData?.children?.map((childData: any) => {
        return <LevelChildCard childData={childData} key={childData?.id} />;
      })}
    </div>
  );
};
