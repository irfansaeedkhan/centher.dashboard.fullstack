import Image from "next/image";
import React from "react";

const CreatorCard = () => {
  return (
    <div className="flex gap-3 items-center min-w-[122px]">
      <Image
        src={`/images/a1.png`}
        width={48}
        height={48}
        alt="profile"
        className="!w-12 !h-12 object-cover"
      />
      <div className={`flex flex-col gap-[2px]`}>
        <p className="text-sm font-medium text-white">Wadson</p>
        <p className="text-xs text-gray-shade-7">Tradesr</p>
      </div>
    </div>
  );
};

export default CreatorCard;
