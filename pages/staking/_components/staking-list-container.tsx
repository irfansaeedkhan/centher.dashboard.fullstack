import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineUnorderedList } from "react-icons/ai";
import clsx from "clsx";
import { LayoutGrid } from "@/assets/svgs";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import useUser from "@/hooks/use.user";
import { ListCardDataOBj } from "./list-card-data";
import GridLayoutCard from "./list-card";
import ListLayoutTable from "./list-layout-table";
import StakingDropdown from "./dropdown-for-staking";

const sortOptions = [
  {
    label: "APY",
    value: "1",
  },
  {
    label: "A-Z",
    value: "2",
  },
];

interface ComponentProp {
  pools: ListCardDataOBj[];
  fetchTime: number;
  coins: Array<CoinDetails | undefined>;
}

const StakingListContainer: FC<ComponentProp> = ({ pools, coins }) => {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [showItems, setShowItems] = useState<string>("1");
  const [data, setData] = useState<ListCardDataOBj[]>([]);
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);
  const { user: loggedInUser } = useUser();

  useEffect(() => {
    if (pools.length) {
      if (showItems == "1") {
        setData(pools.sort((a, b) => +b.apy - +a.apy));
      }

      if (showItems == "2") {
        setData(pools.sort((a, b) => (a.pack < b.pack ? -1 : 1)));
      }
    }
  }, [showItems, pools]);

  return (
    <div className="mx-auto w-full max-w-[1128px]">
      <div className="flex items-center justify-between gap-10">
        <div className="flex w-full flex-col gap-5 fsm:w-fit fsm:flex-row fsm:items-center fsm:justify-start flg:gap-6">
          <h5 className="textGradient text-2xl font-semibold">Staking</h5>
          <div className="flex w-full items-center gap-5 flg:gap-6">
            <Button
              className="h-9 w-full text-sm fsm:min-w-max"
              title="Create New Project"
              variant="primary"
              borderRounded="10px"
              onClick={
                loggedInUser?.membership.status === "citizen"
                  ? () =>
                      router.push({
                        pathname: AppRoutes.staking.create_staking,
                      })
                  : () => setShowBuyCitizenshipModal(true)
              }
            />
          </div>
        </div>
        <div className="hidden items-center gap-2 fsm:flex">
          <div className="hidden items-center gap-3 flg:flex">
            <div className="flex h-9 items-center gap-3 rounded-lg border border-gray-shade-3 px-4 py-2">
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
            <div className="w-[162px]">
              <StakingDropdown
                placeholder="Sort by"
                options={sortOptions}
                selectedValue={showItems}
                onSelect={setShowItems}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3 flg:hidden">
        <div className="flex h-9 w-full items-center justify-center gap-3 rounded-lg border border-gray-shade-3 px-4 py-2">
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
        <div className="w-full">
          <StakingDropdown
            placeholder="Sort by"
            options={sortOptions}
            selectedValue={showItems}
            onSelect={setShowItems}
          />
        </div>
      </div>
      {layout === "grid" ? (
        <div className="mb-2 mt-7 grid h-full w-full max-w-full grid-cols-1 gap-6 fmd:grid-cols-2">
          {data.map((card, index) => (
            <GridLayoutCard key={index} card={card} coins={coins} />
          ))}
        </div>
      ) : layout === "list" ? (
        <ListLayoutTable card={data} coins={coins} />
      ) : null}

      {showBuyCitizenshipModal && (
        <BuyCitizenshipModal
          isOpen={showBuyCitizenshipModal}
          onClickClose={() => setShowBuyCitizenshipModal(false)}
        />
      )}
    </div>
  );
};

export default StakingListContainer;
