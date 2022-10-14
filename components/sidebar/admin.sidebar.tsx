// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports
import { AdminSidebarSections } from "./admin.sidebar.data";
import { Section } from "./section";

export const AdminSidebar = () => {
  return (
    <div className={sideBarWrapper}>
      {AdminSidebarSections.map((section) => {
        return <Section section={section} key={section.label} />;
      })}
    </div>
  );
};

const sideBarWrapper = ctl(`
  w-72
  flex
  p-5
  gap-8
  h-screen
  flex-col
  font-monto
  overflow-y-scroll
  bg-background-shade-1
`);
