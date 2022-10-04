// React, Next, NPM Packages
import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/future/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";
import { NODE_API_URL } from "@/constants/common";

// Current directory imports
import Search from "./search";
import HeaderProfile from "./header.profile";

const Header = () => {
  const { user } = useUser();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className={headerWraper}>
      <Link href={AppRoutes.home}>
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
            <a className={connectButoon}>Connect</a>
          </Link>
        ) : (
          <Link
            href={{
              pathname: AppRoutes.profile.account_address,
              query: { account_address: user.account_address },
            }}
          >
            <a className={connectButoon}>{user.display_name}</a>
          </Link>
        )}
        {user && (
          <div
            className="dpImagePreview cursor-pointer relative"
            onClick={() => setOpenModal(true)}
          >
            <Image
              src={`${NODE_API_URL}${user.profile_image}`}
              alt="userProfile"
              width={40}
              height={40}
              className="rounded-full"
            />
            {openModal && (
              <HeaderProfile onClickOutside={() => setOpenModal(false)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

const headerWraper = ctl(`
  flex 
  px-5
  h-[60px]
  items-center
  justify-between 
  border-b-[1.5px] 
  bg-black-shade-9 
  border-gray-shade-border-color 
`);

const rightWraper = ctl(`
  flex 
  gap-6
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
