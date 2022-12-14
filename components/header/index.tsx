// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWindowSize } from "usehooks-ts";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";
import { MenuClose } from "@/assets/svgs";

import { SidebarMobile } from "../sidebar/sidebar.mobile";
import HeaderProfile from "./header.profile";
import SearchBar from "./search";

const Header = () => {
  const { width } = useWindowSize();
  const { user, isLoading: isUserLoading } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const modalOpenerRef = React.useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarOpenerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (width > 1280) {
      setSidebarOpen(false);
    }
  }, [width]);

  return (
    <div
      className={`flex gap-10 px-5 h-[60px] fixed w-full top-0 z-[1000] items-center justify-between border-b-[1.5px] bg-black-shade-9 border-gray-shade-border-color`}
    >
      <Link
        href={AppRoutes.home}
        className="flex items-center gap-4 md:min-w-[166px] sm:min-w-[22px]"
      >
        <Image
          src="/images/nether.nft.logo.svg"
          alt="Nether NFT Logo"
          width={154}
          height={32}
          className="md:block hidden"
        />
        <Image
          src="/images/nether.nft.favicon.svg"
          alt="Nether NFT Logo"
          width={32}
          height={32}
          className="md:hidden block"
        />
      </Link>

      <div className={`flex flex-grow gap-6 items-center justify-end`}>
        <SearchBar />

        {!user && !isUserLoading && (
          <Link href={AppRoutes.auth.login} className={connectButton}>
            Connect
          </Link>
        )}

        {user && (
          <>
            <div className="hidden fxl:block">
              <Link
                href={AppRoutes.marketplace.create_nft}
                className={connectButton}
              >
                Create NFT
              </Link>
            </div>
            <div className="relative">
              <div
                ref={modalOpenerRef}
                onClick={() => setOpenModal((prev) => !prev)}
                role="button"
                className="w-10 h-10 rounded-full"
              >
                <Image
                  src={user.profile_image.path}
                  alt="userProfile"
                  width={40}
                  height={40}
                  className="rounded-full !h-[40px] !w-[40px] object-cover"
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
              ref={sidebarOpenerRef}
              className={`flex fxl:hidden cursor-pointer`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <MenuClose className="text-2xl text-white" />
              ) : (
                <HiOutlineMenuAlt3 className="text-2xl text-white" />
              )}
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

const connectButton = `w-max px-6 py-2 flex text-sm rounded-lg items-center font-semibold bg-brand-primary text-black-shade-2 hover:bg-brand-primary-dark`;
