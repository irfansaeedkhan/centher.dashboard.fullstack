import React, { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiArrowUpRight, FiCopy } from "react-icons/fi";
import { useOnClickOutside } from "usehooks-ts";
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
import Button from "@/components/button";
import { WalletEnum, useWallet } from "@/web3/hooks/use.wallet";

interface HeaderProfileProps {
  onClickOutside: () => void;
  modalOpenerRef: React.RefObject<HTMLDivElement>;
  openBuyCitizenshipModal: () => void;
}

const HeaderProfile: React.FC<HeaderProfileProps> = ({
  onClickOutside,
  modalOpenerRef,
  openBuyCitizenshipModal,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { unreadNotifications, unreadConversations } = useCentherLive();
  const {
    connectWallet,
    connectedAddress,
    disconnectWallet,
    getWalletType,
    openWallet,
  } = useWallet();
  const wallet_type = getWalletType();

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
    if (!connectedAddress || !loggedInUser) {
      return;
    }
    if (loggedInUser._id.toLowerCase() !== connectedAddress.toLowerCase()) {
      disconnectWallet();
    }
  }, [disconnectWallet, loggedInUser, connectedAddress]);

  const verificationTick = useVerificationTick({ user: loggedInUser });

  return (
    <div
      ref={ref}
      className={`absolute -right-[62px] top-[calc(100%+20px)] z-50 h-auto w-[300px] overflow-y-auto overflow-x-hidden rounded-2xl bg-black-shade-8 fxl:right-0 custom-height-oriented:h-[480px] [@media(max-height:420px)]:h-[280px] [@media(min-width:380px)]:w-[364px]`}
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
            <span className={clsx(`block max-w-full overflow-hidden truncate`)}>
              {loggedInUser && sliceDisplayName(loggedInUser?.display_name)}
            </span>
            {verificationTick && (
              <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
                <Image
                  src={verificationTick}
                  alt={
                    loggedInUser?.membership.status === "citizen"
                      ? "Citizen"
                      : "Verified"
                  }
                  width={16}
                  height={16}
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
              className={`text-xs text-gray-shade-7 group-hover:text-white/75`}
            >
              View on {BlockchainConfig.scanner.name}
            </span>
            <FiArrowUpRight
              className={`cursor-pointer text-sm group-hover:text-white/75`}
            />
          </a>
        </div>
      </div>
      <div className="border-b border-gray-shade-border-color p-4 ">
        {wallet_type == WalletEnum.WALLET_SERVICE ? (
          <Button
            title="Open Wallet"
            onClick={() => openWallet()}
            variant="primary"
            className="text-sm"
            borderRounded="10px"
          />
        ) : (
          <></>
        )}
      </div>
      <div className="border-b border-gray-shade-border-color p-4 ">
        <Button
          title={
            loggedInUser?.membership.status !== "citizen"
              ? "Subscribe to Citizen Passport"
              : "View my Citizen Passport"
          }
          onClick={
            loggedInUser?.membership.status !== "citizen"
              ? () => {
                  onClickOutside();
                  openBuyCitizenshipModal();
                }
              : () => {
                  router.push({
                    pathname: AppRoutes.settings.citizen.team_members,
                  });
                }
          }
          variant="primary"
          className="text-sm"
          borderRounded="10px"
        />
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
          className="flex items-center gap-[14px] stroke-[#B7BBCC] px-4 py-2.5 text-white hover:bg-black-shade-9"
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
          className="flex items-center gap-[14px] stroke-[#B7BBCC] px-4 py-2.5 text-white hover:bg-black-shade-9"
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
          className="flex items-center gap-[14px] stroke-[#B7BBCC] px-4 py-2.5 text-white hover:bg-black-shade-9"
        >
          <PopupMessageIcon />
          <div className="flex flex-col gap-[2px]">
            <p className="text-sm font-medium">
              Chat{" "}
              <span className="text-xs text-yellow-400">
                &nbsp;{unreadConversations > 0 ? unreadConversations : ""}
              </span>
            </p>
            <span className="text-xs font-medium text-gray-shade-14">
              Private Conversations
            </span>
          </div>
        </Link>
        <Link
          href={{ pathname: AppRoutes.notifications }}
          onClick={onClickOutside}
          className="flex items-center gap-[14px] stroke-[#B7BBCC] px-4 py-2.5 text-white hover:bg-black-shade-9"
        >
          <PopupBellIcon />
          <div className="flex flex-col gap-[2px]">
            <p className="text-sm font-medium">
              Notifications{" "}
              <span className="text-xs text-yellow-400">
                &nbsp;{unreadNotifications > 0 ? unreadNotifications : ""}
              </span>
            </p>
            <span className="text-xs font-medium text-gray-shade-14">
              Alerts, Notifications
            </span>
          </div>
        </Link>
        <Link
          href={AppRoutes.settings.profile}
          onClick={onClickOutside}
          className="flex items-center gap-[14px] stroke-[#B7BBCC] px-4 py-2.5 text-white hover:bg-black-shade-9"
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
        {connectedAddress ? (
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
            className="textGradient flex items-center gap-3 stroke-brand-primary"
            onClick={async () => {
              if (!loggedInUser) return;
              const _account = await connectWallet();
              if (loggedInUser._id.toLowerCase() !== _account?.toLowerCase()) {
                toast.error("Please connect to correct account");
                disconnectWallet();
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
