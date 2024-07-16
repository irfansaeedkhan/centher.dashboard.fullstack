import React from "react";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

const AdsWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className={`w-full max-w-[544px] rounded-10px bg-elevation-1 p-4`}>
      <div className="grid grid-cols-[auto_1fr] gap-x-3">
        <div className="flex h-12 w-12">
          <Image
            alt="369x"
            src="/images/369x-new-logo.png"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
        </div>
        <div className="mb-2">
          <p className="text-sm font-semibold text-white">369x Advertising</p>
          <p className="gradient-border-3 mt-1 flex h-6 w-[100px] items-center justify-center rounded-xl p-[0.5px]">
            <span className="textGradient text-xs">Sponsorized</span>
          </p>
        </div>

        <div className="col-span-1 col-start-2 flex w-full items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdsWrapper;
