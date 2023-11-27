import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { toast } from "react-hot-toast";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { SiBinance } from "react-icons/si";
import { FiArrowUpRight, FiCopy, FiGithub, FiInstagram } from "react-icons/fi";
import { isAddress } from "ethers/lib/utils";
import {
  LinkNewIcon,
  CentherIcon,
  NewTelegramIcon,
  NewRedditIcon,
  NewDiscordIcon,
  NewFacebookIcon,
  Whitepaper,
  Staking,
  XIcon,
} from "@/assets/svgs";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import { ModalPortal } from "@/components/modal/modal.portal";
import Button from "@/components/button";
import { eqAddress } from "@/live/utils/address.utils";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { ZeroAddress } from "@/web3/constants/common";
import { useStaking } from "@/hooks/staking";
import { fetchUsers } from "@/hooks/use.get.multi.users";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { User } from "@/models/user";
import {
  claimPeriodOptions,
  stakingPeriodOptions,
} from "@/pages/staking/constants";
import { stakingFormInterfaceUpdated } from "@/pages/staking/_components/staking-types";
import { useWallet } from "@/web3/hooks/use.wallet";

export interface Memb {
  title: string | undefined;
  userImage: string;
  userDisplayName: string;
  address: string;
  membership: User["membership"];
}

interface CustomModalProps {
  data: stakingFormInterfaceUpdated;
  onClickClose: () => void;
  createStaking: (data: stakingFormInterfaceUpdated) => void;
  loaded: () => void;
}

