import { formatNum2DispNum } from "@/utils/format.address";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
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
    try {
      await BlockchainWrite.adminClaimRegistrationBNB(library);
      setReload(!reload);
      toast.success("Claimed Successfully!");
    } catch (error) {
      toast.error("Something Went Wrong!");
    } finally {
      setPendingTx(false);
    }
  };

  return (
    <div className="h-auto w-full overflow-x-auto rounded-[14px] bg-elevation-1">
      <div className="flex  w-full min-w-[800px] flex-col justify-between gap-4 rounded-t-[14px] bg-[#2E2B22] bg-[url(/images/patern1.png)] bg-cover bg-center bg-no-repeat py-7 pl-3 pr-3 fsm:flex-row fsm:items-center fsm:pl-7 fsm:pr-4">
        <h4 className="text-18px font-semibold text-white">
          Rewards From Registration
        </h4>
      </div>
      <div className="flex gap-10 p-6 pl-6 pr-6 md:pl-10 md:pr-10">
        <div className="w-full min-w-[200px] max-w-[338px]  border-r-2 border-black-shade-7 f2xl:max-w-[338px]  ">
          <div className="text-xs font-semibold uppercase text-gray-shade-7">
            Total earnings
          </div>
          <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
            <p className="text-white">
              {`${normalizeValue(
                formatNum2DispNum(claimableBNB + claimedBNB)
              )} (BNB)`}
            </p>
          </div>
        </div>
        <div className="w-full min-w-[200px] max-w-[338px]  border-r-2 border-black-shade-7 f2xl:max-w-[338px] ">
          <div className="text-xs font-semibold uppercase text-gray-shade-7">
            Claimed
          </div>
          <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
            <p className="text-white">
              {`${normalizeValue(formatNum2DispNum(claimedBNB))} (BNB)`}
            </p>
          </div>
        </div>
        <div className="w-full min-w-[200px] max-w-[338px]  f2xl:max-w-[338px]">
          <div className="text-xs font-semibold uppercase text-gray-shade-7">
            Claimable
          </div>
          <div className="mt-4 mb-3 flex items-center justify-between gap-2 text-sm font-semibold">
            <p className="text-white">
              {`${normalizeValue(formatNum2DispNum(claimableBNB))} (BNB)`}
            </p>
            <button
              // className="text-brand-primary text-12px font-semibold "
              className="text-12px bg-yellow-theme w-full max-w-[120px] rounded-lg p-3 font-semibold text-black-shade-3"
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
