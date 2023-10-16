import React, { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";

interface Props {
  children: React.ReactNode;
}

const PageButtonsWrapper: FC<Props> = ({ children }) => {
  const router = useRouter();
  return (
    <div className="mx-auto w-full max-w-[1144px] space-y-6">
      <div className="flex items-center gap-3">
        <Link href={AppRoutes.staking.index}>
          <Button
            title="Projects"
            variant={
              router.pathname.includes("/staking/staking-details")
                ? "primary"
                : "secondary"
            }
            className="h-9 w-full max-w-[128px] text-xs"
            borderRounded="10px"
          />
        </Link>
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
