import { BNBIcon } from "@/assets/svgs";
import Button from "@/components/button";
import { joiResolver } from "@hookform/resolvers/joi";
import ctl from "@netlify/classnames-template-literals";
import Joi from "joi";
import React from "react";
import { useForm } from "react-hook-form";

interface Props {
  handleListNFT: any;
}

interface listingFormInterface {
  bidPrice: number;
}

const ChangePriceListModal: React.FC<Props> = ({ handleListNFT }) => {
  const ListingModalschema = Joi.object({
    bidPrice: Joi.number().required().label("bidPrice").messages({
      "string.empty": `bid Price Required`,
      "any.required": `Required Field`,
    }),
  });

  const listingForm = useForm<listingFormInterface>({
    mode: "onChange",
    resolver: joiResolver(ListingModalschema),
  });

  return (
    <form className={modalBodyWrapper}>
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
            type="number"
            // value={listingPrice}
            // onChange={(e: any) => {setListingPrice(e.target.value)}}
            id="bidPrice"
            autoComplete="off"
            {...listingForm.register("bidPrice")}
            placeholder="0.00"
            className={
              "h-full w-full !border-0 bg-transparent text-white !ring-0"
            }
          />
          <h6 className="text-14px font-semibold text-gray-shade-7">=$0000</h6>
        </div>
        {listingForm.formState.errors?.bidPrice && (
          <p className={`text-red-500 ${errMessage}`}>
            {listingForm.formState.errors.bidPrice.message}
          </p>
        )}
      </div>

      <Button
        title={"Next"}
        variant={listingForm.formState.isValid ? "v1" : "v2"}
        disabled={listingForm.formState.isValid ? false : true}
        onClick={listingForm.handleSubmit(handleListNFT)}
        className="mt-2 py-4"
      />
    </form>
  );
};

export default ChangePriceListModal;

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
