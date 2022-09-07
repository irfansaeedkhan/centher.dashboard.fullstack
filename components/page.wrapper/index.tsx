import ctl from "@netlify/classnames-template-literals";
import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = (props) => {
  return <div className={pageWraper}>{props.children}</div>;
};

const pageWraper = ctl(`
  flex 
  w-full
  font-monto 
  min-h-screen 
`);
