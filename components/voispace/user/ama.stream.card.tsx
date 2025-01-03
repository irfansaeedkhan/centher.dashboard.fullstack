import React from "react";
import Image from "next/image";

import { AmaLiveProfileIcon } from "@/assets/svgs";

interface Props {
  name: string;
  description: string;
  views: number;
  duration: string;
}

export const AmaStreamCard: React.FC<Props> = ({ name, views, duration }) => {
  return (
    <div className="col-span-1 flex h-[227px] flex-col justify-between rounded-2xl bg-[#1C1D21] p-4">
      <div className="flex flex-col items-center gap-4">
        <AmaLiveProfileIcon />
        <h3 className="text-center text-sm font-medium text-white">{name}</h3>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <div className="relative flex items-center justify-center">
            <div className="z-[10] flex size-6 items-center justify-center rounded-full border-2 border-[#262629]">
              <Image
                src="/images/voispace.dummy.profile.png"
                width={20}
                height={20}
                alt="viewers"
                className="flex size-5 max-w-5 flex-shrink-0 rounded-full"
              />
            </div>
            <Image
              src="/images/voispace.dummy.profile.png"
              width={20}
              height={20}
              alt="viewers"
              className="absolute -left-2 size-5 rounded-full"
            />
          </div>
          <span className="text-[11px] leading-[13px] tracking-[-0.4px] text-white">
            {views} Views
          </span>
        </div>
        <span className="text-[11px] leading-[13px] tracking-[-0.4px] text-gray-shade-14">
          {duration}
        </span>
      </div>
    </div>
  );
};
