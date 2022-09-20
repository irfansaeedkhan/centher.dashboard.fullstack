// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import Head from "next/head";

interface AllPagesWrapperProps {
  children: React.ReactNode;
  tabTitle: string;
}

export const AllPagesWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  return (
    <div className={componentWrapper}>
      <Head>
        <title>{props.tabTitle.toUpperCase()}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="bg-black-shade-3 lg:w-[calc(100%-18rem)] w-full p-8">
          {props.children}
        </div>
      </div>
    </div>
  );
};

const componentWrapper = ctl(`
  flex 
  flex-col
  font-monto
`);
