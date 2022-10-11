// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// Directory Import
import ProfileHeader from "./profile.header";

interface AllPagesWrapperProps {
  children: React.ReactNode;
  setFollowUser?: (arg0: boolean) => void;
}

export const ProfilePageWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  return (
    <div className={componentWrapper}>
      <ProfileHeader setFollowUser={props.setFollowUser} />
      <div className={childrenWrapper}>{props.children}</div>
    </div>
  );
};

// styling
const componentWrapper = ctl(`
  flex flex-col bg-black-shade-3 w-full max-w-[1236px] mx-auto gap-6
`);
const childrenWrapper = ctl(`

`);
