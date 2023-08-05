import React, { useEffect } from "react";
import Head from "next/head";

import { useCountsStore } from "@/store/counts.store";
import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import useUser from "@/hooks/use.user";
import clsx from "clsx";

interface AllPagesWrapperProps {
  children: React.ReactNode;
  pageTitle?: string;
  showSidebar?: boolean;
}

export const AllPagesWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  const fetchCounts = useCountsStore((state) => state.fetchCounts);
  const { user: loggedInUser } = useUser();

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <div className="font-monto">
      <Head>
        <title>{props.pageTitle}</title>
      </Head>

      <Header />

      <div
        className={clsx(
          `mt-[60px] px-2 py-4 fsm:px-4 fmd:px-6 flg:py-6`,
          (props.pageTitle !== "Coming Soon" || loggedInUser) &&
            (props.pageTitle !== "404 Not Found" || loggedInUser) &&
            props.showSidebar !== false &&
            "fxl:ml-[15.5rem]"
        )}
      >
        {props.children}
      </div>
      {props.pageTitle === "Coming Soon" ||
      props.pageTitle === "404 Not Found" ? (
        loggedInUser && (
          <div className="fixed bottom-0 left-0 top-[60px] hidden w-[15.5rem] fxl:block">
            <Sidebar />
          </div>
        )
      ) : props.showSidebar === false ? null : (
        <div className="fixed bottom-0 left-0 top-[60px] hidden w-[15.5rem] fxl:block">
          <Sidebar />
        </div>
      )}
    </div>
  );
};
