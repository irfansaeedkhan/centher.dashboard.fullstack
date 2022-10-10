// React, Next, NPM Packages
import React, { useRef } from "react";
import Image from "next/future/image";
import Link from "next/link";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";

import { FiArrowUpRight } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { useCopyToClipboard, useOnClickOutside } from "usehooks-ts";

// App Imports
import useUser from "@/hooks/use.user";
import { axiosNodeApi } from "@/utils/axios";
import { Polygon } from "@/assets/svgs";
import { NODE_API_URL } from "@/constants/common";
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
  const { user } = useUser();
  const [_, copy] = useCopyToClipboard();

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

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const button = e.currentTarget;
    button.disabled = true;

    axiosNodeApi
      .post("/api/auth/logout")
      .then(({ data }) => {
        button.disabled = false;
        toast.success(data.message_description ?? "Logged out successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err: any) => {
        // If user is already logged out, reload the page
        if (err.response?.data?.message === "unauthenticated") {
          setTimeout(() => {
            window.location.reload();
          });
          return;
        }
        button.disabled = false;
        toast.error(
          err.response?.data?.message_description ?? "Something went wrong!"
        );
      });
  };

  return (
    <>
      <div className={polygonButton}>
        <Polygon />
      </div>
      <div ref={ref} className={wrapper}>
        <Image
          src={"/images/dummy-cover-img.jpg"}
          alt="dummy-cover-img.jpg"
          width={308}
          height={96}
          className={polygonImage}
        />
        <div className={profileImageWrapper}>
          <div className={profileImageInner}>
            <button>
              <div>
                {user && (
                  <div className={mainImage}>
                    <Image
                      src={`${NODE_API_URL}${user.profile_image}`}
                      alt="userProfile"
                      width={40}
                      height={40}
                      className={innerImageStyle}
                    />
                  </div>
                )}
              </div>
            </button>
            <div className={accountAddressWrapper}>
              <div className={displayName}>{user?.display_name}</div>
              <div className={accountAddressInner}>
                <p className={textStyle}>
                  {user?.account_address.slice(0, 4) +
                    "..." +
                    user?.account_address.slice(38, 42)}
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
                    process.env.NODE_ENV === "production"
                      ? "https://bscscan.com/address/" + user?.account_address
                      : "https://testnet.bscscan.com/address/" +
                        user?.account_address
                  }
                  target={"_blank"}
                  rel="noreferrer"
                  title="View on BSC Scan"
                >
                  <FiArrowUpRight className={arrowUp} />
                </a>
              </div>
            </div>
          </div>
          <div className={disconnectButton}>
            <button className={disconnectButtonStyle} onClick={handleLogout}>
              Disconnect
            </button>
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
            >
              <a className={myProfileLink}>My Profile</a>
            </Link>
            <Link href={AppRoutes.profile.settings}>
              <a className={profileSettingLink}>Profile Settings</a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderProfile;

const polygonButton = ctl(`absolute top-12`);

const wrapper = ctl(
  `absolute w-77 rounded-lg right-0 z-50 bg-black top-[3.5rem]`
);

const polygonImage = ctl(`rounded-t-lg !h-[96px] object-cover`);

const profileImageWrapper = ctl(`flex flex-col gap-3 text-white`);

const profileImageInner = ctl(`flex gap-2 items-center px-6 py-4`);

const mainImage = ctl(`dpImagePreview relative`);

const innerImageStyle = ctl(`rounded-full`);

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
