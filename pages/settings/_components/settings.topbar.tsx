import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { SettingsSidebarItem } from "./settings.sidebar.data";

interface Props {
  sidebarData: SettingsSidebarItem[];
}

const SettingsTopBar: React.FC<Props> = ({ sidebarData }) => {
  const router = useRouter();

  return (
    <div className="scrollSetLight2 flex w-full max-w-[600px] flex-shrink-0 gap-4 overflow-x-auto py-3">
      {sidebarData.map((item) => (
        <Link
          href={item.link}
          className={clsx(
            "flex h-9 w-full flex-shrink-0 rounded-[14px] bg-[#17171A] p-[1px]",
            item.label === "Team Members" ? "max-w-[130px]" : "max-w-[100px] "
          )}
          key={item.label}
        >
          <span
            className={clsx(
              "flex w-full flex-grow items-center justify-center rounded-[14px] bg-[#17171A] py-1 text-sm font-semibold text-white"
            )}
          >
            <span
              className={clsx("pb-2", item.link === router.pathname && "myBox")}
            >
              {item.label}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
};

export default SettingsTopBar;
