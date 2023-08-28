import React from "react";
import clsx from "clsx";
import { FiArrowUpRight, FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import { ListCardDataOBj } from "./list-card-data";
import Image from "next/image";
import Link from "next/link";
import { claimPeriodOptions, stakingPeriodOptions } from "../constants";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { formatIPFSUrl } from "@/utils/format.address";
import { formatUnits } from "ethers/lib/utils";
import { metaDataType } from "./staking-types";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { eqAddress } from "@/live/utils/address.utils";
import { Staking } from "@/assets/svgs";
import { BlockchainConfig } from "@/web3/blockchain/config";
import FinalButton from "@/components/button/final.button";
import { useRouter } from "next/router";

export interface ListCardProps {
  card: ListCardDataOBj;
  coins: Array<CoinDetails | undefined>;
}

const GridLayoutCard: React.FC<ListCardProps> = ({ card, coins }) => {
  const router = useRouter();

  return (
    <div className="flex w-full max-w-full flex-col gap-5 rounded-2xl bg-elevation-1 p-5 fsm:p-8">
      <div
        className="relative h-[200px] w-full rounded-2xl bg-[url(/images/profile-header-cover.jpg)] bg-cover bg-center"
        style={{
          backgroundImage: card.metadata?.banner?.length
            ? `url(${formatIPFSUrl("ipfs:" + card.metadata.banner)})`
            : "url(/images/profile-header-cover.jpg)",
        }}
      >
        <div className="absolute right-6 top-5 flex items-center gap-4">
          {/* <Link
            href={"/staking/staking-details/" + card.id}
            className="textGradient text-xs font-medium"
          >
            View project detail
          </Link> */}
          <FinalButton
            variant="primary"
            className="h-7"
            title="View project detail"
            borderRounded="10px"
            onClick={() => router.push("/staking/staking-details/" + card.id)}
          />
          <div
            className={clsx(
              "w-fit rounded-[10px] bg-black-shade-3 px-3 py-[6px] text-xs font-semibold",
              card.is_active ? "text-[#76E268]" : "text-brand-primary"
            )}
          >
            {card.is_active ? "Active" : "Unbalanced"}
          </div>
        </div>
        <div className="absolute bottom-6 left-6 my-auto">
          <div className="flex items-center gap-4">
            <Image
              src={
                card.metadata
                  ? formatIPFSUrl("ipfs:" + card.metadata.icon)
                  : "/images/profile-header-cover.jpg"
              }
              alt="token-address-symbol"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <p className="text-xl font-bold text-white">{card.pack}</p>
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
            {coins.find((e) =>
              eqAddress(e?.contractAddress, card.token_address)
            )?.logo ? (
              <Image
                src={
                  coins.find((e) =>
                    eqAddress(e?.contractAddress, card.token_address)
                  )?.logo as string
                }
                alt="token-address-symbol"
                width={20}
                height={20}
              />
            ) : (
              <Staking className="h-5 w-5 group-hover:[&>*]:stroke-white" />
            )}

            <span>{sliceAccountAddress(card.token_address)} </span>
            <FiCopy
              className="h-5 w-5 cursor-pointer stroke-gray-shade-14 hover:stroke-brand-primary"
              onClick={async () => {
                await copyText(card.token_address ?? "");
                toast.success("Token address copied!");
              }}
            />
          </p>
        </div>
        <div className={section}>
          <p className={label}>Token Project Name</p>
          <p className={value}>
            {
              coins.find((e) =>
                eqAddress(e?.contractAddress, card.token_address)
              )?.name
            }
          </p>
        </div>
        <div className={section}>
          <p className={label}>Symbol</p>
          <p className={value}>
            {
              coins.find((e) =>
                eqAddress(e?.contractAddress, card.token_address)
              )?.symbol
            }
          </p>
        </div>

        <div className={section}>
          <p className={label}>Details</p>
          <p className={value}>
            {" "}
            <a
              href={`${BlockchainConfig.scanner.url}/address/${card.token_address}`}
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
          </p>
        </div>
      </div>
      {!eqAddress(card.token_address, card.reward_token_address) ? (
        <div className="grid w-full gap-6 fsm:grid-cols-2 fsm:gap-10 fmd:grid-cols-3 flg:grid-cols-4">
          <div className={section}>
            <p className={label}>Reward Token Address</p>
            <p
              className={clsx(
                value,
                "word-break flex items-center gap-2 truncate"
              )}
            >
              {coins.find((e) =>
                eqAddress(e?.contractAddress, card.reward_token_address)
              )?.logo ? (
                <Image
                  src={
                    coins.find((e) =>
                      eqAddress(e?.contractAddress, card.reward_token_address)
                    )?.logo as string
                  }
                  alt="token-address-symbol"
                  width={20}
                  height={20}
                />
              ) : (
                <Staking className="h-5 w-5 group-hover:[&>*]:stroke-white" />
              )}

              <span>{sliceAccountAddress(card.reward_token_address)}</span>
              <FiCopy
                className="h-5 w-5 cursor-pointer stroke-gray-shade-14 hover:stroke-brand-primary"
                onClick={async () => {
                  await copyText(card.reward_token_address ?? "");
                  toast.success("Token address copied!");
                }}
              />
            </p>
          </div>
          <div className={section}>
            <p className={label}>Token Project Name</p>
            <p className={value}>
              {
                coins.find((e) =>
                  eqAddress(e?.contractAddress, card.reward_token_address)
                )?.name
              }
            </p>
          </div>

          <div className={section}>
            <p className={label}>Symbol</p>
            <p className={value}>
              {
                coins.find((e) =>
                  eqAddress(e?.contractAddress, card.reward_token_address)
                )?.symbol
              }
            </p>
          </div>

          <div className={section}>
            <p className={label}>Details</p>
            <p className={value}>
              {" "}
              <a
                href={`${BlockchainConfig.scanner.url}/address/${card.reward_token_address}`}
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
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="border-b-2 border-gray-shade-3"></div>
      <div className="grid w-full gap-6 fsm:grid-cols-2 fsm:gap-10 fmd:grid-cols-3 flg:grid-cols-4">
        <div className={section}>
          <p className={label}>APY</p>
          <p className={value}>{+card.apy / 100} %</p>
        </div>
        <div className={section}>
          <p className={label}>Staking Period</p>
          <p className={value}>
            {
              stakingPeriodOptions.find((e) => e.value == +card.staking_period)
                ?.title
            }
          </p>
        </div>
        <div className={section}>
          <p className={label}>Claim Period</p>
          <p className={value}>
            {
              claimPeriodOptions.find((e) => e.value == +card.claim_period)
                ?.title
            }
          </p>
        </div>
        <div className={section}>
          <p className={label}>Liquidity Pool Provided</p>
          <p className={value2}>{card.liquidity_pool_provided}</p>
        </div>
        <div className={section}>
          <p className={label}>Is Cancelable</p>
          <p className={value2}>{card.is_cancelable}</p>
        </div>
        {card.supply && +card.supply > 0 ? (
          <div className={section}>
            <p className={label}>Total Supply</p>
            <p className={value2}>
              {normalizeValue(formatUnits(card.supply, 18).toString())}{" "}
              {
                coins.find((e) =>
                  eqAddress(e?.contractAddress, card.token_address)
                )?.symbol
              }
            </p>
          </div>
        ) : null}

        {card.is_cancelable == "yes" ? (
          <div className={section}>
            <p className={label}>Charge Fee on Cancel</p>
            <p className={value}>{+card.charge_fee_on_cancel / 100} %</p>
          </div>
        ) : null}

        <div className={section}>
          <p className={label}>Start Time</p>
          <p className={value}>
            {new Date(+card.start_time * 1000).toDateString()}
          </p>
        </div>
        {card.max_staking_amount && +card.max_staking_amount > 0 ? (
          <div className={section}>
            <p className={label}>Maximum Stakable Amount</p>
            <p className={value}>
              {normalizeValue(formatUnits(card.max_staking_amount, 18))}{" "}
              {
                coins.find((e) =>
                  eqAddress(e?.contractAddress, card.token_address)
                )?.symbol
              }
            </p>
          </div>
        ) : null}

        <div className={section}>
          <p className={label}>Minimum Stakable Amount</p>
          <p className={value}>
            {normalizeValue(formatUnits(card.min_staking_amount, 18))}{" "}
            {
              coins.find((e) =>
                eqAddress(e?.contractAddress, card.token_address)
              )?.symbol
            }
          </p>
        </div>
      </div>
      {card.metadata?.library?.length ? (
        <div>
          <p className={label}>Project Metadata</p>
          <div className="grid w-full items-center gap-5 fsm:grid-cols-2 fsm:gap-10 fmd:grid-cols-3 flg:grid-cols-4">
            {card.metadata.library.map((data: metaDataType, index: number) => (
              <div
                className="gradient-border-3 col-span-2 mt-[6px] flex h-[72px] flex-col items-center justify-center rounded-[10px] p-[1px] fsm:col-span-1"
                key={index}
              >
                <p className="textGradient text-xs font-medium">{data.title}</p>
                <p className={value}>{data.data}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {card.liquidity_pool_provided == "no" ? (
        <div
          className="mt-2 flex items-center rounded-xl bg-[#cf121228] p-6  px-4 py-3 text-sm text-[#fd4040]"
          role="alert"
        >
          <p>Warning! This staking pool does not provide Liquidity pool.</p>
        </div>
      ) : null}
    </div>
  );
};

export default GridLayoutCard;

const label = `text-sm text-gray-shade-14 mb-[2px]`;
const value = `text-sm font-medium text-white`;
const value2 = `text-sm font-medium text-green-shade-1`;
const section = `col-span-2 fsm:col-span-1`;
