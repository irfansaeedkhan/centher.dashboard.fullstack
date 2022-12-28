import useUser from "@/hooks/use.user";
import { formatAddress } from "@/utils/format.address";
import React from "react";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { useCopyToClipboard } from "usehooks-ts";

const WalletSection = ({ data }: any) => {
  const { user: loggedInUser } = useUser();

  const [_, copy] = useCopyToClipboard();

  return (
    <div className="w-full flex md:flex-row flex-col gap-6">
      <div className="w-full max-w-[810px] bg-elevation-1 rounded-[14px] h-[198px]">
        <div className="h-1/2 py-5 px-6 bg-[url(/images/liscense4.png)] rounded-t-[14px] bg-no-repeat bg-cover bg-transparent bg-center space-y-1 flex flex-col justify-center">
          <div className="text-sm font-semibold leading-6 text-gray-shade-7 flex justify-between items-center gap-10">
            <p>YOUR WALLET</p>
            <p className="text-right">Total members in your network</p>
          </div>
          <div className="text-sm font-semibold leading-6 text-white flex justify-between items-center gap-10">
            <p>{formatAddress(loggedInUser?.account_address)}</p>
            <p>{data.people}</p>
          </div>
        </div>
        <div className="h-1/2 py-5 px-6 bg-elevation-1 rounded-b-[14px] space-y-1 flex flex-col justify-center">
          <div className="text-sm font-semibold leading-6 text-gray-shade-7 flex justify-between items-center gap-10">
            <p>LAUNCHPAD</p>
            <p>MARKETPALCE</p>
          </div>
          <div className="text-sm font-semibold leading-6 text-white flex justify-between items-center gap-10">
            <p>{`${data.busd} (BUSD) ${data.ntr} (NTR)`}</p>
            <p>{`${data.bnb} (BNB)`}</p>
          </div>
        </div>
      </div>
      <div className="md:max-w-[310px] max-w-full w-full md:bg-[url(/images/network-reward-bg.svg)] sm:bg-[url(/images/network-reward-bg-sm.svg)] bg-[url(/images/network-reward-bg.svg)] md:h-[198px] sm:h-[175px] h-[198px] rounded-[14px] bg-no-repeat bg-cover flex flex-grow bg-transparent py-6 px-5 flex-col justify-between">
        <h5 className="text-xl font-bold text-white leading-6">
          Earn from your strong network
        </h5>
        <p className="text-white text-xs font-semibold leading-[14.63px] md:mt-3 md:mb-3 sm:mt-4 sm:mb-6 mt-3 mb-3">
          Invite your friend with your referral link to earn money.
        </p>
        <div className="w-full rounded-xl p-2 bg-white/[0.07] border border-white/20 backdrop-blur-md h-[52px] flex items-center justify-between gap-2">
          <p className="w-full max-w-[210px] font-semibold text-xs text-white truncate">
            {`${window.location.origin}/auth/register?`}
          </p>
          <button
            className="h-9 w-9 rounded-lg p-2 bg-white/20 backdrop-blur-[18px]"
            onClick={() => {
              copy(
                window.location.origin +
                  "/auth/register?referred_by=" +
                  loggedInUser?.account_address
              );
              toast.success("Referral link copied!");
            }}
          >
            <FiCopy className="text-white text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
