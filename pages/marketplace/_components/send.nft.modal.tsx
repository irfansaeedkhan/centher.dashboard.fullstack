import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import ctl from "@netlify/classnames-template-literals";

import Button from "@/components/button";
import CustomDropdown from "./custom.dropdown";

const lockOptions = [
  { label: "No Lock", value: "0" },
  { label: "Three month", value: "7884000" },
  { label: "Six Month", value: "15768000" },
  { label: "Nine Month", value: "23652000" },
  { label: "twelve Month", value: "31536000" },
];

interface SendNFTModalProps {
  handleSend: any;
}
const SendNFTModal = ({ handleSend }: SendNFTModalProps) => {
  const [lock, setLock] = useState<string>("0");
  interface sendFormInterface {
    LockEndTime: number;
    ReceiverAddress: string;
  }

  const SendModalschema = Joi.object({
    ReceiverAddress: Joi.string().required().label("ReceiverAddress").messages({
      "any.required": `Required Field`,
    }),
  });

  const nftForm = useForm<sendFormInterface>({
    mode: "onChange",
    resolver: joiResolver(SendModalschema),
  });

  const handleSendData = (data: sendFormInterface) => {
    let finalData = {
      ReceiverAddress: data.ReceiverAddress,
      LockEndTime: +lock,
    };
    handleSend(finalData);
  };

  return (
    <form className={modalBodyWrapper}>
      {/* <div className={fieldWrapper}>
        <label className={fieldTitle}>Set Lock End Time</label>
        <input
          type="datetime-local"
          id="LockEndTime"
          autoComplete="off"
          {...nftForm.register("LockEndTime")}
          placeholder="Set Lock End Time"
          className="h-[48px] w-full rounded-lg !border-0 bg-transparent !bg-black-shade-2 text-white !ring-0"
        />
        {nftForm.formState.errors.LockEndTime && (
          <p className={`text-red-500 ${errMessage}`}>
            {nftForm.formState.errors.LockEndTime.message}
          </p>
        )}
      </div> */}

      <div className={fieldWrapper}>
        <label className={fieldTitle}>Set Lock End Time</label>

        <CustomDropdown
          options={lockOptions}
          selectedValue={lock}
          onSelect={setLock}
        />
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Nft Receiver Address</label>
        <div className="relative h-[48px]  !bg-black-shade-2">
          <input
            type="text"
            id="ReceiverAddress"
            autoComplete="off"
            {...nftForm.register("ReceiverAddress")}
            placeholder="Enter Receiver Address"
            className="h-full w-full !border-0 bg-transparent text-white !ring-0"
          />
        </div>

        {nftForm.formState.errors.ReceiverAddress && (
          <p className={`text-red-500 ${errMessage}`}>
            {nftForm.formState.errors.ReceiverAddress.message}
          </p>
        )}
      </div>
      <Button
        title={"Next"}
        variant={nftForm.formState.isValid ? "v1" : "v2"}
        disabled={!nftForm.formState.isValid}
        onClick={nftForm.handleSubmit(handleSendData)}
        className="mt-2 py-4"
      />
    </form>
  );
};

export default SendNFTModal;

// styling
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`);
const errMessage = ctl(`
pb-2 text-12px font-medium
`);
const fieldWrapper = ctl(`
  flex gap-2 flex-col w-full
`);
const fieldTitle = ctl(`
  text-14px  font-normal text-white
`);
