import React, { useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Dropdowns } from "@/components/shared";

interface Props {
  children: React.ReactNode;
}

const sortOptions = [
  {
    label: "A-Z",
    value: "1",
  },
  {
    label: "Z-A",
    value: "2",
  },
];

export const TabsWrapper: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [sortItems, setSortItems] = useState<string>("1");

  return (
    <div>
      <div className="mb-6 flex w-full flex-col justify-between gap-5 flg:flex-row flg:items-center">
        <div className="scrollSetLight2 flex w-full max-w-[420px] flex-shrink-0 items-center gap-4 overflow-x-auto py-2">
          <div
            onClick={() => {
              router.push("/launchpad/launchpad-list/?list_type=all?sort=asc");
            }}
            className={clsx(
              router.query.list_type === "all" && "myBox font-medium",
              "w-fit flex-shrink-0 cursor-pointer px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
          >
            All launchpad
          </div>

          <div
            onClick={() => {
              router.push("/launchpad/launchpad-list/?list_type=live");
            }}
            className={clsx(
              router.query.list_type === "live" && "myBox font-medium",
              "w-fit flex-shrink-0 cursor-pointer px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
          >
            Live launchpad
          </div>

          <div
            onClick={() => {
              router.push("/launchpad/launchpad-list/?list_type=upcoming");
            }}
            className={clsx(
              router.query.list_type === "upcoming" && "myBox font-medium",
              "w-fit flex-shrink-0 cursor-pointer px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
          >
            Upcoming
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[148px]">
            <Dropdowns
              placeholder="Sort by"
              options={sortOptions}
              selectedValue={sortItems}
              onSelect={setSortItems}
            />
          </div>
          {/* <div className="w-[148px]">
            <Dropdowns
              placeholder="Filter by"
              options={FilterOptions}
              selectedValue={filterItems}
              onSelect={setFilterItems}
            />
          </div> */}
        </div>
      </div>
      {children}
    </div>
  );
};
