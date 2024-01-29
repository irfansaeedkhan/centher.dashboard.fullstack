import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { AppRoutes } from "@/constants/app.routes";
import { BackButton } from "@/components/button/back-button";

interface Props {
  children: React.ReactNode;
}

const StakingMainWrapper: FC<Props> = ({ children }) => {
  const router = useRouter();
  const [poolId, setPoolId] = useState("0");

  useEffect(() => {
    const poolId = router.query.id as string;
    setPoolId(poolId);
  }, [router]);

  return (
    <div className="mx-auto w-full max-w-[1144px] space-y-6 bg-black-shade-3 font-monto">
      <div className="scrollSetLight2 flex w-full max-w-[800px] flex-shrink-0 items-center gap-4 overflow-x-auto py-2">
        <BackButton />
        {router.pathname !== AppRoutes.staking.index &&
          router.pathname !== AppRoutes.staking.faqs && (
            <Link
              href={`/staking/staking-details/${poolId}`}
              className={clsx(
                router.asPath === `/staking/staking-details/${poolId}` &&
                  selectedClass,
                defaultClass
              )}
            >
              Personal Rewards
            </Link>
          )}
        {router.pathname !== AppRoutes.staking.index &&
          router.pathname !== AppRoutes.staking.faqs && (
            <Link
              href={`/staking/staking-details/${poolId}/referrals`}
              className={clsx(
                router.pathname.includes("referrals") && selectedClass,
                defaultClass
              )}
            >
              Referral Rewards
            </Link>
          )}
        {router.pathname !== AppRoutes.staking.index &&
          router.pathname !== AppRoutes.staking.faqs && (
            <Link
              href={`/staking/staking-details/${poolId}/project-details`}
              className={clsx(
                router.pathname.includes("project-details") && selectedClass,
                defaultClass
              )}
            >
              Project Details
            </Link>
          )}
        <Link
          href={AppRoutes.staking.index}
          className={clsx(
            router.pathname === AppRoutes.staking.index && selectedClass,
            defaultClass
          )}
        >
          Staking Home
        </Link>
        <Link
          href={AppRoutes.staking.faqs}
          className={clsx(
            router.pathname === AppRoutes.staking.faqs && selectedClass,
            defaultClass
          )}
        >
          FAQs
        </Link>
      </div>

      {children}
    </div>
  );
};

export default StakingMainWrapper;

const defaultClass =
  "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6";

const selectedClass = "myBox font-medium";
