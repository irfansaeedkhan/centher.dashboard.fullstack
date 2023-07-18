import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import useGetUser from "@/hooks/use.get.user";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

export const LevelChildCard = ({ childData, handleCard }: any) => {
  const { user } = useGetUser(childData?.user);
  const verificationTick = useVerificationTick({ user });
  // const [activeCard, setActiveCard] = useState(false);

  return (
    <div
      className={`relative w-full cursor-pointer rounded-t-lg bg-background-shade-3  ${
        childData.active && "activeLevelCard"
      }`}
      onClick={() => {
        handleCard(childData);
        // childData.level !== "06" && setActiveCard(true);
      }}
    >
      <div className="flex items-center gap-3 py-4 px-3 ">
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
          {user ? (
            <Link
              href={{
                pathname: AppRoutes.profile.user_id,
                query: {
                  user_id: user?._id,
                },
              }}
              className={
                "flex items-center overflow-hidden text-ellipsis whitespace-nowrap  text-white"
              }
              title={user.display_name}
            >
              <h5
                className="text-12px dark flex-shrink-0 text-ellipsis whitespace-nowrap font-medium text-white"
                title={user.display_name}
              >
                {sliceDisplayName(user.display_name, "cropname")}
              </h5>
              {verificationTick && (
                <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                  <Image
                    src={verificationTick}
                    alt={"Verified"}
                    width={20}
                    height={20}
                  />
                </span>
              )}
            </Link>
          ) : (
            <div className="h-4 max-w-[180px] animate-pulse rounded-sm bg-gray-shade-3"></div>
          )}
          <h6 className="light text-[10px] font-medium text-gray-shade-19">
            Level {childData?.level}
          </h6>
        </div>
      </div>
      <div
        className={`flex justify-between gap-2 border-t border-gray-shade-3 p-3 ${
          childData.active && "border-gray-shade-12/10"
        }`}
      >
        <div className="flex flex-col gap-2">
          <h5 className="light text-12px font-medium text-gray-shade-19">
            Generated
          </h5>
          <h6 className="text-14px dark font-semibold text-white-shade-1">
            {`${childData?.generatedBUSD} BUSD`}
          </h6>
          {/* <h6 className="dark text-white-shade-1 text-14px font-semibold">
            {`${childData?.generatedNTR} NTR`}
          </h6> */}
        </div>
        <div className="flex flex-col items-end gap-2">
          <h5 className="light text-12px font-medium text-gray-shade-19">
            Line
          </h5>
          <h6 className="text-14px dark font-semibold text-white-shade-1">
            {`${childData?.people} People`}
          </h6>
        </div>
      </div>
      {childData.active && (
        <svg
          className="absolute top-[50%] -right-[10px] translate-y-[-50%] "
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
