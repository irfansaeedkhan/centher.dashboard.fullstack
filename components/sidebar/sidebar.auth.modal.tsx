// React, Next, NPM Packages
import Link from "next/link";
import React from "react";

// App imports
import { AppRoutes } from "@/constants/app.routes";

const SidebarAuthModal: React.FC = () => {
  return (
    <div
      className={`w-[218px] min-h-[200px] rounded-[32px] bg-black-shade-10 mx-4 bg-[url('/images/Rectangle.png')] p-6 flex flex-col gap-4`}
    >
      <div className={`text-white font-semibold text-2xl`}>
        Get in to trading
      </div>
      <Link
        href={AppRoutes.auth.register}
        className={`text-black-shade-7 w-full py-1 bg-brand-primary hover:bg-brand-primary-dark font-semibold rounded-[10px] text-center`}
      >
        Register
      </Link>
      <Link
        href={AppRoutes.auth.login}
        className={`text-gray-shade-7 w-full py-1 bg-black-shade-3 font-semibold rounded-[10px] text-center`}
      >
        Connect
      </Link>
    </div>
  );
};

export default SidebarAuthModal;
