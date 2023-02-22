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
      <div className="space-y-2">
        {SettingsSidebarData.map((item) => (
          <Link
            href={item.link}
            className={clsx(
              "flex items-center gap-3 py-2 fmd:px-3 flg:px-5",
              item.link === router.pathname &&
                "rounded-md bg-white bg-opacity-[0.03]"
            )}
            key={item.label}
          >
            <span
              className={clsx(
                "text-xl",
                item.link === router.pathname ? "text-white" : "text-[#A0A4BB]"
              )}
            >
              {item.icon}
            </span>
            <span
              className={clsx(
                "left-6 text-sm font-medium",
                item.link === router.pathname ? "text-white" : "text-[#A0A4BB]"
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;
