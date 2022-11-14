import React, { useEffect } from "react";
import Head from "next/head";

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
    <div className="font-monto">
      <Head>
        <title>{props.pageTitle}</title>
      </Head>

      <Header />

      <div className={`px-2 fxl:ml-[15.5rem] fsm:px-4 fmd:px-6 py-4 flg:py-6`}>
        {props.children}
      </div>

      <div className="hidden fxl:block w-[15.5rem] fixed top-[60px] bottom-0 left-0">
        <Sidebar />
      </div>
    </div>
  );
};
