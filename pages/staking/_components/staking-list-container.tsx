import React from "react";
import Link from "next/link";

import FinalButton from "@/components/button/final.button";
import { AppRoutes } from "@/constants/app.routes";

import { ListCardData } from "./list-card-data";
import ListCard from "./list-card";

const StakingListContainer: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-[1128px]">
      <div className="flex items-center justify-between gap-10">
        <h5 className="textGradient text-2xl font-semibold">Staking</h5>
        <Link href={AppRoutes.staking.create_staking}>
          <FinalButton
            className="text-14px                       "
            title="Create New"
            variant="primary"
          />
        </Link>
      </div>
      <div className="max-w-list-card mt-7 mb-2 grid h-full min-h-[682px] w-full gap-6 flg:grid-cols-2">
        {ListCardData.map((card, index) => (
          <ListCard key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

export default StakingListContainer;
