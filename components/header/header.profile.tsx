import React, { useRef, useEffect, useCallback, useState } from "react";
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
  PopupBellIcon,
  PopupFeedIcon,
  PopupMessageIcon,
  PopupSettingIcon,
  PopupUserIcon,
} from "@/assets/svgs";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { useCentherLive } from "@/hooks/chat";

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
  const { unreadNotifications } = useCentherLive();
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
    if (loggedInUser._id.toLowerCase() !== account.toLowerCase()) {
      deactivate();
    }
  }, [deactivate, loggedInUser, account]);

  const verificationTick = useVerificationTick({ user: loggedInUser });

  return (
    <div
      ref={ref}
      className={`absolute -right-[62px] top-[calc(100%+20px)] z-50 h-auto w-300 overflow-y-auto overflow-x-hidden rounded-2xl bg-black-shade-8 fxl:right-0 custom-height-oriented:h-[480px] [@media(max-height:420px)]:h-[280px]`}
    >
      <div
        className={clsx(
          `flex h-20 w-full gap-4 border-b border-gray-shade-border-color p-4`,
          loggedInUser?.pseudonym ? `items-center` : `items-center`
        )}
      >
        {loggedInUser && (
          <Image
            src={loggedInUser.profile_image}
            alt={loggedInUser.display_name}
            width={40}
            height={40}
            className={`h-[40px] w-[40px] rounded-full object-cover`}
            sizes={"256px"}
          />
        )}
        <div className={`space-y-1`}>
          <div
            className="flex max-w-[215px] items-center  text-sm font-semibold text-white fsm:text-base"
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
            href={`${BlockchainConfig.scanner.url}/address/${loggedInUser?._id}`}
            target={"_blank"}
            rel="noreferrer"
            title="View on Explorer"
            className={`group flex items-center gap-1 text-white`}
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
      <div className="border-b border-gray-shade-border-color py-3">
        <Link
          href={{
            pathname: AppRoutes.profile.user_id,
            query: {
              user_id: loggedInUser?._id,
            },
          }}
          onClick={onClickOutside}
          className="flex items-center gap-[14px] stroke-[#B7BBCC] py-2.5 px-4 text-white hover:bg-black-shade-9"
        >
          <PopupUserIcon />
          <div className="flex flex-col gap-[2px]">
            <p className="text-sm font-medium">View my profile</p>
            <span className="text-xs font-medium text-gray-shade-14">
              Social Posts, NFTS
            </span>
          </div>
        </Link>
        <Link
          href={{ pathname: AppRoutes.feed.index }}
          onClick={onClickOutside}
          className="flex items-center gap-[14px] stroke-[#B7BBCC] py-2.5 px-4 text-white hover:bg-black-shade-9"
        >
          <PopupFeedIcon />
          <div className="flex flex-col gap-[2px]">
            <p className="text-sm font-medium">My Feed</p>
            <span className="text-xs font-medium text-gray-shade-14">
              Feed and Posts
            </span>
          </div>
        </Link>
        <Link
          href={{ pathname: AppRoutes.chat.index }}
          onClick={onClickOutside}
          className="flex items-center gap-[14px] stroke-[#B7BBCC] py-2.5 px-4 text-white hover:bg-black-shade-9"
        >
          <PopupMessageIcon />
          <div className="flex flex-col gap-[2px]">
            <p className="text-sm font-medium">Chat</p>
            <span className="text-xs font-medium text-gray-shade-14">
              Groups, Conversations
            </span>
          </div>
        </Link>
        <Link
          href={{ pathname: AppRoutes.notifications }}
          onClick={onClickOutside}
          className="flex items-center gap-[14px] stroke-[#B7BBCC] py-2.5 px-4 text-white hover:bg-black-shade-9"
        >
          <PopupBellIcon />
          <div className="flex flex-col gap-[2px]">
            <p className="text-sm font-medium">
              {/* //TODO => create UI for this badge */}
              Notifications {unreadNotifications > 0 ? unreadNotifications : ""}
            </p>
            <span className="text-xs font-medium text-gray-shade-14">
              Alerts, Notifications
            </span>
          </div>
        </Link>
        <Link
          href={matches ? AppRoutes.settings.profile : AppRoutes.settings.index}
          onClick={onClickOutside}
          className="flex items-center gap-[14px] stroke-[#B7BBCC] py-2.5 px-4 text-white hover:bg-black-shade-9"
        >
          <PopupSettingIcon />
          <div className="flex flex-col gap-[2px]">
            <p className="text-sm font-medium">Settings</p>
            <span className="text-xs font-medium text-gray-shade-14">
              Account, Privacy
            </span>
          </div>
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
                AppRoutes.auth.register +
                "?referred_by=" +
                loggedInUser?._id
              }
              className="w-full rounded-md border-0 bg-black-shade-3 bg-opacity-60 py-2 pl-3 text-xs font-medium text-gray-shade-14 backdrop-blur-lg backdrop-filter focus:outline-none focus:ring-0"
            />
            <FiCopy
              className="ml-2 h-6 w-6 stroke-gray-shade-14 hover:stroke-brand-primary"
              onClick={async () => {
                await copyText(
                  window.location.origin +
                    AppRoutes.auth.register +
                    "?referred_by=" +
                    loggedInUser?._id
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
              value={loggedInUser?._id}
              className="w-full rounded-md border-0 bg-black-shade-3 bg-opacity-60 py-2 pl-3 text-xs font-medium text-gray-shade-14 backdrop-blur-lg backdrop-filter focus:outline-none focus:ring-0"
            />
            <FiCopy
              className="ml-2 h-6 w-6 stroke-gray-shade-14 hover:stroke-brand-primary"
              onClick={async () => {
                await copyText(loggedInUser?._id ?? "");
                toast.success("Account address copied!");
              }}
            />
          </div>
        </div>
        <p className="mt-[10px] text-[10px] font-normal text-gray-shade-14">
          Copy your Referral link and share it with your friends to generate
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
              if (loggedInUser._id.toLowerCase() !== _account?.toLowerCase()) {
                toast.error("Please connect to correct account");
                deactivate();
              }
            }}
          >
            <ConnectIcon />
            <p className="textGradient text-sm font-medium leading-6">
              Connect your Wallet
            </p>
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderProfile;
