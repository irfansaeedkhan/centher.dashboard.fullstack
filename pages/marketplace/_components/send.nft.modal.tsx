import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import CustomDropdown from "./custom.dropdown";
import NewButton from "@/components/button/new.button";

const lockOptions = [
  { label: "No Lock", value: "0" },
  { label: "Three month", value: "7884000" },
  { label: "Six Month", value: "15768000" },
  { label: "Nine Month", value: "23652000" },
  { label: "twelve Month", value: "31536000" }, // which unit is this? seconds? minutes? hours? days? months? years?
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
        <div className="relative h-[48px] rounded-lg !bg-black-shade-3">
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
      <NewButton
        title={"Next"}
        variant={nftForm.formState.isValid ? "v1" : "v10"}
        disabled={!nftForm.formState.isValid}
        onClick={nftForm.handleSubmit(handleSendData)}
        className="mt-2"
      />
    </form>
  );
};

export default SendNFTModal;

// styling
const modalBodyWrapper = `flex flex-col gap-2 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 text-center`;
const errMessage = `pb-2 text-12px font-medium`;

const fieldWrapper = `flex gap-2 flex-col w-full`;

const fieldTitle = `text-14px text-start font-normal text-white`;
