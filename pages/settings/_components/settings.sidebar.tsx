import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

import { SettingsSidebarData } from "./settings.sidebar.data";

const SettingsSidebar = () => {
  const router = useRouter();
  return (
    <div className="w-[260px] flex-shrink-0">
      <h6 className="mb-5 text-xl font-semibold leading-7 text-white flg:mb-10">
        Settings
      </h6>
      <div className="flex flex-col space-y-2 rounded-3xl bg-[#1E1E21] p-6">
        {SettingsSidebarData.map((item) => (
          <Link
            href={item.link}
            className={clsx(
              "flex overflow-hidden rounded-[14px] bg-[#1E1E21] p-[1px]    ",
              item.link === router.pathname && "bg-gradient-pattern"
            )}
            key={item.label}
          >
            <span
              className={clsx(
                "left-6 flex-grow rounded-[14px] bg-[#1E1E21] py-3 px-4 text-sm font-medium"
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

export default SettingsSidebar;
