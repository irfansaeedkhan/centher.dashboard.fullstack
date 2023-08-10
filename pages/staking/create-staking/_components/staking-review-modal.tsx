import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { toast } from "react-hot-toast";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { SiBinance } from "react-icons/si";
import { FiCopy, FiGithub, FiInstagram, FiTwitter } from "react-icons/fi";

import {
  LinkNewIcon,
  NewCentherIcon,
  NewTelegramIcon,
  NewRedditIcon,
  NewDiscordIcon,
  NewFacebookIcon,
  Whitepaper,
} from "@/assets/svgs";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import { ModalPortal } from "@/components/modal/modal.portal";
import FinalButton from "@/components/button/final.button";
import { stakingFormInterfaceUpdated } from "../../_components/staking-types";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import useUser from "@/hooks/use.user";
import { useWeb3React } from "@web3-react/core";

interface CustomModalProps {
  data: stakingFormInterfaceUpdated;
  onClickClose: () => void;
  createStaking: (data: stakingFormInterfaceUpdated) => void;
}

// dummy data
let card = {
  pack: "Pack 1",
  token_address: "0x018rhf63hjj7763kuxx098nbvxx90cc23BBK99KXX028",
  reward_token_address: "0x018rhf63hjj7763kuxx098nbvxx90cc23BBK99KXX028",
  apy: "10%",
  price: "200 BNB",
  sybmol: "DPI",
  staking_period: "3 months",
  claim_period: "Monthly",
  liquidity_pool_provided: "yes",
  is_cancelable: "yes",
  show_on_centher: "yes",
  charge_fee_on_cancel: 0.8,
  start_time: "13 jully, 2023, 12 PM",
  max_staking_amount: 200,
  min_staking_amount: 10,
  multilevel_rewards: "level 3",
  rewards_level: [
    {
      level: 1,
      percent: 10,
    },
    {
      level: 2,
      percent: 4,
    },
    {
      level: 3,
      percent: 3,
    },
    {
      level: 4,
      percent: 0,
    },
    {
      level: 5,
      percent: 0,
    },
    {
      level: 6,
      percent: 0,
    },
  ],
  project_metadata: [
    {
      title: "Project Name",
      data: "Centher",
    },
  ],
  team_member_list: [
    {
      name: "Antonio Marseglia",
      title: "Chief Metaverse Officer",
      image: "/images/antonio-marseglia.png",
      url: "https://app.centher.io/profile/0x8a437ec0843d57abbff57bf5a77f0cd88f1b0e7a",
    },
    {
      name: "Antonio De Rosa",
      title: "Chief Marketing Officer",
      image: "/images/antonio-de-rosa.png",
      url: "https://app.centher.io/profile/0x12fdc603d1a702b878d3757a348cd8e30abf754c",
    },
    {
      name: "Antonio Monaco",
      title: "Chief Technology Officer",
      image: "/images/antonio-monaco.png",
      url: "https://app.centher.io/profile/0x5e377fcf96c8280891aa84e6b3b4698c2cc5229a",
    },
    {
      name: "Jayant Khanuja",
      title: "Environment and Lands Designer",
      image: "/images/jayant-khanuja.png",
      url: "https://app.centher.io/profile/0x7e8b98369ce4afa606b32652bbf9ca37ab20e294",
    },
  ],
};

