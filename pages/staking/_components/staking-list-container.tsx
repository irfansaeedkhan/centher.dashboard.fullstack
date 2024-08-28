import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import useUser from "@/hooks/use.user";
import { ProductStaking } from "@/staking";
import { OptionalType } from "@/staking/types";
import { ListCardDataOBj } from "./list-card-data";
import GridLayoutCard from "./list-card";
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
  sdk: OptionalType<ProductStaking>;
}

const StakingListContainer: FC<ComponentProp> = ({ pools, coins, sdk }) => {
  const router = useRouter();
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
      <div className="mt-6 flex items-center gap-3 flg:hidden">
        <div className="w-full">
          <StakingDropdown
            placeholder="Sort by"
            options={sortOptions}
            selectedValue={showItems}
            onSelect={setShowItems}
          />
        </div>
      </div>
      <div className="mb-2 mt-7 grid h-auto w-full max-w-full grid-cols-1 gap-6 fmd:grid-cols-2">
        {data.map((card, index) => (
          <GridLayoutCard key={index} card={card} coins={coins} sdk={sdk} />
        ))}
      </div>

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
