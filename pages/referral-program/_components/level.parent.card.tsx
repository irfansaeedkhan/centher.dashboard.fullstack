import React from "react";
export const LevelParentCard = ({ parentData }: any) => {
  return (
    <div className="bg-background-shade-3 rounded-t-lg w-full">
      <div className="flex items-center justify-between p-3 pb-5 gap-2">
        <div className="flex flex-col gap-2">
          <h5 className="text-gray-shade-19 text-12px font-medium">LEVEL</h5>
          <h6 className="text-white-shade-1 text-14px font-semibold">
            {parentData?.level}
          </h6>
        </div>
        <div className=" rounded-lg w-8 h-8 border-2 border-yellow-theme/60 bg-yellow-theme/10 flex justify-center items-center">
          <h6 className="text-yellow-theme text-12px font-medium">
            {parentData?.percent}%
          </h6>
        </div>
      </div>
      <div className="flex justify-between gap-2 p-3 pb-4 border-t-2 border-gray-shade-3 bg-background-shade-2">
        <div className="flex flex-col gap-2">
          <h5 className="text-gray-shade-19 text-12px font-medium">People</h5>
          <h6 className="text-white-shade-1 text-14px font-semibold">118</h6>
        </div>
        <div className="flex flex-col items-end gap-2">
          <h5 className="text-gray-shade-19 text-12px font-medium">
            Generated
          </h5>
          <h6 className="text-white-shade-1 text-14px font-semibold">
            $37,459
          </h6>
        </div>
      </div>
    </div>
  );
};
