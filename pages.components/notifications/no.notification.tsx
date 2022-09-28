import { NotificationIcon } from "@/assets/svgs";
import ctl from "@netlify/classnames-template-literals";
import React from "react";

export const NoNotification: React.FC = () => {
  return (
    <div className={pageWrapper}>
      <div className={iconWrapper}>
        <NotificationIcon />
      </div>
      <div className={text}>There is no Notifications yet!</div>
    </div>
  );
};

const pageWrapper = ctl(
  `flex flex-col items-center gap-3 justify-center h-[500px]`
);

const iconWrapper = ctl(
  `w-[94px] h-[94px] rounded-full bg-[#222531] flex justify-center items-center`
);

const text = ctl(`text-yellow-theme font-bold text-2xl text-center`);
