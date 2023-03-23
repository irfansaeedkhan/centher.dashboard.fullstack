// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useWindowSize } from "usehooks-ts";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { AppRoutes } from "@/constants/app.routes";
import { MenuClose } from "@/assets/svgs";

import { SidebarMobile } from "../sidebar/sidebar.mobile";
import HeaderProfile from "./header.profile";
import SearchBar from "./search";

const Header = () => {
  const { width } = useWindowSize();
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const { user: ver_user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  const { connectWallet, disconnectWallet, getConnectedAccount } =
    useConnectWallet();
  const [openModal, setOpenModal] = useState(false);
  const modalOpenerRef = React.useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarOpenerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (width > 1280) {
      setSidebarOpen(false);
    }
  }, [width]);

  // For auto-connecting wallet on page load if user is logged in
  useEffect(() => {
    if (!user) {
      return;
    }
    // Get connected account
    const connectedAccount = getConnectedAccount();
    connectedAccount
      .then((_acc) => {
        if (_acc && _acc.toLowerCase() === user.account_address.toLowerCase()) {
          connectWallet(false);
        }
      })
      .catch(() => {});
  }, [user, connectWallet, disconnectWallet, getConnectedAccount]);

  return (
    <div
      className={`fixed top-0 z-[1000] flex h-[60px] w-full items-center justify-between gap-10 border-b-[1.5px] border-gray-shade-border-color bg-black-shade-9 px-5`}
    >
      <Link
        href={AppRoutes.home}
        className="flex items-center gap-4 sm:min-w-[22px] md:min-w-[166px]"
      >
        <Image
          src="/images/centher.logo.png"
          alt="Centher Logo"
          width={154}
          height={32}
          className="hidden md:block"
        />
        <Image
          src="/images/centher.logo.favicon.png"
          alt="Centher Logo"
          width={32}
          height={32}
          className="block md:hidden"
        />
      </Link>

      <div className={`flex flex-grow items-center justify-end gap-6`}>
        {/* {user && <SearchBar ver_user={ver_user} />} */}
        {user && ver_user ? (
          <SearchBar ver_user={ver_user} />
        ) : (
          user && <SearchBar ver_user={user} />
        )}
        {!user && !isUserLoading && (
          <Link href={AppRoutes.auth.login} className={connectButton}>
            Connect
          </Link>
        )}

        {user && (
          <>
            <div className="relative">
              <div
                ref={modalOpenerRef}
                onClick={() => setOpenModal((prev) => !prev)}
                role="button"
                className="h-10 w-10 rounded-full"
              >
                <Image
                  src={user.profile_image.path}
                  alt="userProfile"
                  width={40}
                  height={40}
                  className="!h-[40px] !w-[40px] rounded-full object-cover"
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
              className={`flex cursor-pointer fxl:hidden`}
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
