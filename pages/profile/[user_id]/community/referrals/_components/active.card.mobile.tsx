import React from "react";
import Image from "next/image";
import Link from "next/link";
import useGetUser from "@/hooks/use.get.user";
import { AppRoutes } from "@/constants/app.routes";
import { formatAddress } from "@/utils/format.address";

export const ActiveCardMobile = ({ activeParent, handleMobileBack }: any) => {
  let Active = activeParent.at(-1);
  const { user } = useGetUser(Active?.user);
  return (
    <div
      className={`activeLevelCard relative w-full rounded-t-lg bg-background-shade-3`}
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

      <div className="flex items-center gap-3 px-3 pb-4 ">
        {user ? (
          <Image
            src={user.profile_image}
            alt={"profile pic"}
            width={36}
            height={36}
            sizes="36px"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-full bg-gray-shade-3"></div>
        )}

        <div className="flex flex-col gap-2">
          <Link
            href={{
              pathname: AppRoutes.profile.user_id,
              query: {
                user_id: Active?.user,
              },
            }}
            className={
              "overflow-hidden text-ellipsis whitespace-nowrap  text-white "
            }
          >
            <h5 className="text-12px dark font-medium text-white">
              {formatAddress(Active?.user)}
            </h5>
          </Link>

          <h6 className="light text-[10px] font-medium text-gray-shade-19">
            Level {Active?.level}
          </h6>
        </div>
      </div>
      <div
        className={`flex justify-between gap-2 border-t border-gray-shade-12/10 p-3 `}
      >
        <div className="flex flex-col gap-2">
          <h5 className="light text-12px font-medium text-gray-shade-19">
            Generated
          </h5>
          <h6 className="text-14px dark font-semibold text-white-shade-1">
            {`${Active?.generatedBUSD} BUSD`}
          </h6>
          {/* <h6 className="dark text-white-shade-1 text-14px font-semibold">
            {`${Active?.generatedNTR} NTR`}
          </h6> */}
        </div>
        <div className="flex flex-col items-end gap-2">
          <h5 className="light text-12px font-medium text-gray-shade-19">
            Line
          </h5>
          <h6 className="text-14px dark font-semibold text-white-shade-1">
            {`${Active?.people} People`}
          </h6>
        </div>
      </div>
      <svg
        className="absolute -bottom-[14px] left-[50%] translate-x-[-50%] rotate-90 "
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
