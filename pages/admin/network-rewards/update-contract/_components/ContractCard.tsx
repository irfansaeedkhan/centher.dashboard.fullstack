import { useEffect, useState } from "react";
import Joi from "joi";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-hot-toast";

import { BlockchainWrite } from "@/web3/blockchain";

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
  NTR: Joi.boolean().label("BUSD").messages({
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
  NTR: boolean | null;
}

export const ContractCard = ({ data, refreshRoundsInfo }: any) => {
  const { library } = useWeb3React();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [centherPriceForBusd, setCentherPriceForBusd] = useState(0);
  const [centherPriceForNtr, setCentherPriceForNtr] = useState(0);
  const [maxCentherAmountToSell, setMaxCentherAmountToSell] = useState(0);
  const [minBusdAmountPerUser, setMinBusdAmountPerUser] = useState(0);
  const [maxBusdAmountPerUser, setMaxBusdAmountPerUser] = useState(0);
  const [minNtrAmountPerUser, setMinNtrAmountPerUser] = useState(0);
  const [maxNtrAmountPerUser, setMaxNtrAmountPerUser] = useState(0);
  const [enableBusd, setEnableBusd] = useState(true);
  const [enableNtr, setEnableNtr] = useState(false);
  const [lockMonths, setLockMonths] = useState(0);

  const [pendingTx, setPendingTx] = useState(false);

  useEffect(() => {
    if (data) {
      const isoStart = new Date(data.startTime * 1000).toISOString();
      const isoEnd = new Date(data.endTime * 1000).toISOString();
      setStartTime(isoStart.substring(0, isoStart.length - 8));
      setEndTime(isoEnd.substring(0, isoStart.length - 8));
      setCentherPriceForBusd(data.priceForBusd);
      setCentherPriceForNtr(data.priceForNtr);
      setMaxCentherAmountToSell(data.maxCentherAmountToSell);
      setMinBusdAmountPerUser(data.minContributionForBusd);
      setMaxBusdAmountPerUser(data.maxContributionForBusd);
      setMinNtrAmountPerUser(data.minContributionForNtr);
      setMaxNtrAmountPerUser(data.maxContributionForNtr);
      setEnableBusd(data.busdEnabled);
      setEnableNtr(data.ntrEnabled);
      setLockMonths(data.lockMonths);
      if (!data.busdEnabled && !data.ntrEnabled) setEnableBusd(true);
    }
  }, [data]);

  const handleUpdateContract = async () => {
    const _startTime = new Date(startTime).getTime() / 1000;
    const _endTime = new Date(endTime).getTime() / 1000;
    if (
      _startTime <= (new Date().getTime() - 86400) / 1000 ||
      Number.isNaN(_startTime)
    ) {
      toast.error("Please enter start date.");
      return;
    }
    if (_endTime <= 0 || Number.isNaN(_endTime)) {
      toast.error("Please enter end date.");
      return;
    }
    if (_endTime <= _startTime) {
      toast.error("End time must be greater than start time.");
      return;
    }
    if (maxCentherAmountToSell <= 0) {
      toast.error("Max CENTHER amount to sell must be greater than zero.");
      return;
    }
    // if(lockMonths <= 0) {
    //   toast.error("Lock duration must be greater than zero.")
    //   return
    // }

    if (enableBusd) {
      if (centherPriceForBusd <= 0) {
        toast.error("Centher price must be greater than zero.");
        return;
      }
      if (minBusdAmountPerUser <= 0) {
        toast.error("Min BUSD amount per user must be greater than zero.");
        return;
      }
      if (maxBusdAmountPerUser <= 0) {
        toast.error("Max BUSD amount per user must be greater than zero.");
        return;
      }
      if (maxBusdAmountPerUser <= minBusdAmountPerUser) {
        toast.error("Max BUSD amount per user must be greater than min value.");
        return;
      }
    } else {
      if (centherPriceForNtr <= 0) {
        toast.error("Centher price must be greater than zero.");
        return;
      }
      if (minNtrAmountPerUser <= 0) {
        toast.error("Min NTR amount per user must be greater than zero.");
        return;
      }
      if (maxNtrAmountPerUser <= 0) {
        toast.error("Max NTR amount per user must be greater than zero.");
        return;
      }
      if (maxNtrAmountPerUser <= minNtrAmountPerUser) {
        toast.error("Max NTR amount per user must be greater than min value.");
        return;
      }
    }
    setPendingTx(true);
    try {
      const result = await BlockchainWrite.adminCallUpdateRoundInfo(
        library,
        data.round,
        _startTime,
        _endTime,
        lockMonths,
        centherPriceForBusd,
        centherPriceForNtr,
        maxCentherAmountToSell,
        minBusdAmountPerUser,
        maxBusdAmountPerUser,
        minNtrAmountPerUser,
        maxNtrAmountPerUser,
        enableBusd
      );
      setPendingTx(false);
      refreshRoundsInfo();
      toast.success("Updated Successfully.");
    } catch (error) {
      toast.error("Something went wrong! Confirm values you inputted.");
    }
  };
  return (
    <div className="card flex max-w-[470px] flex-col  overflow-hidden rounded-xl bg-elevation-1">
      <div className="cardHeader flex items-center justify-between bg-elevation-2 p-5">
        <h2 className="cardTitle text-14px font-semibold text-gray-shade-7">
          Round
        </h2>
        <h3 className="font-14px font-semibold text-white">{data.round + 1}</h3>
      </div>
      <div className="cardBody py-6 px-5">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <label className="label text-14px text-gray-shade-7">BUSD</label>
            <div className=" flex min-w-[180px] flex-col gap-2">
              <div className="checkbox flex items-center justify-end gap-2">
                <input
                  id="BUSD"
                  checked={enableBusd}
                  onChange={(e) => {
                    setEnableBusd(true);
                    setEnableNtr(false);
                  }}
                  type="checkbox"
                  className="rounded-md border-0 focus:outline-none focus:ring-[#000]"
                />
                <h6 className="text-14px text-gray-shade-7">Enable</h6>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="label text-14px text-gray-shade-7">NTR</label>
            <div className=" flex min-w-[180px] flex-col gap-2">
              <div className="checkbox flex items-center justify-end gap-2">
                <input
                  id="NTR"
                  checked={enableNtr}
                  onChange={(e) => {
                    setEnableBusd(false);
                    setEnableNtr(true);
                  }}
                  type="checkbox"
                  className="rounded-md border-0 focus:outline-none focus:ring-[#000]"
                />
                <h6 className="text-14px text-gray-shade-7">Enable</h6>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="label text-14px text-gray-shade-7">
              Start date
            </label>

            <div className="flex min-w-[180px] flex-col gap-2">
              <input
                id="StartDate"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                }}
                type="datetime-local"
                className="text-12px focus:ring-yellow-theme w-full max-w-[180px] rounded-md border-0 !bg-black-shade-3 py-3 px-3 font-semibold text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="label text-14px text-gray-shade-7">
              End date
            </label>

            <div className=" flex min-w-[180px] flex-col gap-2">
              <input
                id="EndDate"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                type="datetime-local"
                className="text-12px focus:ring-yellow-theme w-full max-w-[180px] rounded-md border-0 !bg-black-shade-3 py-3 px-3 font-semibold text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="label text-14px text-gray-shade-7">
              Lock Duration
            </label>
            <div className="flex items-center justify-center">
              <div className="flex min-w-[180px] flex-col gap-2">
                <input
                  id="CTHR_BUSD"
                  value={lockMonths}
                  onChange={(e) => setLockMonths(Number(e.target.value))}
                  type="number"
                  className="text-14px focus:ring-yellow-theme w-full max-w-[180px] rounded-md border-0 !bg-black-shade-3 py-3 px-3 font-semibold text-white focus:outline-none"
                />
              </div>
              <label className="label text-14px text-gray-shade-7">
                (Months)
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="label text-14px text-gray-shade-7">
              CTHR Price
            </label>
            <div className="flex items-center justify-center">
              <div className="flex min-w-[180px] flex-col gap-2">
                <input
                  id="CTHR_BUSD"
                  value={enableBusd ? centherPriceForBusd : centherPriceForNtr}
                  onChange={(e) =>
                    enableBusd
                      ? setCentherPriceForBusd(Number(e.target.value))
                      : setCentherPriceForNtr(Number(e.target.value))
                  }
                  type="number"
                  className="text-14px focus:ring-yellow-theme w-full max-w-[180px] rounded-md border-0 !bg-black-shade-3 py-3 px-3 font-semibold text-white focus:outline-none"
                />
              </div>
              <label className="label text-14px text-gray-shade-7">
                {enableBusd ? "(BUSD)" : "(NTR)"}
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="label text-14px text-gray-shade-7">
              Max DXC amount to sell in round {data.round + 1}
            </label>
            <div className="flex min-w-[180px] flex-col gap-2">
              <input
                id="MaxCTHR"
                value={maxCentherAmountToSell}
                onChange={(e) =>
                  setMaxCentherAmountToSell(Number(e.target.value))
                }
                type="number"
                className="text-14px focus:ring-yellow-theme w-full max-w-[180px] rounded-md border-0 !bg-black-shade-3 py-3 px-3 font-semibold text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="label text-14px text-gray-shade-7">
              Min {enableBusd ? "BUSD" : "NTR"} amount per User to purchase CTHR
            </label>
            <div className="flex min-w-[180px] flex-col gap-2">
              <input
                id="MinBUSD"
                value={enableBusd ? minBusdAmountPerUser : minNtrAmountPerUser}
                onChange={(e) =>
                  enableBusd
                    ? setMinBusdAmountPerUser(Number(e.target.value))
                    : setMinNtrAmountPerUser(Number(e.target.value))
                }
                type="number"
                className="text-14px focus:ring-yellow-theme w-full max-w-[180px] rounded-md border-0 !bg-black-shade-3 py-3 px-3 font-semibold text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="label text-14px text-gray-shade-7">
              Max {enableBusd ? "BUSD" : "NTR"} amount per User to purchase CTHR
            </label>
            <div className="flex min-w-[180px] flex-col gap-2">
              <input
                id="MaxBUSD"
                value={enableBusd ? maxBusdAmountPerUser : maxNtrAmountPerUser}
                onChange={(e) =>
                  enableBusd
                    ? setMaxBusdAmountPerUser(Number(e.target.value))
                    : setMaxNtrAmountPerUser(Number(e.target.value))
                }
                type="number"
                className="text-14px focus:ring-yellow-theme w-full max-w-[180px] rounded-md border-0 !bg-black-shade-3 py-3 px-3 font-semibold text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="cardFooter px-5 pt-4 pb-7">
        <button
          className="text-14px w-full rounded-lg bg-brand-primary p-3 font-semibold text-black-shade-3"
          onClick={handleUpdateContract}
        >
          {pendingTx ? "Updating..." : "Update contract"}
        </button>
      </div>
    </div>
  );

  // const { handleSubmit, register, setError, formState, reset } = useForm({
  //   mode: "onChange",
  //   resolver: joiResolver(schema),
  //   defaultValues: {
  //     StartDate: null,
  //     EndDate: null,
  //     MaxCTHR: null,
  //     MinBUSD: null,
  //     MaxBUSD: null,
  //     CTHR_BUSD: null,
  //     BUSD: null,
  //     NTR: null,
  //   },
  // });

  // const onSubmit = async (data: any) => {
  //   console.log(data);
  // };

  // return (
  //   <div className="card bg-elevation-1 rounded-xl max-w-[470px] overflow-hidden flex flex-col ">
  //     <div className="cardHeader flex items-center justify-between bg-elevation-2 p-5">
  //       <h2 className="cardTitle text-gray-shade-7 text-14px font-semibold">
  //         Round
  //       </h2>
  //       <h3 className="text-white font-14px font-semibold">{data.round + 1}</h3>
  //     </div>
  //     <div className="cardBody py-6 px-5">
  //       <div className="flex flex-col gap-5">
  //         <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //             Start date
  //           </label>

  //           <div className=" flex gap-2 flex-col min-w-[180px]">
  //             <input
  //               id="StartDate"
  //               {...register("StartDate")}
  //               type="datetime-local"
  //               className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-12px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[180px]"
  //             />
  //             {formState.errors.StartDate && (
  //               <p className="text-red-500">
  //                 {formState.errors.StartDate.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //             End date
  //           </label>

  //           <div className=" flex gap-2 flex-col min-w-[180px]">
  //             <input
  //               id="EndDate"
  //               {...register("EndDate")}
  //               type="datetime-local"
  //               className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-12px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[180px]"
  //             />
  //             {formState.errors.EndDate && (
  //               <p className="text-red-500">
  //                 {formState.errors.EndDate.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //             CTHR Price
  //           </label>
  //           <div className="flex items-center justify-center">
  //             <div className=" flex gap-2 flex-col min-w-[180px]">
  //               <input
  //                 id="CTHR_BUSD"
  //                 {...register("CTHR_BUSD")}
  //                 type="number"
  //                 className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[180px]"
  //               />
  //               {formState.errors.CTHR_BUSD && (
  //                 <p className="text-red-500">
  //                   {formState.errors.CTHR_BUSD.message}
  //                 </p>
  //               )}
  //             </div>
  //             <label className="label text-gray-shade-7 text-14px">
  //               (BUSD)
  //             </label>
  //           </div>
  //         </div>
  //         <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //             Max CTHR amount to sell in round {data.round + 1}
  //           </label>
  //           <div className=" flex gap-2 flex-col min-w-[180px]">
  //             <input
  //               id="MaxCTHR"
  //               {...register("MaxCTHR")}
  //               type="number"
  //               className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[180px]"
  //             />
  //             {formState.errors.MaxCTHR && (
  //               <p className="text-red-500">
  //                 {formState.errors.MaxCTHR.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //             Min BUSD amount per User to purchase CTHR
  //           </label>
  //           <div className=" flex gap-2 flex-col min-w-[180px]">
  //             <input
  //               id="MinBUSD"
  //               {...register("MinBUSD")}
  //               type="number"
  //               className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[180px]"
  //             />
  //             {formState.errors.MinBUSD && (
  //               <p className="text-red-500">
  //                 {formState.errors.MinBUSD.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //             Max BUSD amount per User to purchase CTHR
  //           </label>
  //           <div className=" flex gap-2 flex-col min-w-[180px]">
  //             <input
  //               id="MaxBUSD"
  //               {...register("MaxBUSD")}
  //               type="number"
  //               className="text-white  rounded-md   py-3 px-3  !bg-black-shade-3   font-semibold text-14px  border-0 focus:outline-none   focus:ring-yellow-theme w-full max-w-[180px]"
  //             />
  //             {formState.errors.MaxBUSD && (
  //               <p className="text-red-500">
  //                 {formState.errors.MaxBUSD.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>

  //         <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //             BUSD
  //           </label>
  //           <div className=" flex gap-2 flex-col min-w-[180px]">
  //             <div className="checkbox flex items-center justify-end gap-2">
  //               <input
  //                 id="BUSD"
  //                 {...register("BUSD")}
  //                 type="checkbox"
  //                 className=" rounded-md border-0 focus:outline-none   focus:ring-[#000]  "
  //               />
  //               <h6 className="text-gray-shade-7 text-14px">Enable</h6>
  //             </div>
  //             {formState.errors.BUSD && (
  //               <p className="text-red-500">
  //                 {formState.errors.BUSD.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //           NTR
  //           </label>
  //           <div className=" flex gap-2 flex-col min-w-[180px]">
  //             <div className="checkbox flex items-center justify-end gap-2">
  //               <input
  //                 id="NTR"
  //                 {...register("NTR")}
  //                 type="checkbox"
  //                 className=" rounded-md border-0 focus:outline-none   focus:ring-[#000]  "
  //               />
  //               <h6 className="text-gray-shade-7 text-14px">Enable</h6>
  //             </div>
  //             {formState.errors.NTR && (
  //               <p className="text-red-500">
  //                 {formState.errors.NTR.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         {/* <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //             BUSD
  //           </label>
  //           <div className=" flex gap-2 flex-col min-w-[180px]">
  //             <div className="checkbox flex items-center justify-end gap-2">
  //               <input
  //                 id="BUSD"
  //                 {...register("BUSD")}
  //                 type="checkbox"
  //                 className=" rounded-md border-0 focus:outline-none   focus:ring-[#000]  "
  //               />
  //               <h6 className="text-gray-shade-7 text-14px">Enable</h6>
  //             </div>
  //             {formState.errors.BUSD && (
  //               <p className="text-red-500">
  //                 {formState.errors.BUSD.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //         <div className="flex items-center justify-between gap-3">
  //           <label className="label text-gray-shade-7 text-14px">
  //           NTR
  //           </label>
  //           <div className=" flex gap-2 flex-col min-w-[180px]">
  //             <div className="checkbox flex items-center justify-end gap-2">
  //               <input
  //                 id="NTR"
  //                 {...register("NTR")}
  //                 type="checkbox"
  //                 className=" rounded-md border-0 focus:outline-none   focus:ring-[#000]  "
  //               />
  //               <h6 className="text-gray-shade-7 text-14px">Enable</h6>
  //             </div>
  //             {formState.errors.NTR && (
  //               <p className="text-red-500">
  //                 {formState.errors.NTR.message}
  //               </p>
  //             )}
  //           </div>
  //         </div> */}
  //       </div>
  //     </div>
  //     <div className="cardFooter pt-4 pb-7 px-5">
  //       <button
  //         className="text-black-shade-3 text-14px font-semibold p-3 w-full bg-yellow-theme rounded-lg"
  //         onClick={handleSubmit(onSubmit)}
  //       >
  //         Update contract
  //       </button>
  //     </div>
  //   </div>
  // )
};
