import React from "react";
import Link from "next/link";

import { AppRoutes } from "@/constants/app.routes";
import { NextPageWithLayout } from "@/pages/_app.page";
import FinalButton from "@/components/button/final.button";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

import ListCard from "./_components/list-card";
import { ListCardData } from "./_components/list-card-data";

const StakingList: NextPageWithLayout = () => {
  return (
    <div className="mx-auto w-full max-w-[1128px]">
      <div className="flex items-center justify-between gap-10">
        <h5 className="textGradient text-2xl font-semibold">Staking</h5>
        <Link href={AppRoutes.staking.create_staking}>
          <FinalButton className="" title="Create New" variant="primary" />
        </Link>
      </div>
      <div className="max-w-list-card mt-7 flex h-full min-h-[682px] gap-6">
        {ListCardData.map((card, index) => (
          <ListCard key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

StakingList.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Staking List">{page}</AllPagesWrapper>;
};

export default StakingList;
