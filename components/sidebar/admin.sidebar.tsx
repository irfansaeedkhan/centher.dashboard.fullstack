import React from "react";
import useUser from "@/hooks/use.user";
import { AdminSidebarSections } from "./admin.sidebar.data";
import { Section } from "./section";

export const AdminSidebar = () => {
  const { user } = useUser();

  return (
    <div className="flex h-screen w-72 flex-col gap-8 overflow-y-scroll bg-background-shade-1 p-5 font-monto">
      {AdminSidebarSections.map((section) => {
        return <Section user={user} section={section} key={section.label} />;
      })}
    </div>
  );
};
