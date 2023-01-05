import { useGetReferralRate } from "@/web3/hooks/use.get.referral.rates";
import {
  adminChangeCompanyAddress,
  adminChangeCoreTeamAddress,
  adminChangeReferralRate,
} from "@/web3/utils/call.helpers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const CommonCard = ({ refreshRoundsInfo }: any) => {
  const { library } = useWeb3React();
  const [rates, setRates] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [coreTeamPercentage, setCoreTeamPercentage] = useState(0);
  const [coreTeamAddress, setCoreTeamAddress] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const [pendingTeamAddressTx, setPendingTeamAddressTx] = useState(false);
  const [pendingCompanyAddressTx, setPendingCompanyAddressTx] = useState(false);
  const [pendingReferralRateTx, setPendingReferralRateTx] = useState(false);

  const info = useGetReferralRate();

  useEffect(() => {
    if (info) {
      setRates(info.rates);
      setCoreTeamAddress(info.coreTeamAddress);
      setCompanyAddress(info.companyAddress);
    }
  }, [info]);

  const handleReferralRate = async () => {
    setPendingReferralRateTx(true);
    const result = await adminChangeReferralRate(library, rates);
    setPendingReferralRateTx(false);
    if (result.success) {
      toast.success("Changed Referral Percentage Successfully");
    } else {
      toast.error("Something Went Wrong! Please try again.");
    }
  };

  const handleTeamPercentage = async () => {};

  const handleCoreTeamAddress = async () => {
    setPendingTeamAddressTx(true);
    const result = await adminChangeCompanyAddress(library, coreTeamAddress);
    setPendingTeamAddressTx(false);
    if (result.success) {
      toast.success("Changed Core Team Address Successfully");
    } else {
      toast.error("Something Went Wrong! Please try again.");
    }
  };

  const handleCompanyAddress = async () => {
    setPendingCompanyAddressTx(true);
    const result = await adminChangeCoreTeamAddress(library, companyAddress);
    setPendingCompanyAddressTx(false);
    if (result.success) {
      toast.success("Changed Company Address Successfully");
    } else {
      toast.error("Something Went Wrong! Please try again.");
    }
  };

  const handleSetRate = (newValue: any, index: number) => {
    let _rates = rates.slice();
    _rates[index] = newValue;
    setRates(_rates);
  };

  return (
    <div className="card bg-elevation-1 rounded-xl max-w-[470px] overflow-hidden flex flex-col ">
      <div className="cardHeader flex items-center justify-between bg-elevation-2 p-5">
        <h2 className="cardTitle text-gray-shade-7 text-14px font-semibold">
          Set Referral Rate
        </h2>
      </div>
      <div className="cardBody py-6 px-5">
        <div className="flex flex-col gap-5">
          {rates &&
            rates.map((item: any, index: number) => {
              return (
                <div
                  className="flex items-center justify-between gap-3"
                  key={index}
                >
                  <label className="label text-gray-shade-7 text-14px">
                    Level {index + 1}
                  </label>
                  <div className=" flex gap-2 flex-col min-w-[180px]">
                    <div className="checkbox flex items-center justify-end gap-2">
                      <input
                        id="BUSD"
                        value={item}
                        onChange={(e) => {
                          handleSetRate(e.target.value, index);
                        }}
                        type="number"
                        className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[180px]"
                      />
                      <h6 className="text-gray-shade-7 text-14px">%</h6>
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="cardFooter pt-4 pb-7 px-5">
            <button
              className="text-black-shade-3 text-14px font-semibold p-3 w-full bg-yellow-theme rounded-lg"
              onClick={handleReferralRate}
            >
              {pendingReferralRateTx
                ? "Updating..."
                : "Set Referral Percentage"}
            </button>
          </div>
          {/* <div className="flex items-center justify-between gap-3">
            <label className="label text-gray-shade-7 text-14px">Core Team Percentage</label>
            <div className=" flex gap-2 flex-col min-w-[180px]">
              <div className="checkbox flex items-center justify-end gap-2">
                <input
                  id="BUSD"
                  value={coreTeamPercentage}
                  onChange={(e) => setCoreTeamPercentage(Number(e.target.value))}
                  type="number"
                  className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[180px]"
                />
                <h6 className="text-gray-shade-7 text-14px">%</h6>
              </div>
            </div>
          </div>
          <div className="cardFooter pt-4 pb-7 px-5">
            <button
              className="text-black-shade-3 text-14px font-semibold p-3 w-full bg-yellow-theme rounded-lg"
              onClick={handleTeamPercentage}
            >
              {pendingTx ? "Updating..." : "Change Core Team Percentage"}
            </button>
          </div> */}

          <div className="flex items-center justify-between">
            <label className="label text-gray-shade-7 text-14px">
              Company Address
            </label>
            <div className=" flex gap-2 flex-col min-w-[50px]">
              <div className="checkbox flex items-center justify-end gap-2">
                <input
                  id="BUSD"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  type="text"
                  className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[280px]"
                />
              </div>
            </div>
          </div>
          <div className="cardFooter pt-4 pb-7 px-5">
            <button
              className="text-black-shade-3 text-14px font-semibold p-3 w-full bg-yellow-theme rounded-lg"
              onClick={handleCompanyAddress}
            >
              {pendingCompanyAddressTx
                ? "Updating..."
                : "Change Company Address"}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="label text-gray-shade-7 text-14px">
              Core Team Address
            </label>
            <div className=" flex gap-2 flex-col min-w-[180px]">
              <div className="checkbox flex items-center justify-end gap-2">
                <input
                  id="BUSD"
                  value={coreTeamAddress}
                  onChange={(e) => setCoreTeamAddress(e.target.value)}
                  type="text"
                  className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[280px]"
                />
              </div>
            </div>
          </div>
          <div className="cardFooter pt-4 pb-7 px-5">
            <button
              className="text-black-shade-3 text-14px font-semibold p-3 w-full bg-yellow-theme rounded-lg"
              onClick={handleCoreTeamAddress}
            >
              {pendingTeamAddressTx
                ? "Updating..."
                : "Change Core Team Address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
