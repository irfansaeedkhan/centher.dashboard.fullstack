import { BNBIcon } from "@/assets/svgs";
import Button from "@/components/button";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatEther2Number } from "@/utils/format.address";
import { joiResolver } from "@hookform/resolvers/joi";
import ctl from "@netlify/classnames-template-literals";
import Joi from "joi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { bidForm } from "./fixed.price.nft.description";

interface FixedPriceNFTDescriptionProps {
  data: INFTDetailData | undefined;
  setupEditListingItemPriceModal: any;
}

const ChangePriceBidModal = ({
  data,
  setupEditListingItemPriceModal,
}: FixedPriceNFTDescriptionProps) => {
  const [nftPrice, setNFTPrice] = useState<any>(
    formatEther2Number(data?.listInfo.price)
  );
  const schema = Joi.object({
    bidPrice: Joi.number().required().label("bidPrice").messages({
      "string.empty": `bid Price Required`,
      "any.required": `Required Field`,
    }),
  });
  const { handleSubmit, register, setError, formState, reset } =
    useForm<bidForm>({
      mode: "onChange",
      resolver: joiResolver(schema),
    });

  return (
    <div className={modalBodyWrapper}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Blockchain</label>
        <div className={`${inputFieldModal} flex items-center gap-3 !ring-0`}>
          <BNBIcon />{" "}
          <h6 className="text-14px font-semibold text-white">BNB</h6>
        </div>
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Price</label>
        <div
          className={`${inputFieldModal} flex items-center justify-between gap-3 !p-0 !px-3 !ring-0`}
        >
          <input
            type="text"
            id="bidPrice"
            // value={nftPrice}
            autoComplete="off"
            {...register("bidPrice")}
            placeholder={nftPrice}
            className={
              "h-full w-full !border-0 bg-transparent text-white !ring-0"
            }
            // onChange={(e) => setNFTPrice(e.target.value)}
          />
          <h6 className="text-14px font-semibold text-gray-shade-7">=$0000</h6>
        </div>
        {formState.errors.bidPrice && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.bidPrice.message}
          </p>
        )}
      </div>

      <Button
        title={"Next"}
        variant={formState.isValid ? "v1" : "v2"}
        disabled={formState.isValid ? false : true}
        onClick={handleSubmit(setupEditListingItemPriceModal)}
        className="mt-2 py-4"
      />
    </div>
  );
};

export default ChangePriceBidModal;

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
const inputFieldModal = ctl(`
  w-full py-3 px-5 h-[48px]  !bg-black-shade-2  text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:!ring-yellow-theme active:!ring-yellow-theme
`);
