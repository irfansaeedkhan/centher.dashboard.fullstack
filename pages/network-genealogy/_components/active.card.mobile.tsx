import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { AppRoutes } from "@/constants/app.routes";
import { formatAddress } from "@/utils/format.address";

export const ActiveCardMobile = ({ activeParent, handleMobileBack }: any) => {
  let Active = activeParent.at(-1);
  return (
    <div
      className={`bg-background-shade-3 rounded-t-lg w-full relative activeLevelCard`}
    >
      <button
        className="px-3 py-5"
        onClick={() => {
          handleMobileBack(Active?.level);
        }}
      >
        <svg
          width="15"
          height="12"
          viewBox="0 0 15 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M13.5 6L1.5 6"
            stroke="#1E212B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M5.5 10.5L1.5 6L5.5 1.5"
            stroke="#1E212B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="flex items-center pb-4 px-3 gap-3 ">
        <Image
          src={"/images/robertProfilepic.png"}
          alt={"profile pic"}
          width={36}
          height={36}
          sizes="36px"
          className="rounded-full object-cover w-9 h-9"
        />
        <div className="flex flex-col gap-2">
          <Link
            href={{
              pathname: AppRoutes.profile.account_address,
              query: {
                account_address: Active?.user?.account_address,
              },
            }}
            className={
              "whitespace-nowrap overflow-hidden text-ellipsis  text-white "
            }
          >
            <h5 className="dark text-white text-12px font-medium">
              {formatAddress(Active?.user)}
            </h5>
          </Link>

          <h6 className="light text-gray-shade-19 text-[10px] font-medium">
            Level {Active?.level}
          </h6>
        </div>
      </div>
      <div
        className={`flex justify-between gap-2 p-3 border-t border-gray-shade-12/10 `}
      >
        <div className="flex flex-col gap-2">
          <h5 className="light text-gray-shade-19 text-12px font-medium">
            Generated
          </h5>
          <h6 className="dark text-white-shade-1 text-14px font-semibold">
            {`${Active?.generatedBUSD} BUSD`}
          </h6>
          {/* <h6 className="dark text-white-shade-1 text-14px font-semibold">
            {`${Active?.generatedNTR} NTR`}
          </h6> */}
        </div>
        <div className="flex flex-col items-end gap-2">
          <h5 className="light text-gray-shade-19 text-12px font-medium">
            Line
          </h5>
          <h6 className="dark text-white-shade-1 text-14px font-semibold">
            {`${Active?.people} People`}
          </h6>
        </div>
      </div>
      <svg
        className="absolute left-[50%] translate-x-[-50%] -bottom-[14px] rotate-90 "
        width="10"
        height="21"
        viewBox="0 0 10 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 10.5L0 21V0L10 10.5Z" fill="#FED365" />
      </svg>
    </div>
  );
};
