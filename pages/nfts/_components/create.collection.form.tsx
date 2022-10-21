// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-hot-toast";
import Image from "next/future/image";

// App imports
import Button from "@/components/button";
import { CustomModal } from "@/components/modal/custom.modal";
import {
  GreyWorldIcon,
  GreyFBIcon,
  GreyTwitterIcon,
  LoaderIcon,
  BNBIcon,
} from "@/assets/svgs";
// form validations
const schema = Joi.object({
  CollectionName: Joi.string().required().max(150).label("NFT Name").messages({
    "string.empty": `NFT Name Required`,
    "any.required": `Required Field`,
  }),
  Description: Joi.string().required().max(550).label("Description").messages({
    "string.empty": `Description Required`,
    "any.required": `Required Field`,
  }),
  Url: Joi.string().allow("").optional().max(50).label("Url").messages({
    "string.empty": `Url Required`,
    "any.required": `Required Field`,
  }),
  OwnSite: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("Personal Site")
    .messages({
      "string.empty": `Personal Site Required`,
      "any.required": `Required Field`,
    }),
  FBLink: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("Facebook link")
    .messages({
      "string.empty": `FB Link Required`,
      "any.required": `Required Field`,
    }),
  TwitterLink: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("Twitter Link")
    .messages({
      "string.empty": `Twitter Link Required`,
      "any.required": `Required Field`,
    }),
});

export const CreateNFTCollectionForm = () => {
  const [loadingState, setLoadingState] = useState(false);
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  // creating modals
  const buyNFTStep1Func = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={"/images/nftAsset.png"}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">Maradona sport</h2>
        <h3 className="text-white text-14px font-normal">Gas fee 10%</h3>
        <h6 className="text-white text-14px font-bold flex items-center gap-2 justify-center">
          <span>Price:</span>
          <BNBIcon />
          89.08 BNB <span className="text-gray-shade-2 "> =$24190.19</span>
        </h6>
        <div className={footerBtnContainer}>
          <Button
            title={"Checkout"}
            variant="v1"
            className="py-4"
            onClick={buyNFTStep2Func}
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const buyNFTStep2Func = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <LoaderIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Transaction in progress
        </h3>
        {/* <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Your transaction is in progress, Please wait.
        </p> */}
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Transaction Hash
          <span className="text-yellow-theme ml-2">0x1204...23b350</span>
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"Cancel"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const buyNFTSuccessFunc = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={"/images/nftAsset.png"}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">Purchased</h2>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Congratulations! You have successfully bought{" "}
          <span className="text-white">Maradona sport</span> NFT on Nether NFT
          platform.
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"View item"}
            variant="v4"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div>
      </div>
    );
    setModal(true);
  };

  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    buyNFTStep1Func();
  };
  return (
    <div className={CreateNFTCollectionFormContainer}>
      <div className={formContainer}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Name your Collection</label>
          <input
            type="text"
            id="CollectionName"
            autoComplete="off"
            {...register("CollectionName")}
            placeholder="eg. ‘big skull collection’ "
            className={
              !formState.errors.CollectionName ? inputField : inputFieldError
            }
          />
          {formState.errors.CollectionName && (
            <p className={`text-red-500 ${errMessage}`}>
              {/* {formState.errors.CollectionName.message} */}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Description</label>
          <span className="text-12px leading-4 text-[#B7BBCC]">
            The description will be included in the collection page underneath
            its image.{" "}
          </span>
          <textarea
            id="Description"
            autoComplete="off"
            {...register("Description")}
            placeholder="Wrirte some details about your NFTs collection"
            className={
              !formState.errors.Description ? inputField : inputFieldError
            }
            cols={20}
            rows={3}
          ></textarea>
          {formState.errors.Description && (
            <p className={`text-red-500 ${errMessage}`}>
              {/* {formState.errors.Description.message} */}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            Url <span className="text-gray-shade-17"> (optional)</span>
          </label>
          <input
            type="text"
            id="Url"
            autoComplete="off"
            {...register("Url")}
            placeholder="https://nethernft.io/collection/ skull- Price"
            className={!formState.errors.Url ? inputField : inputFieldError}
          />
          {formState.errors.Url && (
            <p className={`text-red-500 ${errMessage}`}>
              {/* {formState.errors.Url.message} */}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Add links</label>
          <div className={linkListContainer}>
            <div>
              <div className={linkInputContainer}>
                <GreyWorldIcon className={linkIcon} />
                <input
                  type="text"
                  id="OwnSite"
                  autoComplete="off"
                  {...register("OwnSite")}
                  placeholder="https://yoursite.io"
                  className={
                    !formState.errors.OwnSite ? linkField : linkFieldError
                  }
                />
              </div>
              {formState.errors.OwnSite && (
                <p className={`text-red-500 ${errMessage}`}>
                  {/* {formState.errors.OwnSite.message} */}
                </p>
              )}
            </div>
            <div>
              <div className={linkInputContainer}>
                <GreyFBIcon className={linkIcon} />
                <input
                  type="text"
                  id="FBLink"
                  autoComplete="off"
                  {...register("FBLink")}
                  placeholder="https://facebook.com/your profile"
                  className={
                    !formState.errors.FBLink ? linkField : linkFieldError
                  }
                />
              </div>
              {formState.errors.FBLink && (
                <p className={`text-red-500 ${errMessage}`}>
                  {/* {formState.errors.FBLink.message} */}
                </p>
              )}
            </div>
            <div>
              <div className={linkInputContainer}>
                <GreyTwitterIcon className={linkIcon} />
                <input
                  type="text"
                  id="TwitterLink"
                  autoComplete="off"
                  {...register("TwitterLink")}
                  placeholder="https://Twitter.com/your profile"
                  className={
                    !formState.errors.TwitterLink ? linkField : linkFieldError
                  }
                />
              </div>
              {formState.errors.TwitterLink && (
                <p className={`text-red-500 ${errMessage}`}>
                  {/* {formState.errors.TwitterLink.message} */}
                </p>
              )}
            </div>
          </div>
        </div>
        <Button
          title={"Create Collectiion"}
          variant={formState.isValid ? "v1" : "v2"}
          disabled={!formState.isValid}
          onClick={handleSubmit(onSubmit)}
          className="py-4 mt-2"
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
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`);
const footerBtnContainer = ctl(`
flex items-center gap-4 mt-3
`);
const ImgStyling = ctl(`
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
`);
const CreateNFTCollectionFormContainer = ctl(`
 bg-black-shade-9 rounded-2xl relative w-full border   border-gray-shade-3 py-8 px-6 flex flex-col gap-6
`);
const formContainer = ctl(`
 flex flex-col gap-5
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
const inputField = ctl(`
  w-full py-3 px-5  !bg-black-shade-3   text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:!ring-yellow-theme active:!ring-yellow-theme
`);
const inputFieldError = ctl(`
  ${inputField}
   focus:!ring-red-500
`);
const linkField = ctl(`
absolute top-0 left-0 w-full h-full !pl-14 !bg-black-shade-3   text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:!ring-yellow-theme active:!ring-yellow-theme
`);
const linkFieldError = ctl(`
  ${linkField}
   focus:!ring-red-500
`);
const linkInputContainer = ctl(`
inputItem h-[48px]  w-full !bg-black-shade-3   text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:!ring-yellow-theme active:!ring-yellow-theme relative
`);
const linkIcon = ctl(`
z-30 absolute top-[50%] left-[20px] translate-y-[-50%]
`);
const linkListContainer = ctl(`
flex flex-col gap-5
`);
