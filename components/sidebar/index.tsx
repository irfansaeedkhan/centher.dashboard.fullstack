// React, Next, NPM Packages
import * as React from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { Logout } from "@/assets/svgs";

// Current directory imports
import { SidebarSections } from "./sidebar.data";
import { Section } from "./section";

export const Sidebar = () => {
  return (
    <div className={sideBarWrapper}>
      <div className="flex flex-col gap-6">
        {SidebarSections.map((section) => {
          return <Section section={section} key={section.label} />;
        })}
      </div>
      <div className={sectionWrapper}>
        <span className={sectionLabel}>WILL YOU GET OUT?</span>
        <div className={sectionWrapper}>
          <div className={itemWrapper}>
            <Logout />
            <button className={itemLabel}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const sideBarWrapper = ctl(`
  w-72 
  p-5 
  gap-8
  hidden
  lg:flex
  flex-col
  font-monto
  justify-between  
  overflow-y-scroll
  h-[calc(100vh-60px)]
  bg-background-shade-1 
`);

const sectionWrapper = ctl(`
  flex
  gap-6 
  flex-col
`);

const sectionLabel = ctl(`
  font-bold
  text-[11px] 
  text-gray-shade-7 
`);

const itemWrapper = ctl(`
  flex 
  gap-2 
  items-center
`);

const itemLabel = ctl(`
  text-sm
  font-semibold 
  text-gray-shade-8 
`);
