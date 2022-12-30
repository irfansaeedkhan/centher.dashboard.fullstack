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
    <div className="w-full h-auto bg-elevation-1 rounded-[14px] overflow-x-auto">
      <div className="w-full  bg-no-repeat bg-center bg-cover py-7 fsm:pl-7 pl-3 fsm:pr-4 pr-3 rounded-t-[14px] flex fsm:flex-row flex-col fsm:items-center justify-between gap-4 bg-[url(/images/patern1.png)] bg-[#2E2B22] min-w-[800px]">
        <h4 className="text-white font-semibold text-18px">
          Core Team Rewards
        </h4>
      </div>
      <div className="p-6 flex gap-10 md:pl-10 pl-6 md:pr-10 pr-6">
        <div className="w-full f2xl:max-w-[338px] min-w-[200px]  max-w-[338px] border-r-2 border-black-shade-7  ">
          <div className="uppercase text-xs font-semibold text-gray-shade-7">
            Total earnings
          </div>
          <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
            <p className="text-white">{data.totalEarning.busd} (BUSD)</p>
          </div>
          <div className="flex items-center text-sm font-semibold gap-2">
            <p className="text-white">{data.totalEarning.ntr} (NTR)</p>
          </div>
        </div>
        <div className="w-full f2xl:max-w-[338px] min-w-[200px]  max-w-[338px] border-r-2 border-black-shade-7 ">
          <div className="text-xs font-semibold text-gray-shade-7 uppercase">
            Claimed
          </div>
          <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
            <p className="text-white">{data.claimed.busd} (BUSD)</p>
          </div>
          <div className="flex items-center text-sm font-semibold gap-2">
            <p className="text-white">{data.claimed.ntr} (NTR)</p>
          </div>
        </div>
        <div className="w-full f2xl:max-w-[338px] min-w-[200px]  max-w-[338px]">
          <div className="text-xs font-semibold text-gray-shade-7 uppercase">
            Claimable
          </div>
          <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2 justify-between">
            <p className="text-white">{data.claimable.busd} (BUSD)</p>
            <button
              className="text-brand-primary text-12px font-semibold "
              onClick={handleClaimBusd}
            >
              Claim now
            </button>
          </div>
          <div className="flex items-center text-sm font-semibold gap-2  justify-between">
            <p className="text-white">{data.claimable.ntr} (NTR)</p>
            <button
              className="text-brand-primary text-12px font-semibold "
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