export const StakingReviewModal: React.FC<CustomModalProps> = ({
  onClickClose,
  createStaking,
  data,
  loaded,
}) => {
  const { sdk } = useStaking();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [setConnectWalletModal] = useState(false);
  const { getSigner, connectedAddress } = useWallet();
  const [coinsDetails, setCoinsDetails] = useState<
    Array<CoinDetails | undefined>
  >([]);
  const [memberDetails, setMemberDetails] = useState<Memb[]>([]);

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
    if (getSigner() && connectedAddress?.length) {
      setIsConnected(true);
    } else setIsConnected(false);
  }, [getSigner, connectedAddress]);

  const handleMembers = async (users: any, data: any) => {
    const combinedArray = [];

    for (const member of data.members) {
      const walletAddress = member.walletAddress;
      const user = users.find((u: any) => eqAddress(u._id, walletAddress));

      if (user) {
        const profileImage = user.profile_image;
        const displayName = user.display_name;
        const jobTitle = member.jobTitle;
        const address = user._id;
        const membership = user.membership;

        combinedArray.push({
          title: jobTitle,
          userImage: profileImage,
          userDisplayName: displayName,
          address,
          membership: membership,
        });
      }
    }

    setMemberDetails(combinedArray);
  };

  useEffect(() => {
    const getUsers = async (walletAddresses: string[]) => {
      const filteredUsers = walletAddresses.filter(
        (e) => ZeroAddress != e && isAddress(e)
      );

      if (!filteredUsers?.length) {
        return [];
      }

      const users = await fetchUsers(walletAddresses);
      return users;
    };

    const getCoinDetails = async (tokens: string[]) => {
      const list: string[] = [];
      tokens.filter(Boolean).forEach((e) => {
        if (e != ZeroAddress && list.indexOf(e) == -1) {
          list.push(e);
        }
      });

      if (list?.length) {
        const details = await fetchTokenMetadata(list);
        if (!details?.length) {
          return;
        }

        const tokenDetails = details.map((e: any) => e.token._value);
        setCoinsDetails(
          tokenDetails.map((e: any) => {
            return {
              ...e,
              contractAddress: e.contractAddress._value,
              chain: e.chain._value,
            };
          })
        );
      }
    };

    if (!memberDetails?.length && data) {
      const walletAddresses =
        data?.members?.map((item) => item.walletAddress) || [];
      getUsers(walletAddresses).then((users) => {
        handleMembers(users, data);
      });
    }

    if (sdk && !coinsDetails?.length) {
      getCoinDetails([data.token_address, data.reward_token_address]).then(() =>
        loaded()
      );
    }
  }, [data, sdk]);

  return (
    <ModalPortal wrapperId="review-staking-portal">
      <div
        className={`fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-background-shade-3 font-monto backdrop-blur-[7px] backdrop-filter fsm:bg-transparent`}
      >
        <div
          className={`flex h-full w-full max-w-[100%] flex-col overflow-auto border  border-solid border-[#2a2d3c] bg-background-shade-3 p-6 fsm:mx-2 fsm:h-auto fsm:max-h-[90%] fsm:rounded-3xl md:mx-0 fmd:max-w-[80%]`}
          ref={PassportModalRef}
        >
          <div className="flex flex-col gap-8 text-left">
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-gradient text-xl font-semibold f2xl:text-2xl">
                  Review your project
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    title="Edit"
                    onClick={() => {
                      onClickClose();
                    }}
                    variant="secondary"
                    className="text-xs"
                  />
                  <Button
                    title="Submit"
                    onClick={() => createStaking(data)}
                    variant="primary"
                    className="text-xs"
                  />
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
                  <div className="absolute bottom-6 left-6 my-auto">
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
                      {coinsDetails.find((e) =>
                        eqAddress(data.token_address, e?.contractAddress)
                      )?.logo ? (
                        <Image
                          src={
                            coinsDetails.find((e) =>
                              eqAddress(data.token_address, e?.contractAddress)
                            )?.logo as string
                          }
                          alt="token-address-symbol"
                          width={20}
                          height={20}
                        />
                      ) : (
                        <Staking className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                      )}

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
                  <div className="col-span-1">
                    <p className={label}>Token Project Name</p>
                    <p className={value}>
                      {
                        coinsDetails.find((e) =>
                          eqAddress(data.token_address, e?.contractAddress)
                        )?.name
                      }
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className={label}>Symbol</p>
                    <p className={value}>
                      {
                        coinsDetails.find((e) =>
                          eqAddress(data.token_address, e?.contractAddress)
                        )?.symbol
                      }
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className={label}>Details</p>
                    <p className={value}>
                      <p className={value}>
                        {" "}
                        <a
                          href={`${BlockchainConfig.scanner.url}/address/${data.token_address}`}
                          target={"_blank"}
                          rel="noreferrer"
                          title="View on Explorer"
                          className={`group flex items-center gap-1 text-white`}
                        >
                          <span
                            className={`text-gradient-hover text-xs text-gray-shade-7`}
                          >
                            View on {BlockchainConfig.scanner.name}
                          </span>
                          <FiArrowUpRight
                            className={`text-gradient-hover cursor-pointer text-sm`}
                          />
                        </a>
                      </p>
                    </p>
                  </div>
                </div>

                {!eqAddress(data.token_address, data.reward_token_address) &&
                data.reward_token_address?.length ? (
                  <div className="grid w-full gap-6 fsm:grid-cols-2 fsm:gap-10 fmd:grid-cols-3 flg:grid-cols-4">
                    <div className={section}>
                      <p className={label}>Reward Token Address</p>
                      <p
                        className={clsx(
                          value,
                          "word-break flex items-center gap-2 truncate"
                        )}
                      >
                        {coinsDetails.find((e) =>
                          eqAddress(
                            data.reward_token_address,
                            e?.contractAddress
                          )
                        )?.logo ? (
                          <Image
                            src={
                              coinsDetails.find((e) =>
                                eqAddress(
                                  data.reward_token_address,
                                  e?.contractAddress
                                )
                              )?.logo as string
                            }
                            alt="token-address-symbol"
                            width={20}
                            height={20}
                          />
                        ) : (
                          <Staking className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                        )}

                        <span>
                          {sliceAccountAddress(data?.reward_token_address)}
                        </span>
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
                      <p className={label}>Token Project Name</p>
                      <p className={value}>
                        {" "}
                        {
                          coinsDetails.find((e) =>
                            eqAddress(
                              data.reward_token_address,
                              e?.contractAddress
                            )
                          )?.name
                        }
                      </p>
                    </div>
                    <div className={section}>
                      <p className={label}>Symbol</p>
                      <p className={value}>
                        {" "}
                        {
                          coinsDetails.find((e) =>
                            eqAddress(
                              data.reward_token_address,
                              e?.contractAddress
                            )
                          )?.symbol
                        }
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className={label}>Details</p>
                      <p className={value}>
                        <p className={value}>
                          {" "}
                          <a
                            href={`${BlockchainConfig.scanner.url}/address/${data.reward_token_address}`}
                            target={"_blank"}
                            rel="noreferrer"
                            title="View on Explorer"
                            className={`group flex items-center gap-1 text-white`}
                          >
                            <span
                              className={`text-gradient-hover text-xs text-gray-shade-7`}
                            >
                              View on {BlockchainConfig.scanner.name}
                            </span>
                            <FiArrowUpRight
                              className={`text-gradient-hover cursor-pointer text-sm`}
                            />
                          </a>
                        </p>
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="border-b-2 border-gray-shade-3"></div>
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
                    <p className={value}>{data?.apy}%</p>
                  </div>
                  <div className={section}>
                    <p className={label}>Staking Period</p>
                    <p className={value}>
                      {
                        stakingPeriodOptions.find(
                          (e) => e.value == +data?.staking_period
                        )?.title
                      }
                    </p>
                  </div>
                  <div className={section}>
                    <p className={label}>Claim Period</p>
                    <p className={value}>
                      {
                        claimPeriodOptions.find(
                          (e) => e.value == +data?.claim_period
                        )?.title
                      }
                    </p>
                  </div>
                  {data?.burn_tax && data?.burn_tax > 0 && (
                    <div className={section}>
                      <p className={label}>Burn Tax on claim</p>
                      <p className={value}>{data?.burn_tax}%</p>
                    </div>
                  )}

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
                  {data?.charge_fee_on_cancel &&
                  data?.charge_fee_on_cancel >= 0 ? (
                    <div className={section}>
                      <p className={label}>Charge Fee on Cancel</p>
                      <p className={value}>{data?.charge_fee_on_cancel}%</p>
                    </div>
                  ) : null}

                  <div className={section}>
                    <p className={label}>Start Time</p>
                    <p className={value}>{data?.start_date}</p>
                  </div>
                  {data?.max_staking_amount && data?.max_staking_amount >= 0 ? (
                    <div className={section}>
                      <p className={label}>Maximum Stakable Amount</p>
                      <p className={value}>
                        {data?.max_staking_amount}{" "}
                        {
                          coinsDetails.find((e) =>
                            eqAddress(data.token_address, e?.contractAddress)
                          )?.symbol
                        }
                      </p>
                    </div>
                  ) : null}

                  <div className={section}>
                    <p className={label}>Minimum Stakable Amount</p>
                    <p className={value}>
                      {data?.min_staking_amount}{" "}
                      {
                        coinsDetails.find((e) =>
                          eqAddress(data.token_address, e?.contractAddress)
                        )?.symbol
                      }
                    </p>
                  </div>
                </div>
                {data?.project_metadata &&
                data?.project_metadata?.length > 0 ? (
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
                ) : null}
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
                      {data?.whitepaper?.length ? (
                        <a
                          href={data?.whitepaper}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <Whitepaper className="group-hover:[&>*]:stroke-white" />
                          <span>Whitepaper</span>
                        </a>
                      ) : null}
                      {data?.website_url?.length ? (
                        <a
                          href={data?.website_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={button}
                        >
                          <LinkNewIcon className="group-hover:[&>*]:stroke-white" />
                          <span>Website </span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-semibold text-white">
                      Social Links
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {data?.centher?.length ? (
                        <a
                          href="will come from api"
                          target="_blank"
                          rel="noreferrer noopener"
                          className="centher-social-button flex select-none items-center gap-2 rounded-[11px] bg-elevation-1 px-[10px] py-[6px] text-xs font-medium text-gray-shade-14"
                        >
                          <span className="h-5 w-5 flex-shrink-0">
                            <CentherIcon />
                          </span>
                          <span>Centher</span>
                        </a>
                      ) : null}

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
                          <XIcon className="h-5 w-5 group-hover:[&>*]:stroke-white" />
                          <span>X.com</span>
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

                <div className="mb-2 mt-3 flex flex-col gap-3">
                  <div className="text-sm font-semibold text-white">Team</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {memberDetails &&
                      memberDetails.length > 0 &&
                      memberDetails.map((member: Memb, key: any) => (
                        <Link
                          href={`https://app.centher.io/profile/${member.address}`}
                          key={key}
                          target="_blank"
                          className="flex items-center gap-3 rounded-[14px] bg-background-shade-3 px-3 py-2"
                        >
                          <Image
                            src={member.userImage}
                            alt="team member image"
                            width={50}
                            height={50}
                            className={`h-[50px] w-[50px] rounded-full object-cover`}
                          />
                          <div className={`space-y-1`}>
                            <div className="flex max-w-[215px] items-center text-sm font-semibold text-white">
                              <span className="block max-w-full overflow-hidden truncate text-xs">
                                {member.userDisplayName}
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
                              {member.title}
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
              {data.liquidity_pool_provided == "no" ? (
                <div
                  className="mt-2 flex items-center rounded-xl bg-[#cf121228] p-6  px-4 py-3 text-sm text-[#fd4040]"
                  role="alert"
                >
                  <p>
                    Warning! This staking pool does not provide Liquidity pool.
                  </p>
                </div>
              ) : null}
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
