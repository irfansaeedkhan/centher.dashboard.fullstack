import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { joiResolver } from "@hookform/resolvers/joi";
import clsx from "clsx";
import Joi from "joi";
import moment from "moment";
import Button from "@/components/button";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import { useNFTImageSrc } from "@/hooks/use-nft-image-src";

const lockOptions = [
  { label: "0 Day", value: "0" },
  { label: "30 Days", value: "2592000" },
  { label: "60 Days", value: "5184000" },
  { label: "90 Days", value: "7776000" },
  { label: "120 Days", value: "10368000" },
  { label: "180 Days", value: "15552000" },
  { label: "270 Days", value: "23328000" },
  { label: "360 Days", value: "31104000" }, // This is the time in seconds
];

interface sendFormInterface {
  LockEndTime: number;
  ReceiverAddress: string;
}

interface Props {
  nft: CFSNFTForPage;
  handleSend: any;
  onClose: () => void;
}

const SendNFTModal: React.FC<Props> = ({ handleSend, onClose, nft }) => {
  const [lock, setLock] = useState<string>("0");
  const { nftImageSrc, setNftImageSrc, DEFAULT_NFT_IMAGE_SRC } =
    useNFTImageSrc(nft);

  const SendModalschema = Joi.object({
    ReceiverAddress: Joi.string().required().label("ReceiverAddress").messages({
      "any.required": `Required Field`,
    }),
    LockEndTime: Joi.number().required().label("LockEndTime").messages({
      "any.required": `Required Field`,
    }),
  });

  const nftForm = useForm<sendFormInterface>({
    resolver: joiResolver(SendModalschema),
    defaultValues: {
      ReceiverAddress: "",
      LockEndTime: 0,
    },
  });

  const handleSendData = (data: sendFormInterface) => {
    let finalData = {
      ReceiverAddress: data.ReceiverAddress,
      LockEndTime: +lock,
    };
    handleSend(finalData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-lg backdrop-filter focus:outline-none">
      {/*content*/}
      <div className="relative mx-3 flex h-auto max-h-[800px] w-full flex-col rounded-3xl bg-popup-0 pb-6 focus:outline-none fmd:w-164">
        {/*header*/}
        <button className="absolute right-6 top-6 text-white" onClick={onClose}>
          <IoClose className="h-6 w-6" />
        </button>

        <div>
          <Image
            src={nftImageSrc}
            alt={nft.ipfs_metadata.name}
            width={100}
            height={193}
            onError={() => setNftImageSrc(DEFAULT_NFT_IMAGE_SRC)}
            className="h-[193px] !w-full rounded-t-3xl object-cover"
          />
        </div>
        <div className="relative w-full">
          <div className="absolute -top-14 flex w-full flex-col items-center justify-center">
            <div className="relative flex h-[116px] w-[112px] rounded-xl">
              <Image
                src={nftImageSrc}
                alt={nft.ipfs_metadata.name}
                width={112}
                height={112}
                onError={() => setNftImageSrc(DEFAULT_NFT_IMAGE_SRC)}
                className="h-[112px] w-full max-w-[112px] rounded-xl border-2 border-popup-0 object-cover"
              />
              <span className="absolute inset-0 bottom-[-6.5rem] m-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border-[1.5px] border-popup-0 bg-black/40">
                <Image
                  src="/images/gift.png"
                  alt="Lock"
                  width={16}
                  height={16}
                  className="h-4 w-4 "
                />
              </span>
            </div>
            <h4 className="mt-6 text-lg font-semibold text-white">
              {nft.ipfs_metadata.name}
            </h4>
          </div>
        </div>

        <div className="h-full max-h-[729px] overflow-y-auto pt-[100px]">
          <form
            className="flex w-full flex-col gap-4 px-4 pt-2 text-center fmd:px-6 fmd:pt-4"
            onSubmit={nftForm.handleSubmit(handleSendData)}
          >
            <div className={fieldWrapper}>
              <label className={fieldTitle}>Transfer NFT to*</label>
              <div className="focus-within:gradient-border-3 relative h-[48px] !rounded-lg !bg-black-shade-3 p-[1px]">
                <input
                  type="text"
                  id="ReceiverAddress"
                  autoComplete="off"
                  {...nftForm.register("ReceiverAddress")}
                  placeholder="Example: 0x1ed.. or destination"
                  className={clsx(
                    "h-full w-full rounded-lg !border-0 bg-transparent text-white focus:ring-0",
                    nftForm.formState.errors.ReceiverAddress
                      ? "focus:ring-danger"
                      : "focus:ring-0"
                  )}
                />
              </div>
              {nftForm.formState.errors.ReceiverAddress && (
                <p className="pb-2 text-xs font-medium text-danger">
                  {nftForm.formState.errors.ReceiverAddress.message}
                </p>
              )}
            </div>
            <div className={fieldWrapper}>
              <div className="flex items-center justify-between gap-10">
                <label className={fieldTitle}>Set Lock End Time</label>
                <label className={fieldTitle}>
                  {moment().add(lock, "seconds").format("DD MMMM, YYYY")}
                </label>
              </div>
              <p className="my-1 text-start text-xs text-[#838B8F]">
                If you select lock period time, your friend will be unable to
                send gift nft to other until lock ends
              </p>
              <div className="flex w-full flex-wrap items-center gap-2">
                {lockOptions.map((option) => (
                  <Button
                    type="button"
                    key={option.value}
                    title={option.label}
                    variant={lock === option.value ? "primary" : "secondary"}
                    onClick={(e) => {
                      e.preventDefault();
                      setLock(option.value);
                    }}
                    className="mt-2 text-xs font-medium"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              title={"Send"}
              variant={"primary"}
              disabled={!nftForm.formState.isValid}
              className="mt-2"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendNFTModal;

const fieldWrapper = "flex gap-2 flex-col w-full";
const fieldTitle = "text-sm text-start font-normal text-white";
