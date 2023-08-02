import React, { FC, useState } from "react";
import Link from "next/link";

import FinalButton from "@/components/button/final.button";
import { AppRoutes } from "@/constants/app.routes";

import { ListCardData } from "./list-card-data";
import ListCard from "./list-card";
import { LayoutGrid } from "@/assets/svgs";
import { AiOutlineUnorderedList } from "react-icons/ai";

const StakingListContainer: FC = () => {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  return (
    <div className="mx-auto w-full max-w-[1128px]">
      <div className="flex items-center justify-between gap-10">
        <div className="flex items-center gap-6">
          <h5 className="textGradient text-2xl font-semibold">Staking</h5>
          <Link href={AppRoutes.staking.create_staking}>
            <FinalButton
              className="text-14px                       "
              title="Create New Project"
              variant="primary"
              borderRounded="10px"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 items-center gap-3 rounded-lg border border-gray-shade-3 py-2 px-4">
            <div>
              <LayoutGrid className="cursor-pointer stroke-gray-shade-14 hover:stroke-white" />
            </div>
            <div>
              <AiOutlineUnorderedList className="cursor-pointer text-2xl text-gray-shade-14 hover:text-white" />
            </div>
          </div>
        </div>
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
