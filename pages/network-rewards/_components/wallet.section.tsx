import React from "react";
import { FiCopy } from "react-icons/fi";
import { FacbookIcon, LinkedInIcon, TwitterSvg } from "@/assets/svgs";

const WalletSection = () => {
  return (
    <div className="w-full flex md:flex-row flex-col-reverse gap-6">
      <div className="w-full max-w-[810px] py-8 px-6 bg-elevation-1 rounded-[14px]">
        <p className="text-sm font-semibold text-gray-shade-7">YOUR WALLET</p>
        <h5 className="text-2xl font-semibold text-white mt-2">
          0x566CB....5DaD2
        </h5>
        <div className="w-full px-6 py-7 flex justify-between bg-gray-shade-9 rounded-xl mt-6 items-center">
          <p className="text-sm font-semibold text-gray-shade-7">
            DIRECT NETWORK:
          </p>
          <p className="text-sm font-bold text-white">1</p>
        </div>
        <div className="w-full px-6 py-7 flex justify-between bg-gray-shade-9 rounded-xl mt-3 items-center">
          <p className="text-sm font-semibold text-gray-shade-7">
            TOTAL CLAIMED
          </p>
          <p className="text-sm font-bold text-gray-shade-7 flex items-center gap-1">
            <span className="animationTextHeading text-base">500NTR </span>
            <span>($50)</span>
          </p>
        </div>
      </div>
      <div className="min-w-[310px] w-[310px] bg-[url(/images/network-reward-bg.svg)] h-[352px] rounded-[14px] bg-no-repeat bg-cover flex flex-grow bg-transparent">
        <div className="mt-[38px] w-full">
          <h5 className="text-xl font-bold text-white px-5">Earn 0.03%</h5>
          <p className="text-white text-xs font-semibold leading-6 mt-3 px-5">
            Invite your frieand & enjoy additional 0.03% daily of your friends
            Staking Pack earnings!
          </p>
          <div className="px-5">
            <div className="w-full rounded-xl mt-10 p-2 bg-white/[0.07] border border-white/20 backdrop-blur-md h-[52px] flex items-center justify-between gap-2">
              <p className="w-full max-w-[210px] font-semibold text-xs text-white truncate">
                https://app.nethernft.io/register?...
              </p>
              <button className="h-9 w-9 rounded-lg p-2 bg-white/20 backdrop-blur-[18px]">
                <FiCopy className="text-white text-xl" />
              </button>
            </div>
          </div>
          <div className="py-5">
            <hr className="text-white/[0.06]" />
          </div>
          <div className="flex px-5 gap-3 pb-5">
            <div className="px-4 py-1 bg-white/20 backdrop-blur-[18px] rounded-2xl flex flex-col items-center justify-between">
              <FacbookIcon />
              <p className="text-xs font-medium text-white">Facebook</p>
            </div>
            <div className="px-4 py-1 bg-white/20 backdrop-blur-[18px] rounded-2xl flex flex-col items-center justify-between">
              <TwitterSvg />
              <p className="text-xs font-medium text-white">Twitter</p>
            </div>
            <div className="px-4 py-1 bg-white/20 backdrop-blur-[18px] rounded-2xl flex flex-col items-center justify-between">
              <LinkedInIcon />
              <p className="text-xs font-medium text-white">LinkedIn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
