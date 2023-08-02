import React, { FC, useState } from "react";
import Link from "next/link";

import FinalButton from "@/components/button/final.button";
import { AppRoutes } from "@/constants/app.routes";

import { ListCardData } from "./list-card-data";
import { LayoutGrid } from "@/assets/svgs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import GridLayoutCard from "./list-card";
import clsx from "clsx";
import ListLayoutTable from "./list-layout-table";

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
            <div onClick={() => setLayout("grid")}>
              <LayoutGrid
                className={clsx(
                  "cursor-pointer",
                  layout === "grid"
                    ? "stroke-white"
                    : "stroke-gray-shade-14 hover:stroke-white"
                )}
              />
            </div>
            <div onClick={() => setLayout("list")}>
              <AiOutlineUnorderedList
                className={clsx(
                  "cursor-pointer text-2xl",
                  layout === "list"
                    ? "text-white"
                    : "text-gray-shade-14 hover:text-white"
                )}
              />
            </div>
          </div>
        </div>
      </div>
      {layout === "grid" ? (
        <div className="mt-7 mb-2 flex h-full w-full max-w-full flex-col gap-6">
          {ListCardData.map((card, index) => (
            <GridLayoutCard key={index} card={card} />
          ))}
        </div>
      ) : layout === "list" ? (
        <ListLayoutTable card={ListCardData} />
      ) : null}
    </div>
  );
};

export default StakingListContainer;
