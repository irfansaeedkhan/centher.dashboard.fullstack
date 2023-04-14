import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiArrowUpRight, FiCopy } from "react-icons/fi";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import { useWeb3React } from "@web3-react/core";
import clsx from "clsx";

import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

import { AppRoutes } from "@/constants/app.routes";
import useUser from "@/hooks/use.user";
import { copyText } from "@/utils/copy.text";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

import {
  ConnectIcon,
  DisconnectIcon,
  SettingIcon,
  UserIcon,
} from "@/assets/svgs";
import { BlockchainConfig } from "@/web3/blockchain/config";

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
  const matches = useMediaQuery("(min-width: 1024px)");

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
  }, [deactivate, loggedInUser, account]);

  const verificationTick = useVerificationTick({ user: loggedInUser });

  return (
    <div
      ref={ref}
      className={`absolute -right-[62px] top-[calc(100%+10px)] z-50 h-[448px] w-300 rounded-lg bg-black fxl:right-0 `}
    >
      <div
        className={clsx(
          `flex h-20 w-full gap-4 border-b border-gray-shade-border-color p-4`,
          loggedInUser?.pseudonym ? `items-center` : `items-center`
        )}
      >
        {loggedInUser && (
          <Image
            src={loggedInUser.profile_image.path}
            alt={loggedInUser.display_name}
            width={40}
            height={40}
            className={`h-[40px] w-[40px] rounded-full object-cover`}
            sizes={"256px"}
          />
        )}
        <div className={`space-y-1`}>
          <div
            className="flex max-w-[215px] items-center  text-sm font-semibold text-white"
            title={loggedInUser?.display_name}
          >
            <span
              className={clsx(` block max-w-full overflow-hidden truncate`)}
            >
              {loggedInUser && sliceDisplayName(loggedInUser?.display_name)}
            </span>
            {!!verificationTick && (
              <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                <Image
                  src={verificationTick}
                  alt={"Verified"}
                  width={20}
                  height={20}
                />
              </span>
            )}
          </div>
          <a
            href={`${BlockchainConfig.scanner.url}/address/${loggedInUser?.account_address}`}
            target={"_blank"}
            rel="noreferrer"
            title="View on Explorer"
            className={`group flex items-center gap-2 text-white`}
          >
            <span
              className={`text-xs text-gray-shade-7 group-hover:text-brand-primary`}
            >
              View on {BlockchainConfig.scanner.name}
            </span>
            <FiArrowUpRight
              className={`cursor-pointer text-sm group-hover:text-brand-primary`}
            />
          </a>
        </div>
      </div>
      <div className="border-b border-gray-shade-border-color px-4 py-3">
        <Link
          href={{
            pathname: AppRoutes.profile.account_address,
            query: {
              account_address: loggedInUser?.account_address,
            },
          }}
          onClick={onClickOutside}
          className="flex items-center gap-[14px] stroke-[#B7BBCC] py-2.5 text-white hover:stroke-brand-primary hover:text-brand-primary"
        >
          <UserIcon />
          <p className="text-sm font-medium ">Profile</p>
        </Link>
        <Link
          href={matches ? AppRoutes.settings.profile : AppRoutes.settings.index}
          onClick={onClickOutside}
          className="flex items-center gap-[14px] stroke-[#B7BBCC] py-2.5 text-white hover:stroke-brand-primary hover:text-brand-primary"
        >
          <SettingIcon />
          <p className="text-sm font-medium ">Settings</p>
        </Link>
      </div>
      <div className="border-b border-gray-shade-border-color p-4">
        <div className="space-y-[6px]">
          <h6 className="text-xs text-white">Referral Link</h6>
          <div className="flex cursor-pointer items-center">
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
              className="w-full rounded-md border-0 bg-black-shade-3 py-2 pl-3 text-xs font-medium text-gray-shade-7 focus:outline-none focus:ring-0"
            />
            <FiCopy
              className="ml-2 h-5 w-5 stroke-gray-shade-7 hover:stroke-brand-primary"
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
        <div className="mt-4 space-y-[6px]">
          <h6 className="text-xs text-white">Account Address</h6>

          <div className="flex cursor-pointer items-center">
            <input
              type="text"
              name="referral_link"
              id="referral_link"
              readOnly
              value={loggedInUser?.account_address}
              className="w-full rounded-md border-0 bg-black-shade-3 py-2 pl-3 text-xs font-medium text-gray-shade-7 focus:outline-none focus:ring-0"
            />
            <FiCopy
              className="ml-2 h-5 w-5 stroke-gray-shade-7 hover:stroke-brand-primary"
              onClick={async () => {
                await copyText(loggedInUser?.account_address ?? "");
                toast.success("Account address copied!");
              }}
            />
          </div>
        </div>
        <p className="mt-2 text-[10px] text-gray-shade-7">
          Copy your referral link and share it with your friends to generate
          income!
        </p>
      </div>
      <div className="px-5 py-4">
        {active ? (
          <button
            className="flex items-center gap-3 stroke-red-theme text-red-theme"
            onClick={() => {
              disconnectWallet();
            }}
          >
            <DisconnectIcon />
            <p className="text-sm font-medium leading-6">Disconnect Wallet</p>
          </button>
        ) : (
          <button
            className="flex items-center gap-3 stroke-brand-primary text-brand-primary"
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
