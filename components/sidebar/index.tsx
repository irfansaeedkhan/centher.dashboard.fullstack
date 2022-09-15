// React, Next, NPM Packages
import * as React from "react";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports
import { SectionName } from "./sidebar.data";
import { Section } from "./section";

export const Sidebar = () => {
  return (
    <div className={sideBarWrapper}>
      {SectionName.map((name: any, i: number) => {
        return <Section section={name} key={i} />;
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
  bg-black-shade-6 
  overflow-y-scroll
`);
