// React, Next, NPM Packages
import * as React from "react";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports
import Link from "next/link";
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
  px-6
  gap-8
  py-5
  h-screen
  flex-col
  font-monto
  overflow-y-scroll
  bg-background-shade-1
`);
