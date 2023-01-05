import { NextPageWithLayout } from "@/pages/_app.page";
import React from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import RewardsTableSkeleton from "@/components/loading.skeletons/admin.network.rewards";

import RegistrationTabs from "./_components/registration.tabs";

const RegistrationSetting: NextPageWithLayout = () => {
  const [edit, setEdit] = React.useState(false);
  const [registrationDetails, setregistrationDetails] = React.useState({
    registrationFeeWithReferral: 0.025,
    registrationFeeWithoutReferral: 0,
    status: "Active",
  });

  const updateSettingFunc = () => {
    setEdit(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <RegistrationTabs />
      {edit ? (
        <div className="w-full h-auto bg-elevation-1 rounded-[14px] overflow-x-auto">
          <div className="w-full bg-no-repeat bg-center bg-cover py-7 fsm:pl-7 pl-3 fsm:pr-4 pr-3 rounded-t-[14px] flex fsm:flex-row flex-col fsm:items-center justify-between gap-4 bg-[url(/images/patern1.png)] bg-[#2E2B22] min-w-[800px]">
            <h4 className="text-white font-semibold text-18px">
              Current Contract Status
            </h4>
            <button
              onClick={updateSettingFunc}
              className="text-black-shade-3 text-14px font-bold p-3 w-full bg-yellow-theme rounded-xl max-w-[80px]"
            >
              Update
            </button>
          </div>
          <div className="p-6 flex gap-10 md:pl-10 pl-6 md:pr-10 pr-6">
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 ">
              <div className="uppercase text-xs font-semibold text-gray-shade-7">
                Registration Fee (With referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <input
                  className="bg-black-shade-3  text-white border-0 focus:ring-brand-primary focus:outline-none rounded-[10px] py-3 px-4 mt-2"
                  type="text"
                  value={0.025}
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
                  type="text"
                  value={0}
                />
              </div>
            </div>
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px]">
              <div className="text-xs font-semibold text-gray-shade-7 uppercase">
                Status
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <select className="bg-black-shade-3  text-white w-full  border-0 focus:ring-brand-primary focus:outline-none rounded-[10px] py-3 px-4 mt-2">
                  <option className="bg-black text-white">Active</option>
                  <option className="bg-black text-white">Disable</option>
                  <option className="bg-black text-white">Pause</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-auto bg-elevation-1 rounded-[14px] overflow-x-auto">
          <div className="w-full bg-no-repeat bg-center bg-cover py-7 fsm:pl-7 pl-3 fsm:pr-4 pr-3 rounded-t-[14px] flex fsm:flex-row flex-col fsm:items-center justify-between gap-4 bg-[url(/images/patern1.png)] bg-[#2E2B22] min-w-[800px]">
            <h4 className="text-white font-semibold text-18px">
              Current Contract Status
            </h4>
            <button
              onClick={() => {
                setEdit(true);
              }}
              className="text-black-shade-3 text-14px font-bold p-3 w-full bg-yellow-theme rounded-xl max-w-[80px]"
            >
              Edit
            </button>
          </div>
          <div className="p-6 flex gap-10 md:pl-10 pl-6 md:pr-10 pr-6">
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 ">
              <div className="uppercase text-xs font-semibold text-gray-shade-7">
                Registration Fee (With referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <p className="text-white">
                  {registrationDetails.registrationFeeWithReferral} (BNB)
                </p>
              </div>
            </div>
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px] border-r-2 border-black-shade-7 ">
              <div className="text-xs font-semibold text-gray-shade-7 uppercase">
                Registration Fee (Without referral link)
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <p className="text-white">
                  {registrationDetails.registrationFeeWithoutReferral} (BNB)
                </p>
              </div>
            </div>
            <div className="w-full f2xl:max-w-[338px] min-w-[200px] max-w-[338px]">
              <div className="text-xs font-semibold text-gray-shade-7 uppercase">
                Status
              </div>
              <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
                <p className="text-white">{registrationDetails.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* skeleton */}
      <RewardsTableSkeleton />
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
