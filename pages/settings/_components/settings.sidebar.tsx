import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

import { SettingsSidebarData } from "./settings.sidebar.data";
import useUser from "@/hooks/use.user";

const SettingsSidebar = () => {
  const { user } = useUser();
  const router = useRouter();

  // Filter the sidebar data based on membership status and availableFor field
  const filteredSidebarData = SettingsSidebarData.filter(
    (item) =>
      !(
        item.available_for === "citizen" &&
        user?.membership.status !== "citizen"
      ) &&
      !(
        item.available_for === "verified" &&
        user?.membership.status !== "verified"
      ) &&
      !(
        item.available_for === "non-citizen" &&
        user?.membership.status === "citizen"
      )
  );

  return (
    <div className="w-[260px] flex-shrink-0">
      <h6 className="mb-5 text-xl font-semibold leading-7 text-white flg:mb-10">
        Settings
      </h6>
      <div className="flex flex-col space-y-2 rounded-3xl bg-[#1E1E21] p-6">
        {filteredSidebarData.map((item) => (
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
