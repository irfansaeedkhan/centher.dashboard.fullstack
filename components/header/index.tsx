// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useWindowSize } from "usehooks-ts";
import ctl from "@netlify/classnames-template-literals";
import { GoThreeBars } from "react-icons/go";

// App imports
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import Search from "./search";
import { SidebarMobile } from "../sidebar/sidebar.mobile";
import HeaderProfile from "./header.profile";
import Styles from "./header.module.css";

const Header = () => {
  const { width } = useWindowSize();
  const { user, isLoading: isUserLoading } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const modalOpenerRef = React.useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarOpenerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (width > 1024) {
      setSidebarOpen(false);
    }
  }, [width]);

  return (
    <div className={headerWraper}>
      <Link href={AppRoutes.home}>
        <Image
          src="/images/nether.nft.logo.svg"
          alt="Nether NFT Logo"
          width={166}
          height={38}
        />
      </Link>

      <div className={rightWraper}>
        <Search />
        {/* <span className={border}></span> */}
        {!user && !isUserLoading && (
          <Link href={AppRoutes.auth.login} className={connectButton}>
            Connect
          </Link>
        )}
        {user && (
          <>
            <span className="lg:block sm:hidden">
              <Link href={AppRoutes.nfts.create_nft} className={connectButton}>
                Create NFT
              </Link>
            </span>
            <div className="relative">
              <div
                ref={modalOpenerRef}
                onClick={() => setOpenModal((prev) => !prev)}
                role="button"
              >
                <Image
                  src={user.profile_image.path}
                  alt="userProfile"
                  width={40}
                  height={40}
                  className="rounded-full !h-[40px] object-cover"
                  sizes={"256px"}
                />
              </div>

              {openModal && (
                <HeaderProfile
                  onClickOutside={() => setOpenModal(false)}
                  modalOpenerRef={modalOpenerRef}
                />
              )}
            </div>
            <div
              id={Styles.menu}
              ref={sidebarOpenerRef}
              className={
                `lg:hidden sm:flex cursor-pointer ` +
                (sidebarOpen ? Styles.menuHover : "")
              }
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <div
                className={clsx(Styles.barre, sidebarOpen && Styles.menubarre)}
              ></div>
            </div>
          </>
        )}

        <SidebarMobile
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          openerRef={sidebarOpenerRef}
        />
      </div>
    </div>
  );
};

export default Header;

const headerWraper = ctl(`
  flex 
  px-5
  h-[60px]
  relative
  items-center
  justify-between 
  border-b-[1.5px] 
  bg-black-shade-9 
  border-gray-shade-border-color 
`);

const rightWraper = ctl(`
  flex 
  gap-6
  items-center
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

const border = ctl(`
  my-3
  md:block
  sm:hidden
  border-l-2 
  rounded-xl 
  border-gray-shade-12/30
`);
