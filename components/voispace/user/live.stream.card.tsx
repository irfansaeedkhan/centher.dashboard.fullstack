import Image from "next/image";
import React from "react";

interface Props {
  name: string;
  description: string;
  views: number;
  duration: string;
}

export const LiveStreamCard: React.FC<Props> = ({
  name,
  description,
  views,
  duration,
}) => {
  return (
    <div className="col-span-1 h-[227px] rounded-2xl bg-[url(/images/locknft.png)] bg-cover bg-center bg-no-repeat">
      <div className="flex h-full flex-col justify-between rounded-2xl bg-[#1c1d219f] p-4 backdrop-blur-[14px]">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/voispace.dummy.profile.png"
              width={28}
              height={28}
              alt="live-list-card"
              className="size-7 rounded-full border border-gray-shade-3"
            />
            <h4 className="text-xs text-white">{name}</h4>
          </div>
          <h3 className="text-center text-sm font-medium text-white">
            {description}
          </h3>
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
    </div>
  );
};
