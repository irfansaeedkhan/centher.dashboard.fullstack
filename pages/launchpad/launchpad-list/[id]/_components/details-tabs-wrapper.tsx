import React from "react";
import { useRouter } from "next/router";
import { clsx } from "clsx";
import { BackButton } from "@/components/button/back-button";

interface Props {
  children: React.ReactNode;
}

export const DetailsTabsWrapper: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1112px] space-y-5 bg-black-shade-3 pb-10 font-monto">
      <div className="scrollSetLight2 flex w-full max-w-[524px] flex-shrink-0 items-center gap-8 overflow-x-auto py-2">
        <BackButton />
        <div
          onClick={() => {
            router.push(
              `/launchpad/launchpad-list/${id}?list_type=launchpad_overview`
            );
          }}
          className={clsx(
            router.query.list_type === "launchpad_overview" && selectedClass,
            defaultClass
          )}
        >
          Launchpad Overview
        </div>

        <div
          onClick={() => {
            router.push(
              `/launchpad/launchpad-list/${id}?list_type=booking_list`
            );
          }}
          className={clsx(
            router.query.list_type === "booking_list" && selectedClass,
            defaultClass
          )}
        >
          Booking List
        </div>

        <div
          onClick={() => {
            router.push(
              `/launchpad/launchpad-list/${id}?list_type=referral_rewards`
            );
          }}
          className={clsx(
            router.query.list_type === "referral_rewards" && selectedClass,
            defaultClass
          )}
        >
          Referral Rewards
        </div>
      </div>
      {children}
    </div>
  );
};

const defaultClass =
  "w-fit flex-shrink-0 cursor-pointer py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6";

const selectedClass = "myBox font-medium";
