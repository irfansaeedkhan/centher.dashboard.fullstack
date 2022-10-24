// React, Next, NPM Packages
import React, { useState, useEffect } from "react";
import ctl from "@netlify/classnames-template-literals";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useForm } from "react-hook-form";

// App imports
import Button from "@/components/button";
import { ShareBigIcon, BNBIcon, AuctionIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";

const schema = Joi.object({
  bidPrice: Joi.number().required().label("bidPrice").messages({
    "string.empty": `bid Price Required`,
    "any.required": `Required Field`,
  }),
});

export const AuctionNFTBuyerDescription = () => {
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const bidNFTModalFunc = () => {
    setModalTitle("Place a bid");
    setModalContent(
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
              autoComplete="off"
              {...register("bidPrice")}
              placeholder="0.00"
              className={
                "w-full h-full !border-0 !ring-0 bg-transparent text-white"
              }
            />
            <h6 className="text-14px font-semibold text-gray-shade-7">
              =$0000
            </h6>
          </div>
          {formState.errors.bidPrice && (
            <p className={`text-red-500 ${errMessage}`}>
              {/* {formState.errors.bidPrice.message} */}
            </p>
          )}
        </div>
        <Button
          title={"Place bid "}
          variant={formState.isValid ? "v1" : "v2"}
          disabled={!formState.isValid}
          onClick={handleSubmit(onSubmit)}
          className="py-4 mt-2"
        />
      </div>
    );
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    setModal(false);
  };

  useEffect(() => {
    bidNFTModalFunc();
  }, [!formState.isValid]);
  return (
    <div className={nftDescriptionContainer}>
      <div className={desNameContainer}>
        <div className={nameBox}>
          <div className="linearCircle1"></div>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Creator</h5>
            <h6 className={nameBoxZValue}>Dannathaos ART</h6>
          </div>
        </div>
        <div className={nameBox}>
          <div className="linearCircle2"></div>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Owner</h5>
            <h6 className={nameBoxZValue}>YDannathaos ARTou</h6>
          </div>
        </div>
        <div className={nameBox}>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Collection</h5>
            <h6 className={nameBoxZValue}>##1232</h6>
          </div>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Minimum Bid</h4>
        <div className="flex gap-3  items-center">
          <BNBIcon className="[&>*]:fill-[#E35259]" />
          <h5 className={BnBNum}>32.08 BNB</h5>
          <h6 className={greyTxt}> =$65000.6</h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} leading-6`}>
          This NFT is a &quot;bismuth edition&quot; version of Paracelsus. It is
          a tribute to the great Alchemist Paracelsus as Bismuth is one of the
          minerals with which the Philosopher&apos;s Stone can be made.
        </p>

        <div className="auctionTimerBox flex flex-row [@media(max-width:600px)]:!flex-col gap-3 rounded-10px relative overflow-hidden border-2 border-gray-shade-3">
          <div className="iconBox bg-background-shade-2 flex flex-col items-center gap-3 text-center p-6 min-w-[170px]">
            <AuctionIcon />
            <h4 className="text-14px font-normal text-white">
              Auction ends in
            </h4>
          </div>
          <div className="flex w-full justify-center p-4">
            <div className="timerBox flex items-center gap-5">
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">13</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Days
                </h6>
              </div>
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">22</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Hours
                </h6>
              </div>
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">24</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Minutes
                </h6>
              </div>
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">02</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Seconds
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="buttonContainer flex items-center">
        <Button
          title={"Place bid"}
          variant="v1"
          className="py-4"
          onClick={() => {
            bidNFTModalFunc();
            setModal(true);
          }}
        />
      </div>

      {Modal && (
        <CustomModal
          onClose={() => {
            setModal(false);
          }}
          title={ModalTitle}
        >
          {ModalContent}
        </CustomModal>
      )}
    </div>
  );
};
// styling
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 
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
const nftDescriptionContainer = ctl(`
w-full flex flex-col gap-5
`);
const titleContainer = ctl(`
flex items-center justify-between 
`);
const desNameContainer = ctl(`
flex gap-6 [@media(max-width:600px)]:flex-wrap
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  animationTextHeading text-34px
`);
const nameBox = ctl(`
flex items-start gap-3
`);
const nameBoxTitle = ctl(`
text-12px font-normal text-gray-shade-2
`);
const nameBoxZValue = ctl(`
text-14px font-semibold text-white
`);
const greyBoxContainer = ctl(`
bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6
`);
const greyTxt = ctl(`
text-14px font-normal text-gray-shade-7
`);
const desTitle = ctl(`
text-14px font-semibold text-white
`);
const BnBNum = ctl(`
text-16px font-bold text-white
`);
