import React, { useMemo } from "react";
import useUser from "@/hooks/use.user";
import { useGetReceivedInvites } from "@/hooks/org-team-members";
import { AppRoutes } from "@/constants/app.routes";
import SettingsSidebar from "./settings.sidebar";
import SettingsTopBar from "./settings.topbar";
import { SettingsSidebarData } from "./settings.sidebar.data";

interface Props {
  children: React.ReactNode;
}

export const SettingsPagesWrapper: React.FC<Props> = ({ children }) => {
  const { user } = useUser();
  const { receivedInvites } = useGetReceivedInvites();

  // Filter the sidebar data based on membership status and availableFor field
  const filteredSidebarData = useMemo(() => {
    if (!user) return [];

    return SettingsSidebarData.filter(
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
    ).filter(
      (item) =>
        // If path is AppRoutes.settings.team and receivedInvites is empty, then remove the item
        !(
          item.link === AppRoutes.settings.team &&
          receivedInvites.length === 0 &&
          !user?.organization
        )
    );
  }, [user, receivedInvites]);

  return (
    <div className="flex flex-col justify-center fsm:gap-5 flg:flex-row flg:gap-10">
      <span className="hidden flg:block">
        <SettingsSidebar sidebarData={filteredSidebarData} />
      </span>
      <span className="mt-3 block flg:hidden">
        <SettingsTopBar sidebarData={filteredSidebarData} />
      </span>
      <div className="w-full max-w-[640px] px-3 pt-1.5 fsm:px-5 fmd:px-0">
        {children}
      </div>
    </div>
  );
};
