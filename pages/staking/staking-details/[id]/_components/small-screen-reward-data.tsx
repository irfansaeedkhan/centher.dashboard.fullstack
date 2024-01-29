import React from "react";
import dayjs from "dayjs";
import { RefReward } from "@/staking/types/ref.rewards.interface";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { formatUnits } from "ethers/lib/utils";

const SmallScreenRewardData: React.FC<{
  data: RefReward[];
  token: string;
  decimals: string;
}> = ({ data, token, decimals }) => {
  const Check_Reward_Form_TransactionHash = (reward: RefReward) => {
    return (
      <a
        href={`${BlockchainConfig.scanner.url}/tx/${
          reward.txId.endsWith("-1") ? reward.txId.slice(0, -2) : reward.txId
        }`}
        target="_blank"
        rel="noreferrer noopener"
        className="text-gradient-hover"
      >
        {reward.txId.slice(0, 6)}...
        {reward.txId.endsWith("-1")
          ? reward.txId.slice(-6, -2)
          : reward.txId.slice(-4)}
      </a>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {data.map((e: RefReward, i: number) => (
        <div className="flex w-full flex-col gap-2" key={i}>
          <div className={main}>
            <p className={text}>Date</p>
            <p className={text2}>
              {dayjs(new Date(Number(+e.createdAt) * 1000)).format(
                "DD-MMM-YYYY"
              )}
            </p>
          </div>
          <div className={main}>
            <p className={text}>Referrals</p>
            <p className={text2}>
              {e.user.slice(0, 6)}...
              {e.user.slice(-4)}
            </p>
          </div>
          <div className={main}>
            <p className={text}>Transaction Hash</p>
            <p className={text2}>{Check_Reward_Form_TransactionHash(e)}</p>
          </div>
          <div className={main}>
            <p className={text}>Amount</p>
            <p className={text2}>
              {" "}
              {Number(
                formatUnits(+e.amount + +e.paidTax + "", decimals)
              ).toFixed(3)}{" "}
              {token}
            </p>
          </div>
          {+e?.paidTax > 0 && (
            <div className={main}>
              <p className={text}>Tax Amount</p>
              <p className={text2}>
                {Number(formatUnits(e.paidTax, decimals)).toFixed(3)} {token}
              </p>
            </div>
          )}
          {+e?.amount > 0 && (
            <div className={main}>
              <p className={text}>Profit</p>
              <p className={text2}>
                {Number(formatUnits(e.amount, decimals)).toFixed(3)} {token}
              </p>
            </div>
          )}
          {data.length - 1 !== i && (
            <hr className="my-2 border border-gray-shade-3" />
          )}
        </div>
      ))}
      {!data?.length && (
        <span className="flex h-20 w-full !min-w-full items-center justify-center rounded-bl-xl text-center text-gray-shade-7">
          No record found!
        </span>
      )}
    </div>
  );
};

export default SmallScreenRewardData;

const main = "flex w-full items-center justify-between gap-4";
const text = "fxm:text-sm text-xs font-medium text-gray-shade-14";
const text2 = "fxm:text-sm text-xs font-medium text-white flex-shrink-0";
