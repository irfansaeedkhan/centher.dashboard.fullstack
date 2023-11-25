import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { formatUnits } from "ethers/lib/utils";
import { useFloating, useHover, useInteractions } from "@floating-ui/react";
import clsx from "clsx";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiArrowUpRight, FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { formatIPFSUrl } from "@/utils/format.address";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { eqAddress } from "@/live/utils/address.utils";
import { Staking } from "@/assets/svgs";
import { BlockchainConfig } from "@/web3/blockchain/config";
import Button from "@/components/button";
import { claimPeriodOptions, stakingPeriodOptions } from "../constants";
import { metaDataType } from "./staking-types";
import { ListCardDataOBj } from "./list-card-data";

export interface ListCardProps {
  card: ListCardDataOBj;
  coins: Array<CoinDetails | undefined>;
}

const GridLayoutCard: React.FC<ListCardProps> = ({ card, coins }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <div className="flex w-full max-w-full flex-col gap-5 rounded-2xl bg-elevation-1 p-5 fsm:p-8">
      <div
        className="relative h-[200px] w-full rounded-2xl bg-[url(/images/profile-header-cover.jpg)] bg-cover bg-center"
        style={{
          backgroundImage: card.metadata?.banner?.length
            ? `url(${formatIPFSUrl("ipfs:" + card.metadata.banner)})`
            : "url(/images/profile-header-cover.jpg)",
        }}
      ></div>
      <div className="xs:block w-full gap-6 sm:flex sm:justify-between">
        <div className="flex items-center gap-4">
          <div>
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
          </div>
          <div>
            <p className="text-xl font-bold text-white">{card.pack}</p>

            <div
              className={clsx(
                "mt-1 w-fit text-sm font-semibold",
                card.is_active ? "text-[#76E268]" : "textGradient"
              )}
            >
              {card.is_active ? "Active" : "Unbalanced"}
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-4 sm:visible sm:flex">
          <Button
            variant="primary"
            className="xs:w-full h-9 text-[12px]"
            title="View project detail"
            borderRounded="10px"
            onClick={() => router.push("/staking/staking-details/" + card.id)}
          />
        </div>
      </div>

      <div className="border-b-2 border-gray-shade-3 "></div>
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
              <span className={`text-gradient-hover text-xs text-gray-shade-7`}>
                View on {BlockchainConfig.scanner.name}
              </span>
              <FiArrowUpRight
                className={`cursor-pointer text-sm group-hover:text-brand-primary`}
              />
            </a>
          </p>
        </div>
      </div>
      {!eqAddress(card.token_address, card.reward_token_address) && (
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
                  className={`text-gradient-hover text-xs text-gray-shade-7`}
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
        {card.burn_tax && +card.burn_tax > 0 && (
          <div className={section}>
            <div className="flex">
              <p className={label}>Burn Tax on claim </p>
              {/* <AiOutlineInfoCircle className="ml-1 mt-1 h-4 w-4 text-sky-400 hover:text-white" /> */}
            </div>
            <p className={value}>
              {card.burn_tax ? +card.burn_tax / 100 : 0}%{" "}
            </p>
          </div>
        )}
        <div className={section}>
          <p className={label}>Start Time</p>
          <p className={value}>
            {new Date(+card.start_time * 1000).toDateString()}
          </p>
        </div>
        {card.is_cancelable == "yes" ? (
          <div className={section}>
            <p className={label}>Charge Fee on Cancel</p>
            <p className={value}>{+card.charge_fee_on_cancel / 100} %</p>
          </div>
        ) : null}
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
      <div className="mt-9"></div>

      {card.liquidity_pool_provided == "no" && (
        <div className={section}>
          <div className="flex">
            <p
              ref={refs.setReference}
              {...getReferenceProps()}
              className="relative"
            >
              <AiOutlineInfoCircle className="mr-1 h-4 w-4 min-w-min text-orange-600 hover:text-white" />

              {isOpen && (
                <div
                  className="absolute bottom-6 w-[300px] rounded-lg border border-gray-shade-3 bg-elevation-1 p-3 text-xs text-gray-shade-14 shadow-lg"
                  ref={refs.setFloating}
                  {...getFloatingProps()}
                >
                  Some projects need an open liquidity pool to utilise the funds
                  staked by users and generate profits to be shared. Other times
                  an open liquidity pool indicates a favourable ground for a
                  scam. That is why you ALWAYS Do Your Own Research before
                  investing.
                </div>
              )}
            </p>
            <p className={label}>
              This staking pool does not provide Liquidity pool.
            </p>
          </div>
        </div>
      )}

      {card.is_cancelable == "no" && (
        <div className={section}>
          <div className="flex">
            <AiOutlineInfoCircle className="mr-1 h-4 w-4 min-w-min text-orange-600 hover:text-white" />
            <p className={label}>
              This staking pool is <strong>irreversible</strong>, you will be
              forced to wait for the unblocking time specified in the contract
              once the subscription has been activated.
            </p>
          </div>
        </div>
      )}

      {card.nonRefundable && (
        <div className={section}>
          <div className="flex">
            <AiOutlineInfoCircle className="mr-1 min-w-min text-orange-600 hover:text-white" />

            <p className={label}>
              All tokens staked in this pool will be used in a minting service
              and will not be refunded at the end of the staking period.
            </p>
          </div>
        </div>
      )}

      <div className="visible items-center gap-4 sm:hidden">
        <Button
          variant="primary"
          className="h-10 w-full text-[14px]"
          title="View project detail"
          borderRounded="10px"
          onClick={() => router.push("/staking/staking-details/" + card.id)}
        />
      </div>
    </div>
  );
};

export default GridLayoutCard;

const label = `text-sm text-gray-shade-14 mb-[2px]`;
const value = `text-sm font-medium text-white`;
const value2 = `text-sm font-medium text-green-shade-1`;
const section = `col-span-2 fsm:col-span-1`;
