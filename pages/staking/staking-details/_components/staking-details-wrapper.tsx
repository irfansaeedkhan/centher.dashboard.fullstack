import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";

import FinalButton from "@/components/button/final.button";
import useUser from "@/hooks/use.user";
import { usePreBookingStats } from "@/hooks/use-pre-booking-stats";
import { AppRoutes } from "@/constants/app.routes";
import Booking from "./booking";
import Details from "./details";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface Props {
  children?: React.ReactNode;
}

const StakingDetailsWrapper = ({ children }: Props) => {
  const { user } = useUser();
  const { loading, preBookingStats } = usePreBookingStats(user?._id);
  const router = useRouter();

  if (loading === "failed") {
    return (
      <div className="text-center font-medium text-red-400">
        Failed to load data!
      </div>
    );
  }

  if (loading === "loading" || loading === "idle") {
    return (
      <div className="text-center">
        <CgSpinner className="inline-block h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return preBookingStats ? (
    <div className="mx-auto w-full max-w-[1144px] space-y-6">
      <div className="mx-auto h-auto w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 px-10 pt-10 pb-8">
        <Details />
        <div className="flex h-fit flex-col gap-8 py-8 flg:flex-row">
          {preBookingStats && <Booking preBookingStats={preBookingStats} />}
          <div className="h-auto w-full max-w-[512px] rounded-2xl border border-gray-shade-3 p-8">
            <p className="textGradient text-xl font-semibold">
              Reward Calculation
            </p>
            <div className="mt-11 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>You will recieve</span>
                <AiOutlineInfoCircle className="h-4 w-4" />
              </p>
              <p className="text-sm font-medium text-white">12.000 BNB</p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>Allowance</span>
                <AiOutlineInfoCircle className="h-4 w-4" />
              </p>
              <p className="text-sm font-medium text-white">07.000 Matic</p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>Reward fee</span>
                <AiOutlineInfoCircle className="h-4 w-4" />
              </p>
              <p className="text-sm font-medium text-white">12.000 BNB</p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-5">
              <p className="flex items-center gap-2 text-sm text-gray-shade-14">
                <span>Anual Fee</span>
                <AiOutlineInfoCircle className="h-4 w-4" />
              </p>
              <p className="text-sm font-medium text-white">12.000 BNB</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        <Link href={AppRoutes.staking.staking_details.index}>
          <FinalButton
            title="My Staking overview"
            variant={
              router.pathname === AppRoutes.staking.staking_details.index
                ? "primary"
                : "secondary"
            }
            className="rounded-[10px]"
          />
        </Link>
        <Link href={AppRoutes.staking.staking_details.rewards}>
          <FinalButton
            title="Claim Rewards"
            variant={
              router.pathname === AppRoutes.staking.staking_details.rewards
                ? "primary"
                : "secondary"
            }
            className="rounded-[10px]"
          />
        </Link>
        <Link href={AppRoutes.staking.staking_details.referrals}>
          <FinalButton
            title="Referrals"
            variant={
              router.pathname === AppRoutes.staking.staking_details.referrals
                ? "primary"
                : "secondary"
            }
            className="rounded-[10px]"
          />
        </Link>
      </div>
      {children}
    </div>
  ) : null;
};

export default StakingDetailsWrapper;
