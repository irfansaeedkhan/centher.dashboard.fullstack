import Link from "next/link";
import React from "react";

import { AppRoutes } from "@/constants/app.routes";

const SidebarAuthModal: React.FC = () => {
  return (
    <div
      className={`ml-4 flex min-h-[200px] w-[218px] flex-col gap-4 rounded-[32px] bg-black-shade-10 bg-[url('/images/Rectangle.png')] p-6`}
    >
      <div className={`text-2xl font-semibold text-white`}>
        Get in to trading
      </div>
      <Link
        href={AppRoutes.auth.register}
        className={`w-full rounded-[10px] bg-brand-primary py-1 text-center font-semibold text-black-shade-7 hover:bg-brand-primary-dark`}
      >
        Register
      </Link>
      <Link
        href={AppRoutes.auth.login}
        className={`w-full rounded-[10px] bg-black-shade-3 py-1 text-center font-semibold text-gray-shade-7`}
      >
        Connect
      </Link>
    </div>
  );
};

export default SidebarAuthModal;
