import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { AppRoutes } from "@/constants/app.routes";
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
    label: "a-z",
    value: "2",
  },
];
const FilterOptions = [
  {
    label: "APY",
    value: "1",
  },
  {
    label: "A-Z",
    value: "2",
  },
];

export const TabsWrapper: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [sortItems, setSortItems] = useState<string>("1");
  const [filterItems, setFilterItems] = useState<string>("1");

  return (
    <div>
      <div className="mb-6 flex w-full flex-col justify-between gap-5 flg:flex-row flg:items-center">
        <div className="scrollSetLight2 flex w-full max-w-[420px] flex-shrink-0 items-center gap-4 overflow-x-auto py-2">
          <Link
            href={AppRoutes.launchpad.launchpad_list.index}
            className={clsx(
              router.pathname === AppRoutes.launchpad.launchpad_list.index &&
                "myBox font-medium",
              "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
          >
            All launchpad
          </Link>

          <Link
            href={AppRoutes.launchpad.launchpad_list.live}
            className={clsx(
              router.pathname === AppRoutes.launchpad.launchpad_list.live &&
                "myBox font-medium",
              "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
          >
            Live launchpad
          </Link>

          <Link
            href={AppRoutes.launchpad.launchpad_list.upcoming}
            className={clsx(
              router.pathname === AppRoutes.launchpad.launchpad_list.upcoming &&
                "myBox font-medium",
              "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
          >
            Upcoming
          </Link>
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
          <div className="w-[148px]">
            <Dropdowns
              placeholder="Filter by"
              options={FilterOptions}
              selectedValue={filterItems}
              onSelect={setFilterItems}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
