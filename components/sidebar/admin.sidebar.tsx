import React from "react";

import useUser from "@/hooks/use.user";

import { AdminSidebarSections } from "./admin.sidebar.data";
import { Section } from "./section";

export const AdminSidebar = () => {
  const { user } = useUser();

  return (
    <div
      className={`
  w-72
  flex
  p-5
  gap-8
  h-screen
  flex-col
  font-monto
  overflow-y-scroll
  bg-background-shade-1
`}
    >
      {AdminSidebarSections.map((section) => {
        return <Section user={user} section={section} key={section.label} />;
      })}
    </div>
  );
};
