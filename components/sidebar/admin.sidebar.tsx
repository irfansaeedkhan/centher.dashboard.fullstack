// React, Next, NPM Packages
import * as React from "react";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports
import Link from "next/link";
import { AdminSideBarData } from "./admin.sidebar.data";
import Image from "next/image";

export const AdminSidebar = () => {
  return (
    <div className={sideBarWrapper}>
      <Link href={"/"}>
        <a>
          <Image
            src="/images/MainLogo.svg"
            alt="logo"
            width={"240px"}
            height={"56px"}
          />
        </a>
      </Link>
      <div className={sectionWrapper}>
        {AdminSideBarData.map((item) => {
          return (
            <div className={itemWrapper} key={item.name}>
              <Link href={item.link}>
                <a className={itemLabel}>{item.name}</a>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const sideBarWrapper = ctl(`
  w-72
  flex
  px-8 
  gap-8  
  py-10 
  h-screen 
  flex-col
  font-monto
  overflow-y-scroll
  bg-background-shade-1 
`);

const sectionWrapper = ctl(`
  flex
  gap-6 
  flex-col
`);

const itemWrapper = ctl(`
  flex 
  gap-2 
  items-center
`);

const itemLabel = ctl(`
  text-sm
  font-semibold 
  text-gray-shade-8 
`);
