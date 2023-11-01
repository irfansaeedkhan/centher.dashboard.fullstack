import React from "react";
import { CountdownRendererFn } from "react-countdown";
import { HammerIconBG } from "@/assets/svgs";

const AuctionCountdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-shade-3 bg-[url('/images/backcolouredshadow.png')] bg-[length:85%] bg-center bg-no-repeat ">
      <div className="flex h-full w-full flex-col items-center justify-evenly gap-5 bg-black bg-opacity-20 bg-contain px-4 py-2 text-sm text-white backdrop-blur-[30px] fsm:m-0 fsm:flex-row fmd:mb-0 fmd:text-left">
        <div className="flex flex-col items-center gap-3 text-center  fsm:max-w-[138px]">
          <HammerIconBG className="scale-150" />
          <h4 className="text-sm font-normal text-white">
            This Auction will end in
          </h4>
        </div>
        <div className="flex h-full w-full max-w-[280px] items-center justify-evenly gap-2 fsm:justify-end fsm:gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[20px] font-semibold text-white">{days}</span>
            <span className="text-[12px] font-medium text-[#CFD1DD]">DAYS</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[20px] font-semibold text-white">
              {hours}
            </span>
            <span className="text-[12px] font-medium text-[#CFD1DD]">
              HOURS
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[20px] font-semibold text-white">
              {minutes}
            </span>
            <span className="text-[12px] font-medium text-[#CFD1DD]">MIN</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[20px] font-semibold text-white">
              {seconds}
            </span>
            <span className="text-[12px] font-medium text-[#CFD1DD]">
              Seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCountdownRenderer;
