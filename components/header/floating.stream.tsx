import React, { useState } from "react";
import Image from "next/image";

import { MdBackupTable } from "react-icons/md";
import Button from "@/components/button";
import { MutedMic, UnmutedMic } from "@/assets/svgs";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

interface Props {
  onClose: () => void;
  roomId: string;
}

export const FloatingStreamComponent: React.FC<Props> = ({
  roomId,
  onClose,
}) => {
  const [floatStreamModal, setFloatStreamModal] = useState(true);
  // const verificationTick = useVerificationTick({ user });
  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex w-[90vw] -translate-x-1/2 flex-col items-center justify-center rounded-2xl bg-[#00000024]  backdrop-blur-lg md:bottom-8 md:w-[50vw]">
      <div className="flex w-full items-center justify-between gap-4  rounded-lg p-4 md:p-6">
        <div className={`flex items-center justify-center gap-3`}>
          <div className="relative flex h-10 w-10">
            <Image
              // src={user.profile_image}
              src={"/images/nftAsset.png"}
              width={40}
              height={40}
              alt="profile pic"
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            />
            {/* {verificationTick && ( */}
            {true && (
              <div className="absolute right-[-5px] top-[-1px] flex h-4 w-4 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-shade-3 ">
                <Image
                  // src={verificationTick}
                  src={"/images/nftAsset.png"}
                  width={12}
                  height={12}
                  alt="member icon"
                  className="h-3 w-3 flex-shrink-0 object-contain"
                />
              </div>
            )}
          </div>
          <div>
            <div className="flex max-w-[100%] items-center">
              <h5
                className={`word-break text-gradient-hover text-gradient max-w-[100%] truncate text-sm font-semibold text-white`}
              >
                {sliceDisplayName("John wedson")}
              </h5>
            </div>

            <h6 className={`text-xs text-[#FAFAFA]`}>The Room of Traders</h6>
          </div>
        </div>

        {/* action buttons */}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10">
            <UnmutedMic />

            {/* for muted state */}
            {/*  <MutedMic /> */}
          </div>

          <span className="hidden">
            <Button
              title={"Back to room"}
              variant="primary"
              onClick={() => {}}
              borderRounded="10px"
              className="text-sm font-medium"
            />
          </span>
        </div>
      </div>
      <span className="flex w-full items-center justify-center pb-4 md:hidden md:pb-6">
        <Button
          title={"Back to room"}
          variant="primary"
          onClick={() => {}}
          borderRounded="10px"
          className="w-[90%] text-sm font-medium"
        />
      </span>
    </div>
  );
};
