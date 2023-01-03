import React from "react";
import Joi, { string } from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";

import NetworkTabs from "../_components/network.tabs";

// form validations
const schema = Joi.object({
  StartDate: Joi.date().required().label(" End Time").messages({
    "string.empty": `EndTime Required`,
    "any.required": `Required Field`,
  }),
  EndDate: Joi.date().required().label(" End Time").messages({
    "string.empty": `EndTime Required`,
    "any.required": `Required Field`,
  }),
  MaxCTHR: Joi.number().required().label("MaxCTHR").messages({
    "string.empty": `MaxCTHR Required`,
    "any.required": `Required Field`,
  }),
  MinBUSD: Joi.number().required().label("MinBUSD").messages({
    "string.empty": `MinBUSD Required`,
    "any.required": `Required Field`,
  }),
  MaxBUSD: Joi.number().required().label("MaxBUSD").messages({
    "string.empty": `MaxBUSD Required`,
    "any.required": `Required Field`,
  }),
  CTHR_BUSD: Joi.number().required().label("CTHR_BUSD").messages({
    "string.empty": `CTHR_BUSD Required`,
    "any.required": `Required Field`,
  }),
  BUSD: Joi.boolean().label("BUSD").messages({
    "string.empty": `BUSD Required`,
    "any.required": `Required Field`,
  }),
  CTHR: Joi.boolean().label("BUSD").messages({
    "string.empty": `BUSD Required`,
    "any.required": `Required Field`,
  }),
});
interface ContractFormFields {
  StartDate: string | null;
  EndDate: string | null;
  MaxCTHR: number | null;
  MinBUSD: number | null;
  MaxBUSD: number | null;
  CTHR_BUSD: number | null;
  BUSD: boolean | null;
  CTHR: boolean | null;
}

const UpdateContract: NextPageWithLayout = () => {
  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
    defaultValues: {
      StartDate: null,
      EndDate: null,
      MaxCTHR: null,
      MinBUSD: null,
      MaxBUSD: null,
      CTHR_BUSD: null,
      BUSD: null,
      CTHR: null,
    },
  });
  const onSubmit = async (data: any) => {
    console.log(data);
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="contractContainer grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4 ">
        <div className="card bg-elevation-1 rounded-xl max-w-[370px] overflow-hidden flex flex-col ">
          <div className="cardHeader flex items-center justify-between bg-elevation-2 p-5">
            <h2 className="cardTitle text-gray-shade-7 text-14px font-semibold">
              Round
            </h2>
            <h3 className="text-white font-14px font-semibold">1</h3>
          </div>
          <div className="cardBody py-6 px-5">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <label className="label text-gray-shade-7 text-14px">
                  Start date
                </label>

                <div className=" flex gap-2 flex-col min-w-[140px]">
                  <input
                    id="StartDate"
                    {...register("StartDate")}
                    type="date"
                    className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-12px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[135px]"
                  />
                  {formState.errors.StartDate && (
                    <p className="text-red-500">
                      {formState.errors.StartDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="label text-gray-shade-7 text-14px">
                  End date
                </label>

                <div className=" flex gap-2 flex-col min-w-[140px]">
                  <input
                    id="EndDate"
                    {...register("EndDate")}
                    type="date"
                    className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-12px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[135px]"
                  />
                  {formState.errors.EndDate && (
                    <p className="text-red-500">
                      {formState.errors.EndDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="label text-gray-shade-7 text-14px">
                  Max CTHR amount to sell in round 1
                </label>
                <div className=" flex gap-2 flex-col min-w-[140px]">
                  <input
                    id="MaxCTHR"
                    {...register("MaxCTHR")}
                    type="number"
                    className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[135px]"
                  />
                  {formState.errors.MaxCTHR && (
                    <p className="text-red-500">
                      {formState.errors.MaxCTHR.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="label text-gray-shade-7 text-14px">
                  Min BUSD amount per User to purchase CTHR
                </label>
                <div className=" flex gap-2 flex-col min-w-[140px]">
                  <input
                    id="MinBUSD"
                    {...register("MinBUSD")}
                    type="number"
                    className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[135px]"
                  />
                  {formState.errors.MinBUSD && (
                    <p className="text-red-500">
                      {formState.errors.MinBUSD.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="label text-gray-shade-7 text-14px">
                  Max BUSD amount per User to purchase CTHR
                </label>
                <div className=" flex gap-2 flex-col min-w-[140px]">
                  <input
                    id="MaxBUSD"
                    {...register("MaxBUSD")}
                    type="number"
                    className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[135px]"
                  />
                  {formState.errors.MaxBUSD && (
                    <p className="text-red-500">
                      {formState.errors.MaxBUSD.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="label text-gray-shade-7 text-14px">
                  CTHR amount per BUSD
                </label>
                <div className=" flex gap-2 flex-col min-w-[140px]">
                  <input
                    id="CTHR_BUSD"
                    {...register("CTHR_BUSD")}
                    type="number"
                    className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[135px]"
                  />
                  {formState.errors.CTHR_BUSD && (
                    <p className="text-red-500">
                      {formState.errors.CTHR_BUSD.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="label text-gray-shade-7 text-14px">
                  BUSD
                </label>
                <div className=" flex gap-2 flex-col min-w-[140px]">
                  <div className="checkbox flex items-center justify-end gap-2">
                    <input
                      id="BUSD"
                      {...register("BUSD")}
                      type="checkbox"
                      className=" rounded-md border-0 focus:outline-none   focus:ring-[#000]  "
                    />
                    <h6 className="text-gray-shade-7 text-14px">Enable</h6>
                  </div>
                  {formState.errors.BUSD && (
                    <p className="text-red-500">
                      {formState.errors.BUSD.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="label text-gray-shade-7 text-14px">
                  CTHR
                </label>
                <div className=" flex gap-2 flex-col min-w-[140px]">
                  <div className="checkbox flex items-center justify-end gap-2">
                    <input
                      id="CTHR"
                      {...register("CTHR")}
                      type="checkbox"
                      className=" rounded-md border-0 focus:outline-none   focus:ring-[#000]  "
                    />
                    <h6 className="text-gray-shade-7 text-14px">Enable</h6>
                  </div>
                  {formState.errors.CTHR && (
                    <p className="text-red-500">
                      {formState.errors.CTHR.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="cardFooter pt-4 pb-7 px-5">
            <button
              className="text-black-shade-3 text-14px font-semibold p-3 w-full bg-yellow-theme rounded-lg"
              onClick={handleSubmit(onSubmit)}
            >
              Update contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

UpdateContract.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Metaverse">
      <div className="w-full max-w-[1136px] mx-auto">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default UpdateContract;
