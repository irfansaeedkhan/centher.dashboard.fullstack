import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

import { SettingsSidebarData } from "./settings.sidebar.data";

const SettingsTopBar = () => {
  const router = useRouter();
  return (
    <div className="mb-8 w-full  flex-shrink-0 overflow-x-auto bg-[#17171A] py-2 px-2 pb-3">
      <div className="justify-centerrounded-3xl flex w-full items-center gap-2">
        {SettingsSidebarData.map((item) => (
          <Link
            href={item.link}
            className={clsx(
              "flex h-8 min-w-max rounded-[14px] bg-[#17171A] p-[1px]",
              item.link === router.pathname && "bg-gradient-pattern"
            )}
            key={item.label}
          >
            <span
              className={clsx(
                "left-6 flex flex-grow items-center justify-center rounded-[14px] bg-[#17171A] py-1 px-4 text-sm font-medium"
              )}
            >
              <span
                className={clsx(
                  item.link === router.pathname ? "text-gradient" : "text-white"
                )}
              >
                {item.label}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsTopBar;
