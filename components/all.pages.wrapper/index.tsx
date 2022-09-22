// React, Next, NPM Packages
import React from "react";
import Head from "next/head";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";

interface AllPagesWrapperProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const AllPagesWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  return (
    <div className={componentWrapper}>
      <Head>
        <title>{props.pageTitle}</title>
        {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
      </Head>
      <Header />
      <div className="flex">
        <Sidebar />
        {/* 15.5rem is the width of sidebar */}
        <div className={childrenWrapper}>{props.children}</div>
      </div>
    </div>
  );
};

const componentWrapper = ctl(`
  flex 
  flex-col
  font-monto
`);

const childrenWrapper = ctl(`
  p-8 
  w-full 
  bg-black-shade-3 
  overflow-y-scroll
  h-[calc(100vh-60px)] 
  lg:w-[calc(100%-15.5rem)] 
  
  `);
