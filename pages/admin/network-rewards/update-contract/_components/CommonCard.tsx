import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useGetReferralRate } from "@/web3/hooks/use.get.referral.rates";
import { BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";

export const CommonCard = ({ refreshRoundsInfo }: any) => {
  const { getSigner } = useWallet();
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
    try {
      await BlockchainWrite.adminChangeReferralRate(getSigner()!, rates);
      toast.success("Changed Referral Percentage Successfully");
    } catch (error) {
      toast.error("Something Went Wrong! Please try again.");
    } finally {
      setPendingReferralRateTx(false);
    }
  };

  const handleCoreTeamAddress = async () => {
    setPendingTeamAddressTx(true);
    try {
      await BlockchainWrite.adminChangeCompanyAddress(
        getSigner()!,
        coreTeamAddress
      );
      toast.success("Changed Core Team Address Successfully");
    } catch (error) {
      toast.error("Something Went Wrong! Please try again.");
    } finally {
      setPendingTeamAddressTx(false);
    }
  };

  const handleCompanyAddress = async () => {
    setPendingCompanyAddressTx(true);
    try {
      await BlockchainWrite.adminChangeCoreTeamAddress(
        getSigner()!,
        companyAddress
      );
      toast.success("Changed Company Address Successfully");
    } catch (error) {
      toast.error("Something Went Wrong! Please try again.");
    } finally {
      setPendingCompanyAddressTx(false);
    }
  };

  const handleSetRate = (newValue: any, index: number) => {
    let _rates = rates.slice();
    _rates[index] = newValue;
    setRates(_rates);
  };

  return (
    <div className="card flex max-w-[470px] flex-col overflow-hidden rounded-xl bg-elevation-1 ">
      <div className="cardHeader flex items-center justify-between bg-elevation-2 p-5">
        <h2 className="cardTitle text-sm font-semibold text-gray-shade-7">
          Set Referral Rate
        </h2>
      </div>
      <div className="cardBody px-5 py-6">
        <div className="flex flex-col gap-5">
          {rates &&
            rates.map((item: any, index: number) => {
              return (
                <div
                  className="flex items-center justify-between gap-3"
                  key={index}
                >
                  <label className="label text-sm text-gray-shade-7">
                    Level {index + 1}
                  </label>
                  <div className="flex min-w-[180px] flex-col gap-2">
                    <div className="checkbox flex items-center justify-end gap-2">
                      <input
                        id="BUSD"
                        value={item}
                        onChange={(e) => {
                          handleSetRate(e.target.value, index);
                        }}
                        type="number"
                        className="focus:ring-yellow-theme w-full max-w-[180px] rounded-md border-0 !bg-black-shade-3 px-3 py-3 text-sm font-semibold text-white focus:outline-none"
                      />
                      <h6 className="text-sm text-gray-shade-7">%</h6>
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="cardFooter px-5 pb-7 pt-4">
            <button
              className="w-full rounded-lg bg-brand-primary p-3 text-sm font-semibold text-black-shade-3"
              onClick={handleReferralRate}
            >
              {pendingReferralRateTx
                ? "Updating..."
                : "Set Referral Percentage"}
            </button>
          </div>
          {/* <div className="flex items-center justify-between gap-3">
            <label className="label text-gray-shade-7 text-sm">Core Team Percentage</label>
            <div className=" flex gap-2 flex-col min-w-[180px]">
              <div className="checkbox flex items-center justify-end gap-2">
                <input
                  id="BUSD"
                  value={coreTeamPercentage}
                  onChange={(e) => setCoreTeamPercentage(Number(e.target.value))}
                  type="number"
                  className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-sm  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[180px]"
                />
                <h6 className="text-gray-shade-7 text-sm">%</h6>
              </div>
            </div>
          </div>
          <div className="cardFooter pt-4 pb-7 px-5">
            <button
              className="text-black-shade-3 text-sm font-semibold p-3 w-full bg-brand-primary rounded-lg"
              onClick={handleTeamPercentage}
            >
              {pendingTx ? "Updating..." : "Change Core Team Percentage"}
            </button>
          </div> */}

          <div className="flex items-center justify-between">
            <label className="label text-sm text-gray-shade-7">
              Company Address
            </label>
            <div className=" flex min-w-[50px] flex-col gap-2">
              <div className="checkbox flex items-center justify-end gap-2">
                <input
                  id="BUSD"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  type="text"
                  className="focus:ring-yellow-theme w-full max-w-[280px] rounded-md border-0 !bg-black-shade-3 px-3 py-3 text-sm font-semibold text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="cardFooter px-5 pb-7 pt-4">
            <button
              className="w-full rounded-lg bg-brand-primary p-3 text-sm font-semibold text-black-shade-3"
              onClick={handleCompanyAddress}
            >
              {pendingCompanyAddressTx
                ? "Updating..."
                : "Change Company Address"}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="label text-sm text-gray-shade-7">
              Core Team Address
            </label>
            <div className="flex min-w-[180px] flex-col gap-2">
              <div className="checkbox flex items-center justify-end gap-2">
                <input
                  id="BUSD"
                  value={coreTeamAddress}
                  onChange={(e) => setCoreTeamAddress(e.target.value)}
                  type="text"
                  className="focus:ring-yellow-theme w-full max-w-[280px] rounded-md border-0 !bg-black-shade-3 px-3 py-3 text-sm font-semibold text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="cardFooter px-5 pb-7 pt-4">
            <button
              className="w-full rounded-lg bg-brand-primary p-3 text-sm font-semibold text-black-shade-3"
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
