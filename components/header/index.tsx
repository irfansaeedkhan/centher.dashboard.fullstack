// React, Next, NPM Packages
import React from "react";
import Link from "next/link";
import Image from "next/future/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import Search from "./search";

const Header = () => {
  const { user, isError, isLoading } = useUser();

  return (
    <div className={headerWraper}>
      <Link href={"/"}>
        <a>
          <Image
            src="/images/nether.nft.logo.svg"
            alt="Nether NFT Logo"
            width={166}
            height={38}
          />
        </a>
      </Link>
      <div className={rightWraper}>
        <div>
          <Search />
        </div>
        <span className={border}></span>
        {!user ? (
          <Link href={AppRoutes.auth.login}>
            <a className={connectButoon}>Login</a>
          </Link>
        ) : (
          <Link
            href={{
              pathname: AppRoutes.profile.username,
              query: { username: user.username },
            }}
          >
            <a className={connectButoon}>{user.username}</a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;

const headerWraper = ctl(`
  flex 
  px-8
  h-[60px]
  items-center
  justify-between 
  border-b-[1.5px] 
  bg-black-shade-9 
  border-gray-shade-border-color 
`);

const rightWraper = ctl(`
  flex 
  gap-10
`);

const border = ctl(`
  md:block
  sm:hidden
  border-l-2 
  rounded-xl 
  border-gray-shade-12/30
  my-3
`);

const connectButoon = ctl(`
  px-6 
  py-2
  flex
  items-center 
  text-sm 
  rounded-lg 
  font-semibold 
  bg-brand-primary 
  text-black-shade-2 
  hover:bg-gray-shade-3 
  hover:text-brand-primary 
`);
