import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Image from "next/image";
import { formatUnits } from "ethers/lib/utils";
import clsx from "clsx";
import { FiArrowUpRight } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { formatIPFSUrl } from "@/utils/format.address";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { eqAddress } from "@/live/utils/address.utils";
import { ArrowDiagonal, GradientCopy, Staking } from "@/assets/svgs";
import { BlockchainConfig } from "@/web3/blockchain/config";
import Button from "@/components/button";
import { CentherStaking } from "@/staking";
import { OptionalType } from "@/staking/types";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import useUser from "@/hooks/use.user";
import { claimPeriodOptions, stakingPeriodOptions } from "../constants";
import { ListCardDataOBj } from "./list-card-data";
import ListCardSpacing from "./list-card-spacing";
import StakedLiquidity from "./staked-liquidity";

export interface ListCardProps {
  card: ListCardDataOBj;
  coins: Array<CoinDetails | undefined>;
  sdk: OptionalType<CentherStaking>;
}

const GridLayoutCard: React.FC<ListCardProps> = ({ card, coins, sdk }) => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const [stakingPool, setStakingPool] = useState<ListCardDataOBj | null>(null);

  useEffect(() => {
    if (!loggedInUser) return;

    sdk?.getProject(+card.id, loggedInUser._id).then((pool) => {
      if (!pool) return;
      const mappedPools = setupUiModels([pool]);
      setStakingPool(mappedPools[0]);
    });
  }, [sdk, card, loggedInUser]);

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl bg-black-shade-9 p-4">
      <div className="h-[180px] w-full">
        <Image
          src={
            card.metadata?.banner?.length
              ? formatIPFSUrl("ipfs:" + card.metadata.banner)
              : "/images/profile-header-cover.jpg"
          }
          alt="token-address-symbol"
          width={1040}
          height={360}
          quality={100}
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>
      <div className="flex w-full items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <Image
            src={
              card.metadata
                ? formatIPFSUrl("ipfs:" + card.metadata.icon)
                : "/images/profile-header-cover.jpg"
            }
            alt="token-address-symbol"
            width={112}
            height={112}
            quality={100}
            className="h-11 w-11 flex-shrink-0 rounded-full object-cover fsm:h-12  fsm:w-12 fmd:h-14 fmd:w-14"
          />
          <div>
            <p className="text-sm font-semibold text-white flg:text-base">
              {card.pack}
            </p>

            <div
              className={clsx(
                "mt-1.5 w-fit text-xs font-medium",
                card.is_active ? "text-[#76E268]" : "textGradient"
              )}
            >
              {card.is_active ? "Active" : "Unbalanced"}
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          className="hidden flex-shrink-0 px-3 text-xs font-medium fxm:block"
          title="Project Details"
          borderRounded="10px"
          onClick={() => router.push("/staking/staking-details/" + card.id)}
        />
        <span
          className="flex h-6 w-6 flex-shrink-0 fxm:hidden"
          onClick={() => router.push("/staking/staking-details/" + card.id)}
        >
          <ArrowDiagonal />
        </span>
      </div>
      <p className="text-base font-semibold text-white">Token Details</p>
      <div className={main}>
        <div className={mainSection}>
          <span className={label}>Token Name</span>
          <span className={value}>
            {
              coins.find((e) =>
                eqAddress(e?.contractAddress, card.token_address)
              )?.name
            }
          </span>
        </div>
        <div className={mainSection}>
          <span className={label}>Token Address</span>
          <span
            className={clsx(
              "word-break flex items-center gap-2 truncate",
              value
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

            <span>{sliceAccountAddress(card.token_address)}</span>
            <GradientCopy
              className="cursor-pointer"
              onClick={async () => {
                await copyText(card.token_address ?? "");
                toast.success("Token address copied!");
              }}
            />
          </span>
        </div>
        <div className={mainSection}>
          <span className={label}>Details</span>
          <span className={value}>
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
                className={`group-hover:text-gradient cursor-pointer text-sm`}
              />
            </a>
          </span>
        </div>
      </div>
      <p className="text-base font-semibold text-white">Pool Details</p>
      <div className={main}>
        <div className={mainSection}>
          <span className={label}>APY</span>
          <span className={value}>{+card.apy / 100} %</span>
        </div>
        <div className={mainSection}>
          <span className={label}>Staking Period</span>
          <span className={value}>
            {
              stakingPeriodOptions.find((e) => e.value == +card.staking_period)
                ?.title
            }
          </span>
        </div>
        <div className={mainSection}>
          <span className={label}>Claim Period</span>
          <span className={value}>
            {
              claimPeriodOptions.find((e) => e.value == +card.claim_period)
                ?.title
            }
          </span>
        </div>
        <ListCardSpacing
          showInfoIcon={card.liquidity_pool_provided === "no" ? true : false}
          title="Liquidity Pool"
          negativeTitle="Not provided"
          positiveTitle="Provided"
          description="This staking pool does not provide Liquidity pool."
        />
        <div className={mainSection}>
          <span className={label}>Burn tax on claim</span>
          <span className={value}>
            {card.burn_tax ? +card.burn_tax / 100 : 0}%{" "}
          </span>
        </div>
        <ListCardSpacing
          showInfoIcon={card.is_cancelable === "no" ? true : false}
          title="Is Cancelable"
          negativeTitle="Irreversible"
          positiveTitle="Reversible"
          description="This staking pool is irreversible, you will be forced to wait
          for the unblocking time specified in the contract once the
          subscription has been activated."
        />

        <div className={mainSection}>
          <span className={label}>Created on</span>
          <span className={value}>
            {dayjs(new Date(Number(+card.start_time) * 1000)).format(
              "DD-MMM-YYYY"
            )}
          </span>
        </div>
        {card.nonRefundable && (
          <ListCardSpacing
            showInfoIcon={true}
            title="Capital Release"
            negativeTitle="Not Refundable"
            positiveTitle=""
            description="All tokens staked in this pool will be used in a minting
          service and will not be refunded at the end of the staking
          period."
          />
        )}
        <div className={mainSection}>
          <span className={label}>Minimum Stakable Amount</span>
          <span className={value}>
            {normalizeValue(formatUnits(card.min_staking_amount, 18))}{" "}
            {
              coins.find((e) =>
                eqAddress(e?.contractAddress, card.token_address)
              )?.symbol
            }
          </span>
        </div>
        {card.multilevel_rewards &&
          card.multilevel_rewards !== "No referral" && (
            <div className={mainSection}>
              <span className={label}>Affiliate Program APY</span>
            </div>
          )}
        {card.multilevel_rewards &&
          card.multilevel_rewards !== "No referral" &&
          card.rewards_level?.length && (
            <div className="grid w-full grid-cols-2 items-center gap-2 fxm:grid-cols-3 flg:grid-cols-4">
              {card.rewards_level.map((e, i: number) => (
                <div
                  className="col-span-1 rounded-full border border-gray-shade-3 px-2 py-1 text-center text-xs font-medium"
                  key={i}
                >
                  <span className="text-gray-shade-14">L {e.level} - </span>
                  <span
                    className={clsx(
                      Number(e.percent) > 0
                        ? "text-white"
                        : "text-gray-shade-14"
                    )}
                  >
                    {(Number(e.percent) / 100) * 12}%
                  </span>
                </div>
              ))}
            </div>
          )}
      </div>
      <p className="text-base font-semibold text-white">Staked Liquidity</p>
      {stakingPool && (
        <StakedLiquidity stakingPool={stakingPool} card={card} coins={coins} />
      )}
    </div>
  );
};

export default GridLayoutCard;

const label = `text-sm text-gray-shade-14`;
const value = `text-sm font-medium text-white flex-shrink-0`;
const mainSection = `flex w-full items-center justify-between gap-5`;
const main = `flex w-full flex-col gap-3.5 rounded-[10px] border border-gray-shade-3 p-4`;
