import ctl from "@netlify/classnames-template-literals";
import React from "react";

interface AuthRightProps {
  children: React.ReactNode;
}

export const AuthRight: React.FC<AuthRightProps> = (props) => {
  return (
    <div className={componentWrapper}>
      <div className={childrenWrapper}>{props.children}</div>
    </div>
  );
};

const componentWrapper = ctl(`
  md:w-1/2 
  sm:w-full 
  max-h-screen
  xl:px-[113px] 
bg-black-shade-3 
  overflow-y-scroll
  flex 
  justify-center 
  md:py-32 
  sm:py-10 
  sm:px-5 
  lg:px-20
`);

const childrenWrapper = ctl(`
  max-w-[496px]
`);
