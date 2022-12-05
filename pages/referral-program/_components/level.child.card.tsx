import Image from "next/image";
import React from "react";

export const LevelChildCard = () => {
  return (
    <div className="bg-background-shade-3 rounded-t-lg w-full">
      <div className="flex items-center py-4 px-3 gap-3">
        <Image
          src={"/images/robertProfilepic.png"}
          alt={"profile pic"}
          width={36}
          height={36}
          sizes="36px"
          className="rounded-full object-cover w-9 h-9"
        />
        <div className="flex flex-col gap-2">
          <h5 className="text-white text-12px font-medium">Jenny Wilson</h5>
          <h6 className="text-gray-shade-19 text-[10px] font-medium">
            Level 01
          </h6>
        </div>
      </div>
      <div className="flex justify-between gap-2 p-3 border-t-2 border-gray-shade-3">
        <div className="flex flex-col gap-2">
          <h5 className="text-gray-shade-19 text-12px font-medium">
            Generated
          </h5>
          <h6 className="text-white-shade-1 text-14px font-semibold">$38,28</h6>
        </div>
        <div className="flex flex-col items-end gap-2">
          <h5 className="text-gray-shade-19 text-12px font-medium">Line</h5>
          <h6 className="text-white-shade-1 text-14px font-semibold">
            88 People
          </h6>
        </div>
      </div>
    </div>
  );
};
