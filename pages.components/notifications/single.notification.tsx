import ctl from "@netlify/classnames-template-literals";
import Image from "next/future/image";
import React from "react";

export const SingleNotification: React.FC = () => {
  return (
    <div className="w-full max-w-[1005px] h-[104px] p-6 bg-[#1D1F29] flex justify-between rounded-xl">
      <div className="flex items-center gap-2">
        <Image src="/images/a1.png" alt="dp" width={56} height={56} />
        <p className="text-sm text-white">
          Your NFT has been purchased by Hafiz Waqar Ali.
        </p>
      </div>
      <p className="text-sm text-gray-shade-2 ">30m ago</p>
    </div>
  );
};