export const StakingReviewModal: React.FC<CustomModalProps> = ({
  onClickClose,
  createStaking,
  data,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const { connectWallet } = useConnectWallet();
  const { user: loggedInUser } = useUser();
  const { deactivate, library, account } = useWeb3React();

  const htmlBodyRef = useRef<HTMLBodyElement>(document.body as HTMLBodyElement);
  const PassportModalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(PassportModalRef, () => {
    onClickClose();
  });

  useEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClickClose();
      }
    },
    htmlBodyRef
  );

  useEffect(() => {
    if (library && account?.length) {
      setIsConnected(true);
    } else setIsConnected(false);
  }, [library, account]);

  return (
    <ModalPortal wrapperId="review-staking-portal">
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-background-shade-3 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
      >
        <div
          className={`flex h-full w-full max-w-[80%] flex-col overflow-auto  border border-solid border-[#2a2d3c] bg-background-shade-3 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0`}
          ref={PassportModalRef}
        >
          <div className="flex flex-col gap-8 text-left">
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-24px text-gradient font-semibold">
                  Review your project
                </h3>
                <div className="flex items-center gap-2">
                  {!isConnected ? (
                    <FinalButton
                      title={"Connect Wallet"}
                      variant="primary"
                      onClick={() => {
                        setConnectWalletModal(true);
                      }}
                      className="text-14px mx-auto mt-5 w-[45%]"
                    />
                  ) : (
                    <>
                      <FinalButton
                        title="Edit"
                        onClick={() => {
                          onClickClose();
                        }}
                        variant="secondary"
                        className="text-xs"
                      />
                      <FinalButton
                        title="Submit"
                        onClick={() => createStaking(data)}
                        variant="primary"
                        className="text-xs"
                      />
                    </>
                  )}
                </div>
              </div>
              {/* top */}
              <div className="flex w-full max-w-full flex-col gap-5 border-b-2 border-gray-shade-3 bg-elevation-1 pb-6 fsm:pb-10">
                <div
                  className="relative h-[200px] w-full rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      data?.cover_image
                        ? URL.createObjectURL(data?.cover_image)
                        : ""
                    })`,
                  }}
                >
                  <div className="absolute left-6 bottom-6 my-auto">
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          data?.profile_image
                            ? URL.createObjectURL(data?.profile_image)
                            : ""
                        }
                        alt="token-address-symbol"
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <p className="text-xl font-bold text-white">
                        {data?.staking_name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid w-full gap-6 fsm:grid-cols-2 fsm:gap-10 fmd:grid-cols-3 flg:grid-cols-4">
                  <div className={section}>
                    <p className={label}>Token Address</p>
                    <p
                      className={clsx(
                        value,
                        "word-break flex items-center gap-2 truncate"
                      )}
                    >
                      <Image
                        src="/images/token-address-symbol.png"
                        alt="token-address-symbol"
                        width={20}
                        height={20}
                      />
                      <span>{sliceAccountAddress(data?.token_address)}</span>
                      <FiCopy
                        className="h-5 w-5 cursor-pointer stroke-gray-shade-14 hover:stroke-brand-primary"
                        onClick={async () => {
                          await copyText(data?.token_address ?? "");
                          toast.success("Token address copied!");
                        }}
                      />
                    </p>
                  </div>
                  <div className={section}>
                    <p className={label}>Project Name</p>
                    <p className={value}>name here</p>
                  </div>
                  <div className={section}>
                    <p className={label}>Price</p>
                    <p className={value}>price here</p>
                  </div>
                  <div className={section}>
                    <p className={label}>Symbol</p>
                    <p className={value}>symbol here</p>
                  </div>
                </div>
                <div className="grid w-full gap-6 fsm:grid-cols-2 fsm:gap-10 fmd:grid-cols-3 flg:grid-cols-4">
                  <div className={section}>
                    <p className={label}>Rewards Token Address</p>
                    <p
                      className={clsx(
                        value,
                        "word-break flex items-center gap-2 truncate"
                      )}
                    >
                      <Image
                        src="/images/token-address-symbol.png"
                        alt="token-address-symbol"
                        width={20}
                        height={20}
                      />
                      <span>
                        {sliceAccountAddress(data?.reward_token_address)}
                      </span>
                      <FiCopy
                        className="h-5 w-5 cursor-pointer stroke-gray-shade-14 hover:stroke-brand-primary"
                        onClick={async () => {
                          await copyText(data?.reward_token_address ?? "");
                          toast.success("Reward Token address copied!");
                        }}
                      />
                    </p>
                  </div>
                  {data?.reward_token_address !== data?.token_address && (
                    <>
                      <div className={section}>
                        <p className={label}>Project Name</p>
                        <p className={value}>DeXa name here</p>
                      </div>
                      <div className={section}>
                        <p className={label}>Price</p>
                        <p className={value}>price here</p>
                      </div>
                      <div className={section}>
                        <p className={label}>Symbol</p>
                        <p className={value}>symbol here</p>
                      </div>
                    </>
                  )}
                </div>
                {data?.multilevel_rewards !== "No referral" &&
                  data?.rewards_level &&
                  data?.rewards_level.length > 0 && (
                    <div className="gradient-border-3 rounded-xl p-[1px]">
                      <div className="p-5">
                        <p className="mb-[10px] text-sm text-gray-shade-14">
                          Multilevel Rewards System(Monthly)
                        </p>
                        <div className="scrollSetLight2 flex items-center justify-between gap-2 overflow-x-auto">
                          {data?.rewards_level.map((level, index) => (
                            <div
                              className="flex min-w-[80px] items-center gap-1"
                              key={index}
                            >
                              <p className="text-xs font-medium text-gray-shade-14">
                                Level {level.level}:
                              </p>
                              <p
                                className={clsx(
                                  "text-sm font-medium",
                                  level.percent === 0
                                    ? "text-gray-shade-14"
                                    : "text-white"
                                )}
                              >
                                {level.percent}%
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                <div className="grid w-full gap-6 fsm:grid-cols-2 fsm:gap-10 fmd:grid-cols-3 flg:grid-cols-4">
                  <div className={section}>
                    <p className={label}>APY</p>
                    <p className={value}>{data?.apy}</p>
                  </div>
                  <div className={section}>
                    <p className={label}>Staking Period</p>
                    <p className={value}>{data?.staking_period}</p>
                  </div>
                  <div className={section}>
                    <p className={label}>Claim Period</p>
                    <p className={value}>{data?.claim_period}</p>
                  </div>
                  {data?.liquidity_pool_provided === "yes" && (
                    <div className={section}>
                      <p className={label}>Liquidity Pool Provided</p>
                      <p className={value2}>{data?.liquidity_pool_provided}</p>
                    </div>
                  )}
                  {data?.is_cancelable === "yes" && (
                    <div className={section}>
                      <p className={label}>Is Cancelable</p>
                      <p className={value2}>{data?.is_cancelable}</p>
                    </div>
                  )}
                  {data?.show_on_centher === "yes" && (
                    <div className={section}>
                      <p className={label}>Show on Centher</p>
                      <p className={value2}>{data?.show_on_centher}</p>
                    </div>
                  )}
                  <div className={section}>
                    <p className={label}>Charge Fee on Cancel</p>
                    <p className={value}>{data?.charge_fee_on_cancel}</p>
                  </div>
                  <div className={section}>
                    <p className={label}>Start Time</p>
                    <p className={value}>{data?.start_date}</p>
                  </div>
                  <div className={section}>
                    <p className={label}>Maximum Stakable Amount</p>
                    <p className={value}>{data?.max_staking_amount}</p>
                  </div>
                  <div className={section}>
                    <p className={label}>Minimum Stakable Amount</p>
                    <p className={value}>{data?.min_staking_amount}</p>
                  </div>
                </div>
                {data?.project_metadata && (
                  <div>
                    <p className={label}>Project Metadata</p>
                    <div className="grid w-full items-center gap-5 fsm:grid-cols-2 fsm:gap-10 fmd:grid-cols-3 flg:grid-cols-4">
                      {data?.project_metadata.map((data, index) => (
                        <div
                          className="gradient-border-3 col-span-2 mt-[6px] flex h-[72px] flex-col items-center justify-center rounded-[10px] p-[1px] fsm:col-span-1"
                          key={index}
                        >
                          <p className="textGradient text-xs font-medium">
                            {data.title}
                          </p>
                          <p className={value}>{data.data}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!data?.liquidity_pool_provided && (
                  <p className="color-[#E5535A] text-14px mt-5 w-full rounded-lg bg-[#E5535A]/60 py-1 px-2 font-normal">
                    Warning! This staking pool does not provide Liquidity pool
                    and Centher does not guarantee it
                  </p>
                )}
              </div>
              {/* bottom */}
              <div className="flex flex-col gap-4 pt-6 fsm:pt-5">
                <div className="grid w-full gap-6 fsm:grid-cols-2 fsm:gap-10">
                  <div className="flex flex-col gap-3">
                    {/* hard coded dexa links */}
                    <div className="text-sm font-semibold text-white">
                      Official Links
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={data?.whitepaper}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={button}
                      >
                        <Whitepaper className="group-hover:[&>*]:stroke-white" />
                        <span>Whitepaper</span>
                      </a>
                      <a
                        href={data?.website_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={button}
                      >
                        <LinkNewIcon className="group-hover:[&>*]:stroke-white" />
                        <span>Website </span>
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-semibold text-white">
                      Social Links
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href="will come from api"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="centher-social-button flex select-none items-center gap-2 rounded-[11px] bg-elevation-1 px-[10px] py-[6px] text-xs font-medium text-gray-shade-14"
                      >
                        <NewCentherIcon />
                        <span>Centher</span>
                      </a>
                      {data?.facebook && (
                        <a
                          href={data?.facebook}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <NewFacebookIcon className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                          <span>Facebook</span>
                        </a>
                      )}
                      {data?.twitter && (
                        <a
                          href={data?.twitter}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <FiTwitter className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                          <span>Twitter</span>
                        </a>
                      )}
                      {data?.github && (
                        <a
                          href={data?.github}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <FiGithub className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                          <span>Github</span>
                        </a>
                      )}
                      {data?.telegram && (
                        <a
                          href={data?.telegram}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <NewTelegramIcon className="group-hover:[&>*]:stroke-white" />
                          <span>Telegram</span>
                        </a>
                      )}
                      {data?.instagram && (
                        <a
                          href={data?.instagram}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <FiInstagram className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                          <span>Instagram</span>
                        </a>
                      )}
                      {data?.discord && (
                        <a
                          href={data?.discord}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <NewDiscordIcon className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                          <span>Discord</span>
                        </a>
                      )}
                      {data?.reddit && (
                        <a
                          href={data?.reddit}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <NewRedditIcon className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                          <span>Reddit</span>
                        </a>
                      )}
                    </div>
                  </div>
                  {data?.explorers && (
                    <div className="flex flex-col gap-3">
                      <div className="text-sm font-semibold text-white">
                        Explorers
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={data?.explorers}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <SiBinance className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                          <span>BscScan</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-semibold text-white">
                      Category
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {data?.category?.map((data: any) => {
                        return (
                          <div className={button} key={data.label}>
                            <span>{data.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-3 mb-2 flex flex-col gap-3">
                  <div className="text-sm font-semibold text-white">Team</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {data?.members &&
                      data?.members.length > 0 &&
                      data?.members.map((member, key) => (
                        <Link
                          href={
                            "https://app.centher.io/profile/0x8a437ec0843d57abbff57bf5a77f0cd88f1b0e7a"
                          }
                          key={key}
                          target="_blank"
                          className="flex items-center gap-3 rounded-[14px] bg-background-shade-3 px-3 py-2"
                        >
                          <Image
                            src={"/images/antonio-marseglia.png"}
                            alt="team member image"
                            width={50}
                            height={50}
                            className={`h-[50px] w-[50px] rounded-full object-cover`}
                          />
                          <div className={`space-y-1`}>
                            <div className="flex max-w-[215px] items-center text-sm font-semibold text-white">
                              <span className="block max-w-full overflow-hidden truncate text-xs">
                                name :{member.walletAddress}
                              </span>
                              <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                                <Image
                                  src={"/images/rainbow-last-frame.png"}
                                  alt={"Verified"}
                                  width={20}
                                  height={20}
                                />
                              </span>
                            </div>
                            <span className={`text-xs text-gray-shade-14`}>
                              {member.jobTitle}
                            </span>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-sm font-semibold text-white">
                  Description
                </div>
                <p className="whitespace-pre-wrap text-xs font-medium text-gray-shade-14 md:text-sm">
                  {data?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

const button = `group flex select-none items-center gap-2 rounded-[11px] bg-elevation-1 stroke-gray-shade-14 px-[10px] py-[6px] text-xs font-medium text-gray-shade-14 hover:text-white cursor-pointer bg-[#1E1F28]`;
const label = `text-sm text-gray-shade-14 mb-[2px]`;
const value = `text-sm font-medium text-white`;
const value2 = `text-sm font-medium text-green-shade-1`;
const section = `col-span-2 fsm:col-span-1`;
