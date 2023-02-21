import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";

import { formatAddress } from "@/utils/format.address";
import useUser from "@/hooks/use.user";
import { copyText } from "@/utils/copy.text";
import { normalizeValue } from "@/web3/utils/call.helpers";

const WalletSection = ({ data }: any) => {
  const { user: loggedInUser } = useUser();
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    setReferralLink(
      `${window.location.origin}/auth/register?referred_by=${loggedInUser?.account_address}`
    );
  }, [loggedInUser?.account_address]);

  return (
    <div className="flex w-full flex-col gap-6 md:flex-row">
      <div className="h-[198px] w-full max-w-[810px] rounded-[14px] bg-elevation-1">
        <div className="flex h-1/2 flex-col justify-center space-y-1 rounded-t-[14px] bg-transparent bg-[url(/images/liscense4.png)] bg-cover bg-center bg-no-repeat py-5 px-6">
          <div className="flex items-center justify-between gap-10 text-sm font-semibold leading-6 text-gray-shade-7">
            <p>YOUR WALLET</p>
            <p className="text-right">Total members in your network</p>
          </div>
          <div className="flex items-center justify-between gap-10 text-sm font-semibold leading-6 text-white">
            <p>{formatAddress(loggedInUser?.account_address)}</p>
            <p>{data.people}</p>
          </div>
        </div>
        <div className="flex h-1/2 flex-col justify-center space-y-1 rounded-b-[14px] bg-elevation-1 py-5 px-6">
          <div className="flex items-center justify-between gap-10 text-sm font-semibold leading-6 text-gray-shade-7">
            <p>LAUNCHPAD</p>
            <p>MARKETPALCE</p>
          </div>
          <div className="flex items-center justify-between gap-10 text-sm font-semibold leading-6 text-white">
            <p>{`${data.busd} (BUSD) ${data.ntr} (NTR)`}</p>
            <p> {`${normalizeValue(Number(data.bnb))} (BNB)`}</p>
          </div>
        </div>
      </div>
      <div className="flex h-[198px] w-full max-w-full flex-grow flex-col justify-between rounded-[14px] bg-transparent bg-[url(/images/network-reward-bg.svg)] bg-cover bg-no-repeat py-6 px-5 sm:h-[175px] sm:bg-[url(/images/network-reward-bg-sm.svg)] md:h-[198px] md:max-w-[310px] md:bg-[url(/images/network-reward-bg.svg)]">
        <h5 className="text-xl font-bold leading-6 text-white">
          Earn from your strong network
        </h5>
        <p className="mt-3 mb-3 text-xs font-semibold leading-[14.63px] text-white sm:mt-4 sm:mb-6 md:mt-3 md:mb-3">
          Invite your friend with your referral link to earn money.
        </p>
        <div className="flex h-[52px] w-full items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/[0.07] p-2 backdrop-blur-md">
          <p className="w-full max-w-[210px] truncate text-xs font-semibold text-white">
            {referralLink}
          </p>
          <button
            className="h-9 w-9 rounded-lg bg-white/20 p-2 backdrop-blur-[18px]"
            onClick={async () => {
              await copyText(
                window.location.origin +
                  "/auth/register?referred_by=" +
                  loggedInUser?.account_address
              );
              toast.success("Referral link copied!");
            }}
          >
            <FiCopy className="text-xl text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
