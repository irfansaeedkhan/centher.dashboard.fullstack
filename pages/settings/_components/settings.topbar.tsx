import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { SettingsSidebarItem } from "./settings.sidebar.data";
import { BackButton } from "@/components/button/back-button";

interface Props {
  sidebarData: SettingsSidebarItem[];
}

const SettingsTopBar: React.FC<Props> = ({ sidebarData }) => {
  const router = useRouter();

  return (
    <div className="scrollSetLight2 flex w-full max-w-[675px] flex-shrink-0 items-center gap-2 overflow-x-auto py-1.5">
      <BackButton svgClassName="size-10" />

      {sidebarData.map((item) => (
        <Link
          href={item.link}
          className={clsx(
            "w-fit flex-shrink-0"
            // item.label === "Team Members" ? "max-w-[130px]" : "max-w-[100px] "
          )}
          key={item.label}
        >
          <span
            className={clsx(
              "flex w-full flex-grow items-center justify-center text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
          >
            <span
              className={clsx(
                "px-4 py-1.5",
                item.link === router.pathname && "myBox"
              )}
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
