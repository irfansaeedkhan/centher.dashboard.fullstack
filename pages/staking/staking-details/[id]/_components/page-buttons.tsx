import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";
import { AppRoutes } from "@/constants/app.routes";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";

interface Props {
  children: React.ReactNode;
  stakingPool: ListCardDataOBj | null;
}

const PageButtonsWrapper: FC<Props> = ({ children, stakingPool }) => {
  const router = useRouter();
  const [poolId, setPoolId] = useState("0");

  useEffect(() => {
    const poolId = router.query.id as string;
    setPoolId(poolId);
  }, [poolId, router]);

  return (
    <div className="mx-auto w-full max-w-[1144px] space-y-6">
      <div className="scrollSetLight2 flex w-full max-w-[550px] flex-shrink-0 items-center gap-4 overflow-x-auto border-b border-gray-shade-3 py-2">
        <Link href={`/staking/staking-details/${poolId}`}>
          <span
            className={clsx(
              "w-fit flex-shrink-0 rounded-[10px] text-sm fsm:text-base",
              router.asPath === `/staking/staking-details/${poolId}`
                ? "textGradient myBox pb-2 font-semibold"
                : "text-gray-shade-18 hover:text-white"
            )}
          >
            My Staking overview
          </span>
        </Link>
        <Link href={`/staking/staking-details/${poolId}/rewards`}>
          <span
            className={clsx(
              "w-fit flex-shrink-0 rounded-[10px] text-sm fsm:text-base",
              router.pathname.includes("rewards")
                ? "textGradient myBox pb-2 font-semibold"
                : "text-gray-shade-18 hover:text-white"
            )}
          >
            Claim Rewards
          </span>
        </Link>
        {stakingPool?.multilevel_rewards != "No referral" && (
          <Link href={`/staking/staking-details/${poolId}/referrals`}>
            <span
              className={clsx(
                "w-fit flex-shrink-0 rounded-[10px] text-sm fsm:text-base",
                router.pathname.includes("referrals")
                  ? "textGradient myBox pb-2 font-semibold"
                  : "text-gray-shade-18 hover:text-white"
              )}
            >
              Referrals
            </span>
          </Link>
        )}
        <Link href={AppRoutes.staking.index}>
          <span
            className={clsx(
              "w-fit flex-shrink-0 rounded-[10px] text-sm fsm:text-base",
              router.pathname === AppRoutes.staking.index
                ? "textGradient myBox pb-2 font-semibold"
                : "text-gray-shade-18 hover:text-white"
            )}
          >
            Projects
          </span>
        </Link>
        <Link href={AppRoutes.staking.faqs}>
          <span
            className={clsx(
              "w-fit flex-shrink-0 rounded-[10px] text-sm fsm:text-base",
              router.pathname === AppRoutes.staking.faqs
                ? "textGradient myBox pb-2 font-semibold"
                : "text-gray-shade-18 hover:text-white"
            )}
          >
            FAQs
          </span>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default PageButtonsWrapper;
