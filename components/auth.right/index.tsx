import ctl from "@netlify/classnames-template-literals";
import React from "react";

interface AuthRightProps {
  children: React.ReactNode;
}

export const AuthRight: React.FC<AuthRightProps> = (props) => {
  return <div className={componentWrapper}>{props.children}</div>;
};

const componentWrapper = ctl(`
  flex 
  gap-5 
  sm:px-5 
  md:py-32 
  sm:py-10 
  lg:px-20 
  flex-col 
  md:w-1/2 
  sm:w-full
  xl:px-[113px] 
  bg-black-shade-3 
`);
