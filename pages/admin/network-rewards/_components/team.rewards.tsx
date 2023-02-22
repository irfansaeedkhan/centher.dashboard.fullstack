import {
  adminCallClaimBusdForCoreTeam,
  adminCallClaimNtrForCoreTeam,
} from "@/web3/utils/call.helpers";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { toast } from "react-hot-toast";

const TeamRewards = ({ data, reload, setReload }: any) => {
  const { library } = useWeb3React();
  const handleClaimBusd = async () => {
    if (data.claimable.busd <= 0) {
      toast.error("Nothing to Claim!");
      return;
    }
    const result = await adminCallClaimBusdForCoreTeam(library);
    if (result.success) {
      setReload(!reload);
    } else {
      toast.error("Something Went Wrong!");
    }
  };
  const handleClaimNtr = async () => {
    if (data.claimable.ntr <= 0) {
      toast.error("Nothing to Claim!");
      return;
    }
    const result = await adminCallClaimNtrForCoreTeam(library);
    if (result.success) {
      setReload(!reload);
    } else {
      toast.error("Something Went Wrong!");
    }
  };
  return (
    <div className="h-auto w-full overflow-x-auto rounded-[14px] bg-elevation-1">
      <div className="flex  w-full min-w-[800px] flex-col justify-between gap-4 rounded-t-[14px] bg-[#2E2B22] bg-[url(/images/patern1.png)] bg-cover bg-center bg-no-repeat py-7 pl-3 pr-3 fsm:flex-row fsm:items-center fsm:pl-7 fsm:pr-4">
        <h4 className="text-18px font-semibold text-white">
          Core Team Rewards
        </h4>
      </div>
      <div className="flex gap-10 p-6 pl-6 pr-6 md:pl-10 md:pr-10">
        <div className="w-full min-w-[200px] max-w-[338px]  border-r-2 border-black-shade-7 f2xl:max-w-[338px]  ">
          <div className="text-xs font-semibold uppercase text-gray-shade-7">
            Total earnings
          </div>
          <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
            <p className="text-white">{data.totalEarning.busd} (BUSD)</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <p className="text-white">{data.totalEarning.ntr} (NTR)</p>
          </div>
        </div>
        <div className="w-full min-w-[200px] max-w-[338px]  border-r-2 border-black-shade-7 f2xl:max-w-[338px] ">
          <div className="text-xs font-semibold uppercase text-gray-shade-7">
            Claimed
          </div>
          <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
            <p className="text-white">{data.claimed.busd} (BUSD)</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <p className="text-white">{data.claimed.ntr} (NTR)</p>
          </div>
        </div>
        <div className="w-full min-w-[200px] max-w-[338px]  f2xl:max-w-[338px]">
          <div className="text-xs font-semibold uppercase text-gray-shade-7">
            Claimable
          </div>
          <div className="mt-4 mb-3 flex items-center justify-between gap-2 text-sm font-semibold">
            <p className="text-white">{data.claimable.busd} (BUSD)</p>
            <button
              className="text-12px font-semibold text-brand-primary "
              onClick={handleClaimBusd}
            >
              Claim now
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm  font-semibold">
            <p className="text-white">{data.claimable.ntr} (NTR)</p>
            <button
              className="text-12px font-semibold text-brand-primary "
              onClick={handleClaimNtr}
            >
              Claim now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRewards;
