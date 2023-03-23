import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";

const BuyCentherWrapper = () => {
  const router = useRouter();
  return (
    <>
      <div className="mb-6 flex w-full max-w-[488px] gap-4 rounded-[14px] bg-black-shade-6 p-[6px]">
        <Link
          href={{
            pathname: AppRoutes.launchpad,
            query: {
              token_address: "dexa",
              round: 0,
            },
          }}
          className={clsx(
            `w-full max-w-[148px] rounded-xl p-[10px] text-center text-sm font-bold`,
            router.query.round === "0"
              ? `bg-brand-primary text-black-shade-3`
              : `bg-transparent text-gray-shade-7`
          )}
        >
          Round 1
        </Link>
        <Link
          href={{
            pathname: AppRoutes.launchpad,
            query: {
              token_address: "dexa",
              round: 1,
            },
          }}
          className={clsx(
            `w-full max-w-[148px] rounded-xl p-[10px] text-center text-sm font-bold`,
            router.query.round === "1"
              ? `bg-brand-primary text-black-shade-3`
              : `bg-transparent text-gray-shade-7`
          )}
        >
          Round 2
        </Link>
        <Link
          href={{
            pathname: AppRoutes.launchpad,
            query: {
              token_address: "dexa",
              round: 2,
            },
          }}
          className={clsx(
            `w-full max-w-[148px] rounded-xl p-[10px] text-center text-sm font-bold`,
            router.query.round === "2"
              ? `bg-brand-primary text-black-shade-3`
              : `bg-transparent text-gray-shade-7`
          )}
        >
          Round 3
        </Link>
      </div>
      {/* {!!roundsInfo.length ? (
    <div className={`space-y-5`}>
      {roundsInfo.map((roundInfo) => (
        <div key={roundInfo.round} className={`space-y-5`}>
          <PresaleCard roundInfo={roundInfo} />
          {(roundInfo.status === "active" ||
            roundInfo.status === "ended") && (
            <RoundStats roundInfo={roundInfo} />
          )}
          <PurchaseCentherCard
            roundInfo={roundInfo}
            refreshRoundsInfo={refreshRoundsInfo}
          />
        </div>
      ))}
    </div>
  ) : (
    <LaunchpadSkeleton />
  )} */}
    </>
  );
};

export default BuyCentherWrapper;
