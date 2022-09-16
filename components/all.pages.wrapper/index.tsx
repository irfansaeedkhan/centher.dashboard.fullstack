// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";

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
