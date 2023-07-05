import clsx from "clsx";
import Link from "next/link";

import { AppRoutes } from "@/constants/app.routes";

import { RecommendedCard } from "./recommended.card";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const SuggestedCard: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(`relative max-w-[272px] select-none`, className)}
      {...props}
    >
      <div className={`relative rounded-10px bg-background-shade-3`}>
        <div className={`p-4`}>
          <h5 className={`text-14px pb-2 font-semibold text-white`}>
            Recommended people
          </h5>

          <RecommendedCard />
        </div>

        <div
          className={`flex cursor-pointer items-center justify-center border-t-2 border-gray-shade-3 text-center`}
        >
          <Link href={AppRoutes.recommended}>
            <button
              className={`text-14px hover: p-4 font-medium text-white hover:text-brand-primary`}
            >
              View all recommendations
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// styling
