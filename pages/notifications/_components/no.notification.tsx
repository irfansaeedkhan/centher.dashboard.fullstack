import React from "react";
import { NotificationIcon } from "@/assets/svgs";

export const NoNotification: React.FC = () => {
  return (
    <div className="flex h-[500px] flex-col items-center justify-center gap-3">
      <div className="flex h-[94px] w-[94px] items-center justify-center rounded-full bg-[#222531]">
        <NotificationIcon />
      </div>
      <div className="textGradient text-center text-2xl font-bold">
        There is no Notifications yet!
      </div>
    </div>
  );
};
