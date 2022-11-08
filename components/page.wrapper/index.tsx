import Head from "next/head";
import React from "react";

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
      <div
        className={`
  flex 
  w-full
  font-monto 
  min-h-screen 
`}
      >
        {props.children}
      </div>
    </>
  );
};
