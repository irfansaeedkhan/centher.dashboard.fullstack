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
  normalizeValue,
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
        <div className="h-auto w-full overflow-x-auto rounded-[14px] bg-elevation-1">
          <div className="flex w-full min-w-[800px] flex-col justify-between gap-4 rounded-t-[14px] bg-[#2E2B22] bg-[url(/images/patern1.png)] bg-cover bg-center bg-no-repeat py-7 pl-3 pr-3 fsm:flex-row fsm:items-center fsm:pl-7 fsm:pr-4">
            <h4 className="text-18px font-semibold text-white">
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
          <div className="flex gap-10 p-6 pl-6 pr-6 md:pl-10 md:pr-10">
            <div className="w-full min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 f2xl:max-w-[338px] ">
              <div className="text-xs font-semibold uppercase text-gray-shade-7">
                Registration Fee (With referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
                <p className="text-white">
                  {`${normalizeValue(
                    registrationDetail.registrationFees.feeWithReferrer
                  )} (BNB)`}
                </p>
              </div>
            </div>
            <div className="w-full min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 f2xl:max-w-[338px] ">
              <div className="text-xs font-semibold uppercase text-gray-shade-7">
                Registration Fee (Without referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
                <p className="text-white">
                  {`${normalizeValue(
                    registrationDetail.registrationFees.feeWithoutReferrer
                  )} (BNB)`}
                </p>
              </div>
            </div>
            <div className="w-full min-w-[200px] max-w-[338px] f2xl:max-w-[338px]">
              <div className="text-xs font-semibold uppercase text-gray-shade-7">
                Status
              </div>
              <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
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
        <div className="h-auto w-full overflow-x-auto rounded-[14px] bg-elevation-1">
          <div className="flex w-full min-w-[800px] flex-col justify-between gap-4 rounded-t-[14px] bg-[#2E2B22] bg-[url(/images/patern1.png)] bg-cover bg-center bg-no-repeat py-7 pl-3 pr-3 fsm:flex-row fsm:items-center fsm:pl-7 fsm:pr-4">
            <h4 className="text-18px font-semibold text-white">
              Update Contract
            </h4>
          </div>
          <div className="flex gap-10 p-6 pl-6 pr-6 md:pl-10 md:pr-10">
            <div className="w-full min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 f2xl:max-w-[338px] ">
              <div className="text-xs font-semibold uppercase text-gray-shade-7">
                Registration Fee (With referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
                <input
                  className="mt-2  rounded-[10px] border-0 bg-black-shade-3 py-3 px-4 text-white focus:outline-none focus:ring-brand-primary"
                  type="number"
                  value={updateRegistrationFeeWithReferral}
                  onChange={(e) =>
                    setUpdateRegistrationFeeWithReferral(Number(e.target.value))
                  }
                />
              </div>
            </div>
            <div className="w-full min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 f2xl:max-w-[338px] ">
              <div className="text-xs font-semibold uppercase text-gray-shade-7">
                Registration Fee (Without referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
                <input
                  className="mt-2  rounded-[10px] border-0 bg-black-shade-3 py-3 px-4 text-white focus:outline-none focus:ring-brand-primary"
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
                className="text-14px bg-yellow-theme max-h-[50px] w-full max-w-[180px] rounded-xl p-3 font-bold text-black-shade-3"
              >
                {changeFeeTx ? "Process..." : "Change Fees"}
              </button>
              <button
                onClick={handleChangeState}
                className="text-14px bg-yellow-theme mt-5 max-h-[50px] w-full max-w-[180px] rounded-xl p-3 font-bold text-black-shade-3"
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
      <div className="mx-auto w-full max-w-[1136px]">{page}</div>
    </AllPagesWrapper>
  );
};

export default RegistrationSetting;
