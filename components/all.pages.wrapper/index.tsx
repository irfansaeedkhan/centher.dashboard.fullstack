// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports
import Header from "../header";
import { Sidebar } from "../sidebar";

interface AllPagesWrapperProps {
  children: React.ReactNode;
}

export const AllPagesWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  return (
    <div className={componentWrapper}>
      <Header />
      <div className="flex">
        <Sidebar />
        {props.children}
      </div>
    </div>
  );
};

const componentWrapper = ctl(`
  flex 
  flex-col
`);
