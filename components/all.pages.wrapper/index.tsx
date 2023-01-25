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
          `px-2 fsm:px-4 fmd:px-6 py-4 flg:py-6 mt-[60px]`,
          (props.pageTitle !== "Coming Soon" || loggedInUser) &&
            (props.pageTitle !== "404 Not Found" || loggedInUser) &&
            "fxl:ml-[15.5rem]"
        )}
      >
        {props.children}
      </div>
      {props.pageTitle === "Coming Soon" ||
      props.pageTitle === "404 Not Found" ? (
        loggedInUser && (
          <div className="hidden fxl:block w-[15.5rem] fixed top-[60px] bottom-0 left-0">
            <Sidebar />
          </div>
        )
      ) : (
        <div className="hidden fxl:block w-[15.5rem] fixed top-[60px] bottom-0 left-0">
          <Sidebar />
        </div>
      )}
    </div>
  );
};
