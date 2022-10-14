// React, Next, NPM Packages
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/future/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";
import { NODE_API_URL } from "@/constants/common";

// Current directory imports
// import Search from "./search";
import HeaderProfile from "./header.profile";

const Header = () => {
  const { user } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const modalOpenerRef = React.useRef<HTMLDivElement>(null);

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
        {/* <div>
          <Search />
        </div> */}
        <span className={border}></span>
        {!user && (
          <Link href={AppRoutes.auth.login}>
            <a className={connectButton}>Connect</a>
          </Link>
        )}
        {user && (
          <>
            <Link href={AppRoutes.auth.login}>
              <a className={connectButton}>Create NFT</a>
            </Link>
            <div className="relative">
              <div
                ref={modalOpenerRef}
                className="dpImagePreview"
                onClick={() => setOpenModal((prev) => !prev)}
                role="button"
              >
                <Image
                  src={`${NODE_API_URL}${user.profile_image}`}
                  alt="userProfile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>

              {openModal && (
                <HeaderProfile
                  onClickOutside={() => setOpenModal(false)}
                  modalOpenerRef={modalOpenerRef}
                />
              )}
            </div>
          </>
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
  my-3
  md:block
  sm:hidden
  border-l-2 
  rounded-xl 
  border-gray-shade-12/30
`);

const connectButton = ctl(`
  px-6 
  py-2
  flex
  text-sm 
  rounded-lg 
  items-center 
  font-semibold 
  bg-brand-primary 
  text-black-shade-2 
  hover:bg-brand-primary-dark 
`);
