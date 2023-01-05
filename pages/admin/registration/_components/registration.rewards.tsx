import { adminClaimRegistrationBNB } from "@/web3/utils/call.helpers";
import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const RegistrationRewards = ({
  claimableBNB,
  claimedBNB,
  reload,
  setReload,
}: any) => {
  const { library } = useWeb3React();
  const [pendingTx, setPendingTx] = useState(false);
  const handleClaimBNB = async () => {
    if (claimableBNB <= 0) {
      toast.error("Nothing to Claim!");
      return;
    }

    setPendingTx(true);
    const result = await adminClaimRegistrationBNB(library);
    setPendingTx(false);
    if (result.success) {
      setReload(!reload);
      toast.success("Claimed Successfully!");
    } else {
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <div className="w-full h-auto bg-elevation-1 rounded-[14px] overflow-x-auto">
      <div className="w-full  bg-no-repeat bg-center bg-cover py-7 fsm:pl-7 pl-3 fsm:pr-4 pr-3 rounded-t-[14px] flex fsm:flex-row flex-col fsm:items-center justify-between gap-4 bg-[url(/images/patern1.png)] bg-[#2E2B22] min-w-[800px]">
        <h4 className="text-white font-semibold text-18px">
          Rewards From Registration
        </h4>
      </div>
      <div className="p-6 flex gap-10 md:pl-10 pl-6 md:pr-10 pr-6">
        <div className="w-full f2xl:max-w-[338px] min-w-[200px]  max-w-[338px] border-r-2 border-black-shade-7  ">
          <div className="uppercase text-xs font-semibold text-gray-shade-7">
            Total earnings
          </div>
          <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
            <p className="text-white">{claimableBNB + claimedBNB} (BNB)</p>
          </div>
        </div>
        <div className="w-full f2xl:max-w-[338px] min-w-[200px]  max-w-[338px] border-r-2 border-black-shade-7 ">
          <div className="text-xs font-semibold text-gray-shade-7 uppercase">
            Claimed
          </div>
          <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
            <p className="text-white">{claimedBNB} (BNB)</p>
          </div>
        </div>
        <div className="w-full f2xl:max-w-[338px] min-w-[200px]  max-w-[338px]">
          <div className="text-xs font-semibold text-gray-shade-7 uppercase">
            Claimable
          </div>
          <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2 justify-between">
            <p className="text-white">{claimableBNB} (BNB)</p>
            <button
              // className="text-brand-primary text-12px font-semibold "
              className="text-black-shade-3 text-12px font-semibold p-3 w-full bg-yellow-theme rounded-lg max-w-[120px]"
              onClick={handleClaimBNB}
              disabled={pendingTx}
            >
              {pendingTx ? "Claiming..." : "Claim now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationRewards;
