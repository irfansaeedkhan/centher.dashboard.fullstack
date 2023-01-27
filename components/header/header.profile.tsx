// React, Next, NPM Packages
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiArrowUpRight, FiCopy } from "react-icons/fi";
import { useOnClickOutside } from "usehooks-ts";
import { useWeb3React } from "@web3-react/core";
import clsx from "clsx";

import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import {
  ConnectIcon,
  DisconnectIcon,
  SettingIcon,
  UserIcon,
} from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import useUser from "@/hooks/use.user";
import { copyText } from "@/utils/copy.text";

interface HeaderProfileProps {
  onClickOutside: () => void;
  modalOpenerRef: React.RefObject<HTMLDivElement>;
}

const HeaderProfile: React.FC<HeaderProfileProps> = ({
  onClickOutside,
  modalOpenerRef,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { user: loggedInUser } = useUser();
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
    if (!account || !loggedInUser) {
      return;
    }
    if (loggedInUser.account_address.toLowerCase() !== account.toLowerCase()) {
      deactivate();
    }
  }, [deactivate, loggedInUser, account, connectWallet]);

  return (
    <div
      ref={ref}
      className={`absolute w-300 h-[448px] rounded-lg -right-[62px] fxl:right-0 z-50 bg-black top-[calc(100%+10px)] `}
    >
      <div
        className={clsx(
          `w-full h-20 flex p-4 gap-4 border-b border-gray-shade-border-color`,
          loggedInUser?.pseudonym ? `items-center` : `items-center`
        )}
      >
        {loggedInUser && (
          <Image
            src={loggedInUser.profile_image.path}
            alt={loggedInUser.display_name}
            width={40}
            height={40}
            className={`rounded-full object-cover h-[40px] w-[40px]`}
            sizes={"256px"}
          />
        )}
        <div className={`space-y-1`}>
          <div
            className={`text-ellipsis text-sm text-white font-semibold line-clamp-1`}
          >
            {loggedInUser?.display_name}
          </div>
          <a
            href={
              process.env.NEXT_PUBLIC_APP_ENV === "production"
                ? "https://bscscan.com/address/" + loggedInUser?.account_address
                : "https://goerli.etherscan.io/address/" +
                  loggedInUser?.account_address
            }
            target={"_blank"}
            rel="noreferrer"
            title="View on Explorer"
            className={`flex gap-2 items-center text-white group`}
          >
            <span
              className={`text-xs text-gray-shade-7 group-hover:text-brand-primary`}
            >
              View on{" "}
              {process.env.NEXT_PUBLIC_APP_ENV === "production"
                ? "BSCScan"
                : "EtherScan"}
            </span>
            <FiArrowUpRight
              className={`cursor-pointer text-sm group-hover:text-brand-primary`}
            />
          </a>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-gray-shade-border-color">
        <Link
          href={{
            pathname: AppRoutes.profile.account_address,
            query: {
              account_address: loggedInUser?.account_address,
            },
          }}
          onClick={onClickOutside}
          className="flex py-2.5 items-center gap-[14px] stroke-[#B7BBCC] hover:stroke-brand-primary text-white hover:text-brand-primary"
        >
          <UserIcon />
          <p className="text-sm font-medium ">View my profile</p>
        </Link>
        <Link
          href={AppRoutes.profile.settings}
          onClick={onClickOutside}
          className="flex py-2.5 items-center gap-[14px] stroke-[#B7BBCC] hover:stroke-brand-primary text-white hover:text-brand-primary"
        >
          <SettingIcon />
          <p className="text-sm font-medium ">Settings</p>
        </Link>
      </div>
      <div className="p-4 border-b border-gray-shade-border-color">
        <div className="space-y-[6px]">
          <h6 className="text-xs text-white">Referral Link</h6>
          <div className="flex items-center cursor-pointer">
            <input
              type="text"
              name="referral_link"
              id="referral_link"
              readOnly
              value={
                window.location.origin +
                "/auth/register?referred_by=" +
                loggedInUser?.account_address
              }
              className="w-full !max-w-[260px] text-xs font-medium text-gray-shade-7 rounded-md bg-black-shade-3 py-2 pl-3 whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none border-0 focus:ring-0"
            />
            <FiCopy
              className="stroke-gray-shade-7 hover:stroke-brand-primary ml-2 w-5 h-5"
              onClick={async () => {
                await copyText(
                  window.location.origin +
                    "/auth/register?referred_by=" +
                    loggedInUser?.account_address
                );
                toast.success("Referral link copied!");
              }}
            />
          </div>
        </div>
        <div className="space-y-[6px] mt-4">
          <h6 className="text-xs text-white">Wallet Address</h6>

          <div className="flex items-center cursor-pointer">
            <input
              type="text"
              name="referral_link"
              id="referral_link"
              readOnly
              value={loggedInUser?.account_address}
              className="w-full !max-w-[260px] text-xs font-medium text-gray-shade-7 rounded-md bg-black-shade-3 py-2 pl-3 whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none border-0 focus:ring-0"
            />
            <FiCopy
              className="stroke-gray-shade-7 hover:stroke-brand-primary ml-2 w-5 h-5"
              onClick={async () => {
                await copyText(loggedInUser?.account_address ?? "");
                toast.success("Account address copied!");
              }}
            />
          </div>
        </div>
        <p className="text-[10px] text-gray-shade-7 mt-2">
          Copy your referral link and share it with your friends to generate
          income!
        </p>
      </div>
      <div className="px-5 py-4">
        {active ? (
          <button
            className="flex gap-3 items-center text-red-theme stroke-red-theme"
            onClick={() => {
              disconnectWallet();
            }}
          >
            <DisconnectIcon />
            <p className="text-sm font-medium leading-6">Disconnect Wallet</p>
          </button>
        ) : (
          <button
            className="flex gap-3 items-center text-brand-primary stroke-brand-primary"
            onClick={async () => {
              if (!loggedInUser) return;
              const _account = await connectWallet();
              if (
                loggedInUser.account_address.toLowerCase() !==
                _account?.toLowerCase()
              ) {
                toast.error("Please connect to correct account");
                deactivate();
              }
            }}
          >
            <ConnectIcon />
            <p className="text-sm font-medium leading-6">Connect your Wallet</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderProfile;
