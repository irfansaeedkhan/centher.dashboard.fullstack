import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@/components/button";
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
      <div className="scrollSetLight2 flex w-full max-w-[590px] flex-shrink-0 items-center gap-3 overflow-x-auto">
        <Link href={`/staking/staking-details/${poolId}`}>
          <Button
            title="My Staking overview"
            variant={
              router.asPath === `/staking/staking-details/${poolId}`
                ? "primary"
                : "secondary"
            }
            className="w-[215px] flex-shrink-0 rounded-[10px] text-sm fsm:text-base"
          />
        </Link>
        <Link href={`/staking/staking-details/${poolId}/rewards`}>
          <Button
            title="Claim Rewards"
            variant={
              router.pathname.includes("rewards") ? "primary" : "secondary"
            }
            className="w-[162px] flex-shrink-0 rounded-[10px] text-sm fsm:text-base"
          />
        </Link>
        {stakingPool?.multilevel_rewards != "No referral" && (
          <Link href={`/staking/staking-details/${poolId}/referrals`}>
            <Button
              title="Referrals"
              variant={
                router.pathname.includes("referrals") ? "primary" : "secondary"
              }
              className="w-[109px] flex-shrink-0 rounded-[10px] text-sm fsm:text-base"
            />
          </Link>
        )}
        <Link href={AppRoutes.staking.faqs}>
          <Button
            title="FAQs"
            variant={
              router.pathname === AppRoutes.staking.faqs
                ? "primary"
                : "secondary"
            }
            className="h-9 w-full max-w-[68px] text-xs"
            borderRounded="10px"
          />
        </Link>
      </div>
      {children}
    </div>
  );
};

export default PageButtonsWrapper;
