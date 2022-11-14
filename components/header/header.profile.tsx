// React, Next, NPM Packages
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";
import { FiArrowUpRight } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { useCopyToClipboard, useOnClickOutside } from "usehooks-ts";
import { useWeb3React } from "@web3-react/core";

// App Imports
import useUser from "@/hooks/use.user";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { Polygon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

interface HeaderProfileProps {
  onClickOutside: () => void;
  modalOpenerRef: React.RefObject<HTMLDivElement>;
}

const HeaderProfile: React.FC<HeaderProfileProps> = ({
  onClickOutside,
  modalOpenerRef,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useUser();
  const [_, copy] = useCopyToClipboard();
  const { connectWallet, disconnectWallet } = useConnectWallet();
  const { active, account, deactivate } = useWeb3React();

  const handleClickOutside = (e: MouseEvent) => {
    if (
      modalOpenerRef.current &&
      modalOpenerRef.current.contains(e.target as Node)
    ) {
      return;
    }
    onClickOutside();
  };

  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    if (!account || !user) {
      return;
    }
    if (user.account_address.toLowerCase() !== account.toLowerCase()) {
      toast.error("Please connect to correct account");
      deactivate();
    }
  }, [account, deactivate, user]);

  return (
    <>
      <div className={polygonButton}>
        <Polygon />
      </div>
      <div
        ref={ref}
        className={`absolute w-77 rounded-lg -right-[62px] fxl:right-0 z-50 bg-black top-[3.5rem]`}
      >
        <Image
          src={"/images/profile-header-cover.jpg"}
          alt="cover"
          width={308}
          height={96}
          className={polygonImage}
        />
        <div className={profileImageWrapper}>
          <div className={profileImageInner}>
            <button>
              <div>
                {user && (
                  <div>
                    <Image
                      src={user.profile_image.path}
                      alt="userProfile"
                      width={40}
                      height={40}
                      className={innerImageStyle}
                      sizes={"256px"}
                    />
                  </div>
                )}
              </div>
            </button>
            <div className={accountAddressWrapper}>
              <div className={displayName}>{user?.display_name}</div>
              <div className={accountAddressInner}>
                <p className={textStyle}>
                  {sliceAccountAddress(user?.account_address ?? "")}
                </p>
                <MdContentCopy
                  className={copyButton}
                  onClick={() => {
                    copy(user?.account_address ?? "");
                    toast.success("Account Address Copied!");
                  }}
                />
                <a
                  href={
                    process.env.NEXT_PUBLIC_APP_ENV === "production"
                      ? "https://bscscan.com/address/" + user?.account_address
                      : "https://goerli.etherscan.io/address/" +
                        user?.account_address
                  }
                  target={"_blank"}
                  rel="noreferrer"
                  title="View on Explorer"
                >
                  <FiArrowUpRight className={arrowUp} />
                </a>
              </div>
            </div>
          </div>
          <div className={disconnectButton}>
            {active ? (
              <button
                className={disconnectButtonStyle}
                onClick={() => {
                  disconnectWallet();
                }}
              >
                Disconnect
              </button>
            ) : (
              <button
                className={connectButton}
                onClick={async () => {
                  await connectWallet();
                }}
              >
                Connect
              </button>
            )}
          </div>
          <hr className={userProfile} />
          <div className={userLink}>
            <Link
              href={{
                pathname: AppRoutes.profile.account_address,
                query: {
                  account_address: user?.account_address,
                },
              }}
              className={myProfileLink}
              onClick={onClickOutside}
            >
              My Profile
            </Link>
            <Link
              href={AppRoutes.profile.settings}
              className={profileSettingLink}
              onClick={onClickOutside}
            >
              Profile Settings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderProfile;

const polygonButton = ctl(`absolute top-12`);

const wrapper = ctl(``);

const polygonImage = ctl(`rounded-t-lg !h-[96px] object-cover`);

const profileImageWrapper = ctl(`flex flex-col gap-3 text-white`);

const profileImageInner = ctl(`flex gap-2 items-center px-6 py-4`);

const innerImageStyle = ctl(`rounded-full object-cover h-[40px] w-[40px]`);

const accountAddressWrapper = ctl(`flex flex-col gap-1`);

const displayName = ctl(
  `whitespace-nowrap overflow-hidden text-ellipsis text-sm text-white`
);

const accountAddressInner = ctl(`flex gap-2 items-center`);

const textStyle = ctl(`text-sm`);

const copyButton = ctl(
  `cursor-pointer text-sm text-white hover:text-brand-primary`
);

const arrowUp = ctl(`cursor-pointer text-sm hover:text-brand-primary`);

const disconnectButton = ctl(`w-full flex justify-end items-end px-6 py-4`);

const disconnectButtonStyle = ctl(
  `rounded-lg bg-gray-shade-3 text-gray-shade-7 w-full text-sm hover:bg-yellow-theme hover:text-black font-semibold p-3`
);

const userProfile = ctl(`border-gray-shade-border-color`);

const userLink = ctl(`flex flex-col gap-3 px-6 pt-3 pb-4`);

const myProfileLink = ctl(
  `whitespace-nowrap overflow-hidden text-ellipsis text-sm text-white hover:text-brand-primary`
);

const profileSettingLink = ctl(
  `whitespace-nowrap overflow-hidden text-ellipsis text-sm text-white hover:text-brand-primary`
);

const connectButton = ctl(` 
  p-3 
  flex
  gap-2
  w-full 
  text-sm
  font-bold 
  rounded-lg 
  items-center 
  transition-all 
  justify-center 
  bg-brand-primary 
  text-gray-shade-5 
  hover:bg-brand-primary-dark
`);
