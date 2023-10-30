import Link from "next/link";
import React from "react";
import { AppRoutes } from "@/constants/app.routes";
import Button from "../button";

const SidebarAuthModal: React.FC = () => {
  return (
    <div
      className={`ml-4 flex h-auto w-[218px] flex-col gap-4 rounded-[32px] bg-black-shade-10 bg-[url('/images/Rectangle.png')] p-6`}
    >
      <div className={`text-xl font-semibold text-white`}>
        Get in to trading
      </div>
      <Link href={AppRoutes.auth.register}>
        <Button
          title={"Register"}
          variant="primary"
          className="h-10 w-full text-[14px]"
          borderRounded="14px"
        />
      </Link>
      <Link href={AppRoutes.auth.login}>
        <Button
          title={"Connect"}
          variant="primary"
          className="h-10 w-full text-[14px]"
          borderRounded="14px"
        />
      </Link>
    </div>
  );
};

export default SidebarAuthModal;
