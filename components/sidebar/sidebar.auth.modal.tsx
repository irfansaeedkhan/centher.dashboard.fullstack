// React, Next, NPM Packages
import Link from "next/link";
import React from "react";

// App imports
import { AppRoutes } from "@/constants/app.routes";
import ctl from "@netlify/classnames-template-literals";

const SidebarAuthModal: React.FC = () => {
  return (
    <div className={modalWrapper}>
      <div className={title}>Get in to trading</div>
      <Link href={AppRoutes.auth.register}>
        <a className={registerButton}>Register</a>
      </Link>
      <Link href={AppRoutes.auth.login}>
        <a className={connectButton}>Connect</a>
      </Link>
    </div>
  );
};

export default SidebarAuthModal;

const modalWrapper = ctl(
  `w-[218px] min-h-[200px] rounded-[32px] bg-black-shade-10 mx-4 bg-[url('/images/Rectangle.png')] p-6 flex flex-col gap-4`
);

const title = ctl(`text-white font-semibold text-2xl`);

const registerButton = ctl(
  `text-black-shade-7 w-full py-1 bg-brand-primary hover:bg-brand-primary-dark font-semibold rounded-[10px] text-center`
);

const connectButton = ctl(
  `text-gray-shade-7 w-full py-1 bg-black-shade-3 font-semibold rounded-[10px] text-center`
);
