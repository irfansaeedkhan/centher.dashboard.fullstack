import React, { useEffect } from "react";
import Head from "next/head";
import clsx from "clsx";
import { useCountsStore } from "@/store/counts.store";
import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import useUser from "@/hooks/use.user";

interface ChatPagesWrapperProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const ChatPagesWrapper: React.FC<ChatPagesWrapperProps> = (props) => {
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
          `mt-[60px]`,
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
          <div className="fixed bottom-0 left-0 top-[60px] hidden w-[15.5rem] fxl:block">
            <Sidebar />
          </div>
        )
      ) : (
        <div className="fixed bottom-0 left-0 top-[60px] hidden w-[15.5rem] fxl:block">
          <Sidebar />
        </div>
      )}
    </div>
  );
};
