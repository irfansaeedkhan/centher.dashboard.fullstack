// React, Next, NPM Packages
import React from "react";
import Link from "next/link";
import Image from "next/future/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { PlusIconBtn } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

const AdminHeader = () => {
  return (
    <div>
      <div className={headerWraper}>
        <div className="w-72">
          <Link href={AppRoutes.home}>
            <a>
              <Image
                src="/images/MainLogo.svg"
                alt="logo"
                width={166}
                height={38}
              />
            </a>
          </Link>
        </div>
        <div className="flex items-center justify-between w-[calc(100%-288px)]">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-white font-semibold">Staking Pack</p>
            </div>
          </div>

          <div className={createButton}>
            <PlusIconBtn className="group-hover:stroke-white stroke-black " />
            <span>Create New</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminHeader;

const headerWraper = ctl(`
  flex
  px-5
  w-full
  h-[60px]
  items-center
  border-b-[1.5px]
  bg-background-shade-1
  border-gray-border-color
`);

const createButton = ctl(`
  px-3 
  py-2 
  text-sm 
  rounded-lg 
  font-semibold 
  bg-brand-primary 
  text-black-shade-2 
  hover:bg-gray-shade-3 
  hover:text-brand-primary
  group
  flex
  gap-2
  items-center 
  cursor-pointer
`);
