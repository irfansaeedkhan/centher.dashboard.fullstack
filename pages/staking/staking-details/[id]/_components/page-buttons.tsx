import React, { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FinalButton from "@/components/button/final.button";
import { AppRoutes } from "@/constants/app.routes";

interface Props {
  children: React.ReactNode;
}

const PageButtonsWrapper: FC<Props> = ({ children }) => {
  const router = useRouter();
  return (
    <div className="mx-auto w-full max-w-[1144px] space-y-6">
      <div className="flex items-center gap-3">
        <Link href={AppRoutes.staking.staking_details.index}>
          <FinalButton
            title="Project Details"
            variant={
              router.pathname === AppRoutes.staking.staking_details.index ||
              router.pathname === AppRoutes.staking.staking_details.referrals ||
              router.pathname === AppRoutes.staking.staking_details.rewards
                ? "primary"
                : "secondary"
            }
            className="h-9 w-full max-w-[128px] text-xs"
            borderRounded="10px"
          />
        </Link>
        <Link href={AppRoutes.staking.faqs}>
          <FinalButton
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
