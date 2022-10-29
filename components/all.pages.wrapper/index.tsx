// React, Next, NPM Packages
import React, { useEffect } from "react";
import Head from "next/head";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { useCountsStore } from "@/store/counts.store";
import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";

interface AllPagesWrapperProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const AllPagesWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  const fetchCounts = useCountsStore((state) => state.fetchCounts);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <div className={componentWrapper}>
      <Head>
        <title>{props.pageTitle}</title>
      </Head>
      <Header />
      <div className={parentWrapper}>
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
  md:px-8
  py-8
  sm:px-2
  w-full 
  bg-black-shade-3 
  overflow-y-scroll
  h-[calc(100vh-60px)] 
  lg:w-[calc(100%-15.5rem)] 
  scrollSet
  `);

const parentWrapper = ctl(`flex`);
