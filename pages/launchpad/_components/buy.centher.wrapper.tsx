import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { copyText } from "@/utils/copy.text";
import { AppRoutes } from "@/constants/app.routes";

const BuyCentherWrapper = () => {
  const router = useRouter();

  return (
    <div className="mb-6 flex flex-col items-center justify-between fsm:mb-5 fmd:flex-row">
      <div className="flex justify-center space-x-2 p-1.5 fmd:justify-start [@media(max-width:370px)]:overflow-auto">
        <Link
          href={{
            pathname: AppRoutes.launchpad,
            query: {
              token_address: "dexa",
              round: 0,
            },
          }}
          className={clsx(
            `min-w-fit max-w-max rounded-10px py-2 px-4 text-center text-sm font-bold transition-all duration-100 hover:bg-brand-primary hover:text-black-shade-3`,
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
            `pointer-events-none min-w-fit max-w-max rounded-10px py-2 px-4 text-center text-sm font-bold transition-all duration-100 hover:bg-brand-primary hover:text-black-shade-3`,
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
            `pointer-events-none min-w-fit max-w-max rounded-10px py-2 px-4 text-center text-sm font-bold transition-all duration-100 hover:bg-brand-primary hover:text-black-shade-3`,
            router.query.round === "2"
              ? `bg-brand-primary text-black-shade-3`
              : `bg-transparent text-gray-shade-7`
          )}
        >
          Round 3
        </Link>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2 fsm:mt-0 fsm:flex-row">
        <h3 className="min-w-fit max-w-max text-base text-white">
          Token Contract Address
        </h3>
        <button
          className={
            "text-14px hover:bg-brand-primary-shade-1 flex items-center gap-3 rounded-10px border border-brand-primary/60 bg-brand-primary/20 px-2 py-1 font-semibold text-brand-primary transition"
          }
        >
          0x4298...2fcB5
          <FiCopy
            className="ml-2 h-5 w-5 stroke-brand-primary hover:stroke-white"
            onClick={async () => {
              await copyText("0x4298...2fcB5");
              toast.success("Contract Address copied!");
            }}
          />
        </button>
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
    </div>
  );
};

export default BuyCentherWrapper;
