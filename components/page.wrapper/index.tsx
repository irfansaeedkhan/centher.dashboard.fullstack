import React from "react";
import Head from "next/head";

interface PageWrapperProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.pageTitle}</title>
      </Head>
      <div className="flex min-h-screen w-full font-monto">
        {props.children}
      </div>
    </>
  );
};
