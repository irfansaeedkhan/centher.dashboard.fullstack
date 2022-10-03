// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// Directory Import
import ProfileHeader from "./profile.header";

interface AllPagesWrapperProps {
  children: React.ReactNode;
}

export const ProfilePageWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  return (
    <div className={componentWrapper}>
      <ProfileHeader />
      <div className={childrenWrapper}>{props.children}</div>
    </div>
  );
};

// styling
const componentWrapper = ctl(`
  flex flex-col bg-black-shade-3 w-full gap-6
`);
const childrenWrapper = ctl(`

`);
