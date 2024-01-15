import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";
import useUser from "@/hooks/use.user";
import SettingSidebarSkeleton from "@/components/loading.skeletons/setting.sidebar.skeleton";
import { BackButton } from "@/components/button/back-button";
import { SettingsSidebarItem } from "./settings.sidebar.data";

interface Props {
  sidebarData: SettingsSidebarItem[];
}

const SettingsSidebar: React.FC<Props> = ({ sidebarData }) => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="w-[260px] flex-shrink-0">
      <BackButton />
      <h6 className="mb-5 text-xl font-semibold leading-7 text-white flg:mb-10">
        Settings
      </h6>
      {user ? (
        <div className="flex flex-col space-y-2 rounded-3xl bg-[#1E1E21] p-6">
          {sidebarData.map((item) => (
            <Link
              href={item.link}
              className={clsx(
                "flex overflow-hidden rounded-[14px] bg-[#1E1E21] p-[1px]",
                item.link === router.pathname && "bg-gradient-pattern"
              )}
              key={item.label}
            >
              <span
                className={clsx(
                  "left-6 flex-grow rounded-[14px] bg-[#1E1E21] px-4 py-3 text-sm font-medium"
                )}
              >
                <span
                  className={clsx(
                    item.link === router.pathname
                      ? "text-gradient"
                      : "text-white"
                  )}
                >
                  {item.label}
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <SettingSidebarSkeleton />
      )}
    </div>
  );
};

export default SettingsSidebar;
