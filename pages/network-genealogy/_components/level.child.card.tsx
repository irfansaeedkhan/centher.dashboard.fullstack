import useGetUser from "@/hooks/use.get.user";
import useUser from "@/hooks/use.user";
import { formatAddress } from "@/utils/format.address";
import Image from "next/image";
import React, { useState } from "react";

export const LevelChildCard = ({ childData, handleCard }: any) => {
  const { user } = useGetUser(childData?.user);
  // const [activeCard, setActiveCard] = useState(false);
  return (
    <div
      className={`bg-background-shade-3 rounded-t-lg w-full relative ${
        childData.active && "activeLevelCard"
      }`}
      onClick={() => {
        handleCard(childData);
        // childData.level !== "06" && setActiveCard(true);
      }}
    >
      <div className="flex items-center py-4 px-3 gap-3 ">
        {user ? (
          <Image
            src={user.profile_image.path}
            alt={"profile pic"}
            width={36}
            height={36}
            sizes="36px"
            className="rounded-full object-cover w-9 h-9"
          />
        ) : (
          <div className="rounded-full w-12 h-12 bg-gray-shade-3 animate-pulse flex-shrink-0"></div>
        )}
        <div className="flex flex-col gap-2">
          {user ? (
            <h5 className="dark text-white text-12px font-medium flex-shrink-0">
              {user?.display_name}
            </h5>
          ) : (
            <div className="rounded-sm max-w-[180px] h-4 bg-gray-shade-3 animate-pulse"></div>
          )}
          <h6 className="light text-gray-shade-19 text-[10px] font-medium">
            Level {childData?.level}
          </h6>
        </div>
      </div>
      <div
        className={`flex justify-between gap-2 p-3 border-t border-gray-shade-3 ${
          childData.active && "border-gray-shade-12/10"
        }`}
      >
        <div className="flex flex-col gap-2">
          <h5 className="light text-gray-shade-19 text-12px font-medium">
            Generated
          </h5>
          <h6 className="dark text-white-shade-1 text-14px font-semibold">
            {`${childData?.generatedBUSD} BUSD`}
          </h6>
          {/* <h6 className="dark text-white-shade-1 text-14px font-semibold">
            {`${childData?.generatedNTR} NTR`}
          </h6> */}
        </div>
        <div className="flex flex-col items-end gap-2">
          <h5 className="light text-gray-shade-19 text-12px font-medium">
            Line
          </h5>
          <h6 className="dark text-white-shade-1 text-14px font-semibold">
            {`${childData?.people} People`}
          </h6>
        </div>
      </div>
      {childData.active && (
        <svg
          className="absolute top-[50%] translate-y-[-50%] -right-[10px] "
          width="10"
          height="21"
          viewBox="0 0 10 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 10.5L0 21V0L10 10.5Z" fill="#FED365" />
        </svg>
      )}
    </div>
  );
};
