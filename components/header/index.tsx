import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWindowSize } from "usehooks-ts";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";
import { MenuClose } from "@/assets/svgs";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import { SidebarMobile } from "../sidebar/sidebar.mobile";
import Button from "../button";
import HeaderProfile from "./header.profile";
import SearchBar from "./search";
import { useWallet } from "@/web3/hooks/use.wallet";
import ConnectWalletModal from "../modal/connect-wallet-modal";

const Header = () => {
  const { width } = useWindowSize();
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);
  const { user, isLoading: isUserLoading } = useUser();
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const { connectedAddress, connectWallet } = useWallet();
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

    if (
      connectedAddress &&
      connectedAddress.toLowerCase() === user._id.toLowerCase()
    ) {
      connectWallet();
    }
  }, [user, connectWallet, connectedAddress]);

  const openBuyCitizenshipModal = () => {
    setShowBuyCitizenshipModal(true);
  };

  return (
    <div
      className={`fixed top-0 z-[1000] flex h-[60px] w-full items-center justify-between gap-10 border-b-[1.5px] border-gray-shade-border-color bg-black-shade-9 px-5`}
    >
      <Link
        href={AppRoutes.home}
        className="flex items-center justify-start gap-4"
      >
        <Image
          src="/images/logo.png"
          alt="369x Logo"
          width={75}
          height={39}
          className="w-18"
        />
      </Link>

      <div className={`flex flex-grow items-center justify-end gap-6`}>
        {user && <SearchBar />}
        {!user && !isUserLoading && (
          <Link href={AppRoutes.auth.login}>
            <Button
              title={"Connect"}
              variant="primary"
              className="h-9 w-[98px] text-[14px]"
              borderRounded="14px"
            />
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
                  src={user.profile_image}
                  alt="userProfile"
                  width={40}
                  height={40}
                  className="!h-[40px] !w-[40px] rounded-full object-cover"
                  sizes={"256px"}
                />
              </div>

              {openModal && (
                <HeaderProfile
                  onOpen={() => setConnectWalletModal(true)}
                  onClickOutside={() => setOpenModal(false)}
                  modalOpenerRef={modalOpenerRef}
                  openBuyCitizenshipModal={openBuyCitizenshipModal}
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
      {showBuyCitizenshipModal && (
        <BuyCitizenshipModal
          isOpen={showBuyCitizenshipModal}
          onClickClose={() => setShowBuyCitizenshipModal(false)}
        />
      )}
      <ConnectWalletModal
        open={connectWalletModal}
        authType="login"
        connectWallet={connectWallet}
        onClose={() => setConnectWalletModal(false)}
      />
    </div>
  );
};

export default Header;
