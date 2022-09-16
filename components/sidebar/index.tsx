// React, Next, NPM Packages
import * as React from "react";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports
import { SidebarSections } from "./sidebar.data";
import { Section } from "./section";

export const Sidebar = () => {
  return (
    <div className={sideBarWrapper}>
      {SidebarSections.map((section) => {
        return <Section section={section} key={section.label} />;
      })}
    </div>
  );
};

const sideBarWrapper = ctl(`
  w-72
  flex
  px-8 
  gap-8  
  py-10 
  h-screen 
  flex-col
  font-monto
  overflow-y-scroll
  bg-background-shade-1 
`);
