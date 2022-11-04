// React, Next, NPM Packages
import React, { useEffect } from "react";
import Head from "next/head";

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
    <div
      className={`
  flex 
  flex-col
  font-monto
`}
    >
      <Head>
        <title>{props.pageTitle}</title>
      </Head>
      <Header />
      <div className={`flex`}>
        <Sidebar />
        {/* 15.5rem is the width of sidebar */}
        <div
          className={`
  md:px-8
  py-8
  sm:px-2
  w-full 
  bg-black-shade-3 
  overflow-y-scroll
  h-[calc(100vh-60px)] 
  lg:w-[calc(100%-15.5rem)] 
  scrollSet
  `}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};
