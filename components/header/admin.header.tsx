// React, Next, NPM Packages
import React from "react";
import Link from "next/link";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { LogoText, PlusIconBtn } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

export interface AdminHeaderProps {
  title: string;
  url?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = (props) => {
  return (
    <div>
      <div className={headerWraper}>
        <div className={routerLink}>
          <Link
            href={AppRoutes.home}
            className="flex items-center gap-4 md:min-w-[166px] sm:min-w-[22px]"
          >
            <Image
              src="/images/nether.nft.favicon.svg"
              alt="Nether NFT Logo"
              width={166}
              height={38}
              className="!w-[22px] !h-[38px]"
            />
            <span className="md:flex sm:hidden">
              <LogoText />
            </span>
          </Link>
        </div>
        <div className={headerTitleWrapper}>
          <div className={titleParent}>
            <div>
              <p className={titleStyle}>{props.title}</p>
            </div>
          </div>

          {props.url && (
            <Link href={props.url} className={createButton}>
              <PlusIconBtn className={plusButtonStyle} />
              <span>Create New</span>
            </Link>
          )}
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
  border-gray-shade-border-color
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

const headerTitleWrapper = ctl(
  `flex items-center justify-between w-[calc(100%-288px)]`
);

const titleParent = ctl(`flex items-center gap-6`);

const titleStyle = ctl(`text-white font-semibold`);

const plusButtonStyle = ctl(`group-hover:stroke-brand-primary stroke-black`);

const routerLink = ctl(`w-72`);
