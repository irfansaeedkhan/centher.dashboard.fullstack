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
  }, [router]);

  return (
    <div className="mx-auto w-full max-w-[1144px] space-y-6">
      <div className="scrollSetLight2 flex w-full max-w-[780px] flex-shrink-0 items-center gap-4 overflow-x-auto py-2">
        <Link
          href={`/staking/staking-details/${poolId}`}
          className={clsx(
            router.asPath === `/staking/staking-details/${poolId}` &&
              "myBox font-medium",
            "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
          )}
        >
          My Staking
        </Link>
        <Link
          href={`/staking/staking-details/${poolId}/rewards`}
          className={clsx(
            router.pathname.includes("rewards") && "myBox font-medium",
            "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
          )}
        >
          Claim Rewards
        </Link>
        {stakingPool?.multilevel_rewards != "No referral" && (
          <Link
            href={`/staking/staking-details/${poolId}/referrals`}
            className={clsx(
              router.pathname.includes("referrals") && "myBox font-medium",
              "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
          >
            Referrals
          </Link>
        )}
        <Link
          href={`/staking/staking-details/${poolId}/project-details`}
          className={clsx(
            router.pathname.includes("project-details") && "myBox font-medium",
            "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
          )}
        >
          Project Details
        </Link>
        <Link
          href={AppRoutes.staking.index}
          className={clsx(
            router.pathname === AppRoutes.staking.index && "myBox font-medium",
            "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
          )}
        >
          Staking Home
        </Link>
        <Link
          href={AppRoutes.staking.faqs}
          className={clsx(
            router.pathname === AppRoutes.staking.faqs && "myBox font-medium",
            "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
          )}
        >
          FAQs
        </Link>
      </div>
      {children}
    </div>
  );
};

export default PageButtonsWrapper;
