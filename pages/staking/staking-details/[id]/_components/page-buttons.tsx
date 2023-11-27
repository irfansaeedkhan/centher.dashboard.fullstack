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
      <div className="scrollSetLight2 flex w-full max-w-[575px] flex-shrink-0 items-center gap-4 overflow-x-auto py-2">
        <Link
          href={`/staking/staking-details/${poolId}`}
          className="flex flex-shrink-0"
        >
          <span
            className={clsx(
              "w-fit flex-shrink-0 rounded-[10px] pb-2 text-sm font-semibold text-white fsm:text-base",
              router.asPath === `/staking/staking-details/${poolId}` && "myBox"
            )}
          >
            Project Details
          </span>
        </Link>
        <Link
          href={`/staking/staking-details/${poolId}/rewards`}
          className="flex flex-shrink-0"
        >
          <span
            className={clsx(
              "w-fit flex-shrink-0 rounded-[10px] pb-2 text-sm font-semibold text-white fsm:text-base",
              router.pathname.includes("rewards") && "myBox"
            )}
          >
            Claim Rewards
          </span>
        </Link>
        {stakingPool?.multilevel_rewards != "No referral" && (
          <Link
            href={`/staking/staking-details/${poolId}/referrals`}
            className="flex flex-shrink-0"
          >
            <span
              className={clsx(
                "w-fit flex-shrink-0 rounded-[10px] pb-2 text-sm font-semibold text-white fsm:text-base",
                router.pathname.includes("referrals") && "myBox"
              )}
            >
              Referrals
            </span>
          </Link>
        )}
        <Link href={AppRoutes.staking.index} className="flex flex-shrink-0">
          <span
            className={clsx(
              "w-fit flex-shrink-0 rounded-[10px] pb-2 text-sm font-semibold text-white fsm:text-base",
              router.pathname === AppRoutes.staking.index && "myBox"
            )}
          >
            Staking Home
          </span>
        </Link>
        <Link href={AppRoutes.staking.faqs} className="flex flex-shrink-0">
          <span
            className={clsx(
              "w-fit flex-shrink-0 rounded-[10px] pb-2 text-sm font-semibold text-white fsm:text-base",
              router.pathname === AppRoutes.staking.faqs && "myBox"
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
