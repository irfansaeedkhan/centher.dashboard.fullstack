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
    <div className={`flex flex-col font-monto`}>
      <Head>
        <title>{props.pageTitle}</title>
      </Head>
      <Header />
      <div className={`flex`}>
        <Sidebar />
        <div
          className={`px-2 sm-1:px-4 md:px-6 py-4 lg:py-6 bg-black-shade-3 overflow-y-scroll h-[calc(100vh-60px)] flex-grow scrollSet`}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};
