import { NextPageWithLayout } from "@/pages/_app.page";
import React, { useEffect, useState } from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import RewardsTableSkeleton from "@/components/loading.skeletons/admin.network.rewards";

import RegistrationTabs from "./_components/registration.tabs";
import { useGetRegistrationDetail } from "@/web3/hooks/use.get.registration.details";
import {
  adminChangeRegistrationFees,
  adminPauseRegistration,
  adminUnPauseRegistration,
} from "@/web3/utils/call.helpers";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-hot-toast";

const RegistrationSetting: NextPageWithLayout = () => {
  const { library } = useWeb3React();
  const [
    updateRegistrationFeeWithReferral,
    setUpdateRegistrationFeeWithReferral,
  ] = React.useState(0);
  const [
    updateRegistrationFeeWithoutReferral,
    setUpdateRegistrationFeeWithoutReferral,
  ] = React.useState(0.025);

  const [changeFeeTx, setChangeFeeTx] = useState(false);
  const [changeStatusTx, setChangeStatusTx] = useState(false);

  const [reload, setReload] = useState(false);

  const registrationDetail = useGetRegistrationDetail(reload);

  const handleChangeFees = async () => {
    setChangeFeeTx(true);
    const result = await adminChangeRegistrationFees(
      library,
      updateRegistrationFeeWithReferral,
      updateRegistrationFeeWithoutReferral
    );
    setChangeFeeTx(false);
    if (result.success) {
      toast.success("Changed Registration Fee Successfully");
      setReload(!reload);
    } else {
      toast.error("Something Went Wrong.");
    }
  };

  const handleChangeState = async () => {
    setChangeStatusTx(true);
    let result;
    if (registrationDetail.isActive) {
      result = await adminPauseRegistration(library);
    } else {
      result = await adminUnPauseRegistration(library);
    }

    setChangeStatusTx(false);
    if (result.success) {
      toast.success("Changed Registration Statue Successfully");
      setReload(!reload);
    } else {
      toast.error("Something Went Wrong.");
    }
  };

  // useEffect(() => {
  //   if(registrationDetail && registrationDetail.loading) {
  //     setUpdateDate({
  //       registrationFeeWithReferral: registrationDetail.registrationFees.feeWithReferrer,
  //       registrationFeeWithoutReferral: registrationDetail.registrationFees.feeWithoutReferrer,
  //       status: registrationDetail.isActive? "Active" : "Paused",})
  //   }
  // }, [registrationDetail])

  return (
    <div className="flex flex-col gap-6">
      <RegistrationTabs />

      {!registrationDetail.loading ? (
        <div className="w-full h-auto bg-elevation-1 rounded-[14px] overflow-x-auto">
          <div className="w-full bg-no-repeat bg-center bg-cover py-7 fsm:pl-7 pl-3 fsm:pr-4 pr-3 rounded-t-[14px] flex fsm:flex-row flex-col fsm:items-center justify-between gap-4 bg-[url(/images/patern1.png)] bg-[#2E2B22] min-w-[800px]">
            <h4 className="text-white font-semibold text-18px">
              Current Contract Status
            </h4>
            {/* <button
            onClick={() => {
              setEdit(true);
            }}
            className="text-black-shade-3 text-14px font-bold p-3 w-full bg-yellow-theme rounded-xl max-w-[80px]"
          >
            Edit
          </button> */}
          </div>
          <div className="p-6 flex gap-10 md:pl-10 pl-6 md:pr-10 pr-6">
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 ">
              <div className="uppercase text-xs font-semibold text-gray-shade-7">
                Registration Fee (With referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <p className="text-white">
                  {registrationDetail.registrationFees.feeWithReferrer} (BNB)
                </p>
              </div>
            </div>
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 ">
              <div className="text-xs font-semibold text-gray-shade-7 uppercase">
                Registration Fee (Without referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <p className="text-white">
                  {registrationDetail.registrationFees.feeWithoutReferrer} (BNB)
                </p>
              </div>
            </div>
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px]">
              <div className="text-xs font-semibold text-gray-shade-7 uppercase">
                Status
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <p className="text-white">
                  {registrationDetail.isActive ? "Active" : "Paused"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <RewardsTableSkeleton />
      )}

      {!registrationDetail.loading ? (
        <div className="w-full h-auto bg-elevation-1 rounded-[14px] overflow-x-auto">
          <div className="w-full bg-no-repeat bg-center bg-cover py-7 fsm:pl-7 pl-3 fsm:pr-4 pr-3 rounded-t-[14px] flex fsm:flex-row flex-col fsm:items-center justify-between gap-4 bg-[url(/images/patern1.png)] bg-[#2E2B22] min-w-[800px]">
            <h4 className="text-white font-semibold text-18px">
              Update Contract
            </h4>
          </div>
          <div className="p-6 flex gap-10 md:pl-10 pl-6 md:pr-10 pr-6">
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 ">
              <div className="uppercase text-xs font-semibold text-gray-shade-7">
                Registration Fee (With referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <input
                  className="bg-black-shade-3  text-white border-0 focus:ring-brand-primary focus:outline-none rounded-[10px] py-3 px-4 mt-2"
                  type="number"
                  value={updateRegistrationFeeWithReferral}
                  onChange={(e) =>
                    setUpdateRegistrationFeeWithReferral(Number(e.target.value))
                  }
                />
              </div>
            </div>
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 ">
              <div className="text-xs font-semibold text-gray-shade-7 uppercase">
                Registration Fee (Without referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <input
                  className="bg-black-shade-3  text-white border-0 focus:ring-brand-primary focus:outline-none rounded-[10px] py-3 px-4 mt-2"
                  type="number"
                  value={updateRegistrationFeeWithoutReferral}
                  onChange={(e) =>
                    setUpdateRegistrationFeeWithoutReferral(
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="w-full max-w-[180px]">
              <button
                onClick={handleChangeFees}
                className="text-black-shade-3 text-14px font-bold p-3 w-full bg-yellow-theme rounded-xl max-w-[180px] max-h-[50px]"
              >
                {changeFeeTx ? "Process..." : "Change Fees"}
              </button>
              <button
                onClick={handleChangeState}
                className="text-black-shade-3 text-14px font-bold p-3 w-full bg-yellow-theme rounded-xl max-w-[180px] max-h-[50px] mt-5"
              >
                {changeStatusTx
                  ? "Process..."
                  : registrationDetail.isActive
                  ? "Pause Registration"
                  : "Resume Registration"}
              </button>
            </div>
            {/* <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px]">
            <div className="text-xs font-semibold text-gray-shade-7 uppercase">
              Status
            </div>
            <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
              <select className="bg-black-shade-3  text-white w-full  border-0 focus:ring-brand-primary focus:outline-none rounded-[10px] py-3 px-4 mt-2">
                <option className="bg-black text-white">Active</option>
                <option className="bg-black text-white">Pause</option>
              </select>
            </div>
          </div> */}
          </div>
        </div>
      ) : (
        <RewardsTableSkeleton />
      )}
    </div>
  );
};

RegistrationSetting.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Network Rewards">
      <div className="w-full max-w-[1136px] mx-auto">{page}</div>
    </AllPagesWrapper>
  );
};

export default RegistrationSetting;
