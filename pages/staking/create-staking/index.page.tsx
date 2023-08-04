import React, { useState, ChangeEvent, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { CrossIcon, TeamMemberIcon } from "@/assets/svgs";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import clsx from "clsx";
import { BsArrowLeftShort, BsPlusCircle } from "react-icons/bs";

import { CustomModal } from "@/components/modal/custom.modal";
import { IoIosClose } from "react-icons/io";
import FinalButton from "@/components/button/final.button";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { StakingSuccessModal } from "./_components/staking-success-modal";
import {
  levelDataType,
  metaDataType,
  stakingFormInterface,
  teamMember,
} from "../_components/staking-types";
import { StakingFailureModal } from "./_components/staking-failure-modal";
import { cn } from "@/utils/cn/cn";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-hot-toast";

const CreateStaking: NextPageWithLayout = () => {
  // upload images and videos
  const [showCoverImage, setShowCoverImage] = useState<boolean | null>(false);
  const [showProfileImage, setShowProfileImage] = useState<boolean | null>(
    false
  );
  const [profile, setProfile] = useState<Blob | undefined>(undefined);
  const [cover, setCover] = useState<Blob | undefined>(undefined);
  const [profileErr, setProfileErr] = useState(false);
  const [coverErr, setCoverErr] = useState(false);
  const [clearForm, setClearForm] = useState(false);

  const uploadCoverFile = (e: any) => {
    const previewUrl = e.target.files[0];
    var allowedExtensions = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg",
      "image/gif",
    ];
    if (allowedExtensions.indexOf(previewUrl?.type?.toLowerCase()) == -1) {
      toast.error("Invalid file type");
      return;
    }
    setCover(previewUrl);
    setShowCoverImage(true);
  };
  const uploadProfileFile = (e: any) => {
    const previewUrl = e.target.files[0];
    var allowedExtensions = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg",
      "image/gif",
    ];
    if (allowedExtensions.indexOf(previewUrl?.type?.toLowerCase()) == -1) {
      toast.error("Invalid file type");
      return;
    }
    setProfile(previewUrl);
    setShowProfileImage(true);
  };

  useEffect(() => {
    if (clearForm) {
      setShowProfileImage(false);
      setProfile(undefined);
      setShowCoverImage(false);
      setCover(undefined);
    }
  }, [clearForm, setCover, setProfile]);

  // steps state
  const [formStep, setFormStep] = useState(0);
  // form1 start
  // handle dynamic metadata
  const [metaDataDetails, setMetaDataDetails] = useState<metaDataType>({
    title: "",
    data: "",
  });
  const [metaDataModal, setMetaDataModal] = useState(false);
  const [metaDataErr, setMetaDataErr] = useState<null | string>(null);
  const [metaDataList, setMetaDataList] = useState<metaDataType[]>([]);

  const handleMetaDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const limitedValue = value.slice(0, 16);
    setMetaDataDetails((prev: any) => ({
      ...prev,
      [name]: limitedValue,
    }));
  };

  const addNewMetaDataFunc = () => {
    if (
      metaDataDetails?.title === null ||
      metaDataDetails?.title?.match(/^ *$/) !== null
    ) {
      setMetaDataErr("title/Name value missing");
      return;
    } else if (
      metaDataDetails?.data === null ||
      metaDataDetails?.data?.match(/^ *$/) !== null
    ) {
      setMetaDataErr("title/Name value missing");
      return;
    }
    setMetaDataErr("");
    setMetaDataList((current: any) => [...current, metaDataDetails]);
    setMetaDataModal(false);
    setMetaDataDetails({
      title: "",
      data: "",
    });
  };

  const handleMetaDataRemove = (prop: any) => {
    setMetaDataList(metaDataList.filter((item: any) => item?.title != prop));
  };

  // level system
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [inputValues, setInputValues] = useState<levelDataType[]>([]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const newSelectedValue: string = event.target.value;
    setSelectedValue(newSelectedValue);
    if (newSelectedValue === "No referral") {
      setInputValues([]);
    } else if (
      newSelectedValue === "Recurring Return (0 to 6 levels)" ||
      newSelectedValue === "Fix Commission (0 to 6 levels)"
    ) {
      const numLevels: number = 6;
      const newInputValues: levelDataType[] = Array.from(
        { length: numLevels },
        (_, index) => ({
          level: index + 1,
          percent: 0, // You can set the default percent value here, if needed
        })
      );
      setInputValues(newInputValues);
    } else {
      setInputValues([]);
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const inputValue: string = event.target.value;

    // Check if the input value is a valid number (integer or decimal)
    const numericValue: number = parseFloat(inputValue);
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      const newInputValues: levelDataType[] = [...inputValues];
      newInputValues[index].percent = numericValue;
      setInputValues(newInputValues);
    } else {
      // If the input value is not a valid number, set it to an empty string
      const newInputValues: levelDataType[] = [...inputValues];
      newInputValues[index].percent = 0; // You can set the default percent value here, if needed
      setInputValues(newInputValues);
    }
  };

  const renderInputFields = (): JSX.Element[] => {
    const numLevels: number = inputValues.length;

    return Array.from({ length: numLevels }, (_, index) => (
      <div
        key={index}
        className={clsx(
          `text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0 ${
            index === numLevels - 1 && index % 2 === 0 && "col-span-2"
          }`
        )}
      >
        <label
          htmlFor={`level-${index + 1}`}
          className="block font-normal tracking-wide"
        >
          Level {index + 1}
        </label>
        <input
          type="number"
          name={`level-${index + 1}`}
          id={`level-${index + 1}`}
          placeholder="%"
          className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
          value={inputValues[index]?.percent || ""}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(event, index)
          }
          pattern="[0-9]+(\.[0-9]+)?" // Allows integer and decimal numbers
          title="Please enter numbers only"
          required
        />
      </div>
    ));
  };

  const stakingFormSchema = Joi.object({
    staking_name: Joi.string().max(200).label("staking_name"),
    token_address: Joi.string().max(200).label("token address"),
    reward_token_address: Joi.string().max(200).label("reward token address"),
    multilevel_rewards: Joi.string().max(100).label("multilevel rewards"),
    apy: Joi.number().max(9999999999999999999).label("apy"),
    staking_period: Joi.string().max(150).label("staking period"),
    start_date: Joi.string().max(150).label("start date"),
    claim_period: Joi.string().max(150).label("claim period"),
    rewards_release_start: Joi.string().max(150).label("rewards release start"),
    show_on_centher: Joi.string().max(10).label("show on centher"),
    liquidity_pool_provided: Joi.string()
      .max(10)
      .label("liquidity pool provided"),
    is_cancelable: Joi.string().max(10).label("is cancelable"),
    charge_fee_on_cancel: Joi.number()
      .max(9999999999999999999)
      .label("charge fee on cancel"),
    min_staking_amount: Joi.number()
      .max(9999999999999999999)
      .label("min staking amount"),
    max_staking_amount: Joi.number()
      .max(9999999999999999999)
      .label("max staking amount"),
    total_supply: Joi.number()
      .max(9999999999999999999)
      .label("max staking amount"),
    websiteUrl: Joi.string().max(150).label("websiteUrl"),
    facebook: Joi.string().max(150).optional().allow("").label("facebook"),
    twitter: Joi.string().max(150).optional().allow("").label("twitter"),
    github: Joi.string().max(150).optional().allow("").label("github"),
    telegram: Joi.string().max(150).optional().allow("").label("telegram"),
    instagram: Joi.string().max(150).optional().allow("").label("instagram"),
    discord: Joi.string().max(150).optional().allow("").label("discord"),
    reddit: Joi.string().max(150).optional().allow("").label("reddit"),
    explorers: Joi.string().max(150).label("explorers"),
    category: Joi.string().max(150).label("category"),
    description: Joi.string()
      .max(550)
      .required()
      .label("description")
      .messages({
        "any.required": `description Field`,
      }),
    members: Joi.array()
      .items(
        Joi.object({
          jobTitle: Joi.string().max(50).required().label("Job Title"),
          walletAddress: Joi.string()
            .max(200)
            .required()
            .label("Wallet Address"),
        })
      )
      .optional(),
  });

  const stakingForm = useForm<stakingFormInterface>({
    mode: "onChange",
    resolver: joiResolver(stakingFormSchema),
    defaultValues: {
      show_on_centher: "no",
      liquidity_pool_provided: "no",
      is_cancelable: "no",
    },
  });

  // form1 end

  // form2 start
  // handle dynamic members
  const [members, setMembers] = useState<teamMember[]>([]);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState({
    jobTitle: "",
    walletAddress: "",
  });

  const handleMemberInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setMemberData((prevMemberData) => ({ ...prevMemberData, [name]: value }));
  };

  const handleAddMember = (): void => {
    if (
      memberData.jobTitle.length > 50 ||
      memberData.walletAddress.length > 200
    ) {
      setMemberError("member details lenght is exceeding maximum length");
      return;
    }
    if (memberData.jobTitle && memberData.walletAddress) {
      setMemberError(null);
      setMembers((prevMembers) => [...prevMembers, memberData]);
      setMemberData({
        jobTitle: "",
        walletAddress: "",
      });
    }
  };

  const handleRemoveMember = (index: number): void => {
    setMembers((prevMembers) => prevMembers.filter((_, i) => i !== index));
  };

  //  validations

  const handleDetails = (data: stakingFormInterface) => {
    let finalData = {
      profile_image: profile,
      cover_image: cover,
      staking_name: data.staking_name,
      token_address: data.token_address,
      reward_token_address: data.reward_token_address,
      multilevel_rewards: data.multilevel_rewards,
      apy: data.apy,
      staking_period: data.staking_period,
      start_date: data.start_date,
      claim_period: data.claim_period,
      rewards_release_start: data.rewards_release_start,
      show_on_centher: data.show_on_centher,
      liquidity_pool_provided: data.liquidity_pool_provided,
      is_cancelable: data.is_cancelable,
      charge_fee_on_cancel: data.charge_fee_on_cancel,
      min_staking_amount: data.min_staking_amount,
      max_staking_amount: data.max_staking_amount,
      total_supply: data.total_supply,
      project_metadata: metaDataList,
      rewards_level: inputValues,
      websiteUrl: data.websiteUrl,
      facebook: data.facebook,
      twitter: data.twitter,
      github: data.github,
      telegram: data.telegram,
      instagram: data.instagram,
      discord: data.discord,
      reddit: data.reddit,
      explorers: data.explorers,
      category: data.category,
      description: data.description,
      members: members,
    };

    console.log(finalData);

    if (finalData) {
      previewBox(finalData);
    }

    stakingForm.reset({
      staking_name: "",
      token_address: "",
      multilevel_rewards: "",
      apy: null,
      staking_period: "",
      start_date: "",
      claim_period: "",
      rewards_release_start: "",
      show_on_centher: "no",
      liquidity_pool_provided: "no",
      is_cancelable: "no",
      charge_fee_on_cancel: null,
      min_staking_amount: null,
      max_staking_amount: null,
      total_supply: null,
      websiteUrl: "",
      facebook: "",
      twitter: "",
      github: "",
      telegram: "",
      instagram: "",
      discord: "",
      reddit: "",
      explorers: "",
      category: "",
      description: "",
    });

    setMetaDataList([]);
    setInputValues([]);
    setSelectedValue("");
    setMemberError(null);
    setMembers([]);
    setClearForm(true);
    setFormStep(0);
  };

  // form2 end
  const [showMsg, setshowMsg] = useState<any>(null);

  const retryFunc = () => {
    setshowMsg(null);
    setFormStep(0);
  };

  const onClickClose = () => {
    setshowMsg(null);
  };

  const handleNext = async () => {
    if (metaDataList?.length < 1) {
      setMetaDataErr("add atleast one meta data");
      return;
    }
    if (!profile) {
      setProfileErr(true);
      return;
    }
    if (!cover) {
      setCoverErr(true);
      return;
    }

    // if (
    //   multilevel_rewards === "Recurring Return (0 to 6 levels)" ||
    //   multilevel_rewards === "Fix Commission (0 to 6 levels)"
    // ) {
    //   inputValues.map((data) => {
    //     if (data.percent === null || data.percent === undefined) {
    //       return;
    //     }
    //   });
    // }

    await stakingForm.trigger([
      "staking_name",
      "token_address",
      "reward_token_address",
      "multilevel_rewards",
      "apy",
      "staking_period",
      "start_date",
      "claim_period",
      "rewards_release_start",
      "show_on_centher",
      "liquidity_pool_provided",
      "is_cancelable",
      "charge_fee_on_cancel",
      "min_staking_amount",
      "max_staking_amount",
      "total_supply",
    ]);

    const staking_name = stakingForm.getFieldState("staking_name");
    const token_address = stakingForm.getFieldState("token_address");
    const reward_token_address = stakingForm.getFieldState(
      "reward_token_address"
    );
    const multilevel_rewards = stakingForm.getFieldState("multilevel_rewards");
    const apy = stakingForm.getFieldState("apy");
    const staking_period = stakingForm.getFieldState("staking_period");
    const start_date = stakingForm.getFieldState("start_date");
    const claim_period = stakingForm.getFieldState("claim_period");
    const rewards_release_start = stakingForm.getFieldState(
      "rewards_release_start"
    );
    const show_on_centher = stakingForm.getFieldState("show_on_centher");
    const liquidity_pool_provided = stakingForm.getFieldState(
      "liquidity_pool_provided"
    );
    const is_cancelable = stakingForm.getFieldState("is_cancelable");
    const charge_fee_on_cancel = stakingForm.getFieldState(
      "charge_fee_on_cancel"
    );
    const min_staking_amount = stakingForm.getFieldState("min_staking_amount");
    const max_staking_amount = stakingForm.getFieldState("max_staking_amount");
    const total_supply = stakingForm.getFieldState("total_supply");

    if (
      staking_name.invalid ||
      token_address.invalid ||
      reward_token_address.invalid ||
      multilevel_rewards.invalid ||
      apy.invalid ||
      staking_period.invalid ||
      start_date.invalid ||
      claim_period.invalid ||
      rewards_release_start.invalid ||
      show_on_centher.invalid ||
      liquidity_pool_provided.invalid ||
      is_cancelable.invalid ||
      charge_fee_on_cancel.invalid ||
      min_staking_amount.invalid ||
      max_staking_amount.invalid ||
      total_supply.invalid
    ) {
      console.log("trst1");
      return;
    } else {
      setProfileErr(false);
      setCoverErr(false);
      setFormStep(1);
    }
  };

  const previewBox = (data: stakingFormInterface) => {
    console.log(data);
  };

  const handleStaking = async (data: stakingFormInterface) => {
    try {
      setshowMsg(<StakingSuccessModal onClickClose={onClickClose} />);
    } catch (error: any) {
      setshowMsg(
        <StakingFailureModal
          onClickClose={onClickClose}
          retryFunc={retryFunc}
        />
      );
    }
  };

  return (
    <section className="flex  w-full">
      <div className=" flex flex-grow flex-col ">
        <div className="flex items-center gap-3 pb-6">
          <button
            onClick={() => {
              setFormStep(0);
            }}
            className={cn(
              "group flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-shade-9 hover:bg-brand-primary",
              {
                hidden: formStep == 0,
              }
            )}
          >
            <BsArrowLeftShort className="h-6 w-6 fill-gray-shade-18 group-hover:fill-gray-shade-3" />
          </button>
          <h1 className="textGradient font-semibold leading-[42px] sm:text-2xl ">
            {formStep == 0
              ? "Submit Your Staking Project"
              : "Add details to your project"}
          </h1>
        </div>
        <div className="form-box relative flex w-full gap-10 overflow-hidden">
          {/* form1 */}
          <motion.div
            className={cn("min-w-[85%] flex-1  fmd:min-w-full", {
              hidden: formStep == 1,
            })}
            animate={{
              translateX: `-${formStep * 100}%`,
            }}
          >
            <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-gray-shade-3 bg-black-shade-9 p-6">
              {/* logo and cover  */}
              <div className="flex w-full flex-col gap-6">
                <div className="w-full  max-w-[340px]">
                  <h4 className="text-14px pb-2 font-semibold text-white">
                    Upload Logo Image <span className="text-gradient">*</span>
                  </h4>
                  <p
                    className={clsx(
                      `mb-3`,
                      "text-xs font-normal leading-6 text-[#A0A4BB]"
                    )}
                  >
                    This image will also be used for navigation. 350 x 350
                    recommended.
                  </p>
                  {profileErr && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      Profile image is required
                    </p>
                  )}
                  <div
                    className={
                      "relative flex w-full flex-col items-center rounded-[20px] border border-gray-shade-3 bg-black-shade-9 p-6 md:items-start"
                    }
                  >
                    {showProfileImage && (
                      <button
                        className="leading-0 absolute top-4  right-5 z-30 flex h-[34px] w-[34px]  items-center justify-center rounded-xl border border-gray-shade-3  bg-gray-shade-3/50  font-semibold leading-none opacity-100 outline-none backdrop-blur-lg focus:outline-none [&>*>*]:stroke-white [&>*]:transition [&>*]:hover:scale-125"
                        onClick={() => {
                          setShowProfileImage(false);
                          setProfile(undefined);
                        }}
                      >
                        <CrossIcon />
                      </button>
                    )}
                    <div className="relative h-[96px] w-[96px] rounded-full border border-gray-shade-9 bg-gray-shade-9">
                      {showProfileImage && (
                        <div>
                          <Image
                            className="absolute h-full w-full rounded-full object-cover"
                            src={profile ? URL.createObjectURL(profile) : ""}
                            alt="image"
                            height={270}
                            width={270}
                          />
                        </div>
                      )}
                    </div>
                    {!showProfileImage ? (
                      <div className={clsx("relative mt-5 h-10 w-[132px]")}>
                        <label
                          htmlFor="collection-profile-image"
                          className=" absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] border border-gray-shade-3 bg-transparent text-center text-sm font-bold leading-normal text-white hover:bg-[#1E202B]"
                        >
                          Choose File
                        </label>
                        <input
                          type="file"
                          id="collection-profile-image"
                          className="absolute h-full w-full opacity-0"
                          onChange={uploadProfileFile}
                          accept="image/png, image/jpeg, image/webp, image/gif"
                        />
                      </div>
                    ) : (
                      <div
                        className={clsx(`mt-5`, "relative h-10 w-[132px]")}
                        onClick={() => {
                          setShowProfileImage(false);
                          setProfile(undefined);
                        }}
                      >
                        <label
                          htmlFor="collection-profile-image"
                          className=" absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] border border-gray-shade-3 bg-transparent text-center text-sm font-bold leading-normal text-white hover:bg-[#1E202B]"
                        >
                          Choose File
                        </label>
                        <input
                          type="file"
                          id="collection-profile-image"
                          className="absolute h-full w-full opacity-0"
                          onChange={uploadProfileFile}
                          accept="image/png, image/jpeg, image/webp, image/gif"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-14px pb-2 font-semibold text-white">
                    Upload banner image <span className="text-gradient">*</span>
                  </h4>
                  <p className="w-full max-w-[544px] text-xs font-normal leading-6 text-[#A0A4BB]">
                    This image will appear at the top of your collection page.
                    Avoid including too much text in this banner image, 1400 x
                    350 recommended.
                  </p>
                  {coverErr && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      Cover image is required
                    </p>
                  )}
                  <div className=" relative mt-3 w-full rounded-2xl border border-gray-shade-3 bg-black-shade-9 pb-[60%] fsm:pb-[20%]">
                    {showCoverImage ? (
                      <div>
                        <Image
                          className="absolute h-full w-full rounded-2xl object-contain"
                          src={cover ? URL.createObjectURL(cover) : ""}
                          alt="image"
                          height={270}
                          width={270}
                        />
                        <button
                          className="leading-0 absolute top-4  right-5 z-30 flex h-[34px] w-[34px]  items-center justify-center rounded-xl border border-gray-shade-3  bg-gray-shade-3/50  font-semibold leading-none opacity-100 outline-none backdrop-blur-lg focus:outline-none [&>*>*]:stroke-white [&>*]:transition [&>*]:hover:scale-125"
                          onClick={() => {
                            setShowCoverImage(false);
                            setCover(undefined);
                          }}
                        >
                          <CrossIcon />
                        </button>
                      </div>
                    ) : (
                      <div className="absolute flex h-full w-full items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-5">
                          <span className="text-12px font-semibold text-gray-shade-7">
                            PNG, JPG, GIF
                          </span>
                          <div className="relative h-10 w-[132px]">
                            <label
                              htmlFor="collection-banner-image"
                              className="absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] border border-gray-shade-3 bg-transparent text-center text-sm font-bold leading-normal text-white hover:bg-[#1E202B]"
                            >
                              Choose File
                            </label>
                            <input
                              type="file"
                              id="collection-banner-image"
                              className="absolute h-full w-full opacity-0"
                              onChange={uploadCoverFile}
                              accept="image/png, image/jpeg, image/webp, image/gif"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-2 grid w-full gap-6 md:grid-cols-2">
                {/* staking name */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="staking_name"
                    className="block font-normal tracking-wide"
                  >
                    Staking Name
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("staking_name")}
                    id="staking_name"
                    placeholder="For example: DeXa Pack 1"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.staking_name && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.staking_name.message}
                    </p>
                  )}
                </div>
                {/* token address */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="token_address"
                    className="block font-normal tracking-wide"
                  >
                    Toke Address
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("token_address")}
                    id="token_address"
                    placeholder="Add address here"
                    className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.token_address && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.token_address.message}
                    </p>
                  )}
                </div>
                {/* Reward Token Address */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="reward_token_address"
                    className="block font-normal tracking-wide"
                  >
                    Reward Token Address
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("reward_token_address")}
                    id="reward_token_address"
                    placeholder="Add address here"
                    className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  <p
                    className={`text-12px text-gradient pb-2 pt-1 font-medium`}
                  >
                    If you leave this empty, token address will be use as Reward
                    token address
                  </p>
                  {stakingForm.formState.errors.reward_token_address && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {
                        stakingForm.formState.errors.reward_token_address
                          .message
                      }
                    </p>
                  )}
                </div>
                {/* multi level reward system */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="multilevel_rewards"
                    className="block font-normal tracking-wide"
                  >
                    Multilevel Rewards System
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <select
                    {...stakingForm.register("multilevel_rewards")}
                    id="multilevel_rewards"
                    className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
                    value={selectedValue}
                    onChange={handleChange}
                  >
                    <option value="" className="bg-black text-gray-shade-17">
                      Select Any
                    </option>
                    <option className="bg-black text-white" value="No referral">
                      No referral
                    </option>
                    <option
                      className="bg-black text-white"
                      value="Recurring Return (0 to 6 levels)"
                    >
                      Recurring Return (0 to 6 levels)
                    </option>
                    <option
                      className="bg-black text-white"
                      value="Fix Commission (0 to 6 levels)"
                    >
                      Fix Commission (0 to 6 levels)
                    </option>
                  </select>
                  {selectedValue === "Recurring Return (0 to 6 levels)" && (
                    <p
                      className={`text-12px text-gradient pb-2 pt-1 font-medium`}
                    >
                      Referrer rewards are claimable once per claim duration
                    </p>
                  )}
                  {stakingForm.formState.errors.multilevel_rewards && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.multilevel_rewards.message}
                    </p>
                  )}
                </div>
                {renderInputFields()}
                {/* APY */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="apy"
                    className="block font-normal tracking-wide"
                  >
                    APY
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    type="number"
                    {...stakingForm.register("apy")}
                    id="apy"
                    placeholder="For example: 2%"
                    className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.apy && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.apy.message}
                    </p>
                  )}
                </div>
                {/* Staking Period */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="staking_period"
                    className="block font-normal tracking-wide"
                  >
                    Staking Period
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <select
                    {...stakingForm.register("staking_period")}
                    id="staking_period"
                    className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
                  >
                    <option className="bg-black text-gray-shade-17" value="">
                      Select Any
                    </option>
                    <option className="bg-black text-white" value="15 days">
                      15 days
                    </option>
                    <option className="bg-black text-white" value="30 days">
                      30 days
                    </option>
                  </select>
                  {stakingForm.formState.errors.staking_period && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.staking_period.message}
                    </p>
                  )}
                </div>
                {/* start date */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="start_date"
                    className="block font-normal tracking-wide"
                  >
                    Start Date
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    type="date"
                    {...stakingForm.register("start_date")}
                    id="start_date"
                    placeholder="For example: DeXa Pack 1"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-yellow-400 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.start_date && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.start_date.message}
                    </p>
                  )}
                </div>
                {/* Rewards Release Start  */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="rewards_release_start"
                    className="block font-normal tracking-wide"
                  >
                    Rewards Release Start
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <select
                    {...stakingForm.register("rewards_release_start")}
                    id="rewards_release_start"
                    className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
                  >
                    <option className="bg-black text-gray-shade-17" value="">
                      Select Any
                    </option>
                    <option
                      className="bg-black text-white"
                      value="after 15 days"
                    >
                      after 15 days
                    </option>
                    <option
                      className="bg-black text-white"
                      value="after 30 days"
                    >
                      after 30 days
                    </option>
                    <option
                      className="bg-black text-white"
                      value="according to claim period"
                    >
                      according to claim period
                    </option>
                  </select>
                  {stakingForm.formState.errors.rewards_release_start && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {
                        stakingForm.formState.errors.rewards_release_start
                          .message
                      }
                    </p>
                  )}
                </div>
                {/* claim period */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="claim_period"
                    className="block font-normal tracking-wide"
                  >
                    Claim Period
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <select
                    {...stakingForm.register("claim_period")}
                    id="claim_period"
                    className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
                  >
                    <option className="bg-black text-gray-shade-17" value="">
                      Select Any
                    </option>
                    <option className="bg-black text-white" value="15 days">
                      15 days
                    </option>
                    <option className="bg-black text-white" value="30 days">
                      30 days
                    </option>
                  </select>
                  {stakingForm.formState.errors.claim_period && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.claim_period.message}
                    </p>
                  )}
                </div>
                {/*  Show on Centher */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="show_on_centher"
                    className="block font-normal tracking-wide"
                  >
                    Show on Centher
                  </label>
                  <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
                    <label
                      htmlFor="show_on_centher"
                      className="block font-normal tracking-wide"
                    >
                      Show on Centher
                    </label>
                    <div className=" flex flex-wrap gap-5">
                      <div className=" flex items-center">
                        <input
                          id="red-radio1"
                          type="radio"
                          value="no"
                          {...stakingForm.register("show_on_centher")}
                          className="red-radio text-14px h-4 w-4"
                        />
                        <label
                          htmlFor="red-radio1"
                          className="text-sm font-medium text-white"
                        >
                          No
                        </label>
                      </div>
                      <div className=" flex items-center">
                        <input
                          id="green-radio1"
                          type="radio"
                          value="yes"
                          {...stakingForm.register("show_on_centher")}
                          className="green-radio text-14px h-4 w-4"
                        />
                        <label
                          htmlFor="green-radio1"
                          className="text-sm font-medium text-white"
                        >
                          Yes
                        </label>
                      </div>
                    </div>
                  </div>
                  {stakingForm.watch("show_on_centher") === "yes" && (
                    <p
                      className={`text-12px text-gradient pb-2 pt-1 font-medium`}
                    >
                      This option costs 1 BNB when selecting YES
                    </p>
                  )}
                  {stakingForm.formState.errors.show_on_centher && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.show_on_centher.message}
                    </p>
                  )}
                </div>
                {/* Liquidity Pool Provided */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="liquidity_pool_provided"
                    className="block font-normal tracking-wide"
                  >
                    Liquidity Pool Provided
                  </label>
                  <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
                    <label
                      htmlFor="liquidity_pool_provided"
                      className="block font-normal tracking-wide"
                    >
                      Liquidity Pool Provided
                    </label>
                    <div className=" flex flex-wrap gap-5">
                      <div className=" flex items-center">
                        <input
                          id="red-radio2"
                          type="radio"
                          value="no"
                          {...stakingForm.register("liquidity_pool_provided")}
                          className="red-radio text-14px h-4 w-4"
                        />
                        <label
                          htmlFor="red-radio2"
                          className="text-sm font-medium text-white"
                        >
                          No
                        </label>
                      </div>
                      <div className=" flex items-center">
                        <input
                          id="green-radio2"
                          type="radio"
                          value="yes"
                          {...stakingForm.register("liquidity_pool_provided")}
                          className="green-radio text-14px h-4 w-4"
                        />
                        <label
                          htmlFor="green-radio2"
                          className="text-sm font-medium text-white"
                        >
                          Yes
                        </label>
                      </div>
                    </div>
                  </div>
                  {stakingForm.formState.errors.liquidity_pool_provided && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {
                        stakingForm.formState.errors.liquidity_pool_provided
                          .message
                      }
                    </p>
                  )}
                </div>
                {/*  Is Cancelable */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="is_cancelable"
                    className="block font-normal tracking-wide"
                  >
                    Is Cancelable
                  </label>
                  <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
                    <label
                      htmlFor="is_cancelable"
                      className="block font-normal tracking-wide"
                    >
                      Is Cancelable
                    </label>
                    <div className=" flex flex-wrap gap-5">
                      <div className=" flex items-center">
                        <input
                          id="red-radio3"
                          type="radio"
                          value="no"
                          {...stakingForm.register("is_cancelable")}
                          className="red-radio text-14px h-4 w-4"
                        />
                        <label
                          htmlFor="red-radio3"
                          className="text-sm font-medium text-white"
                        >
                          No
                        </label>
                      </div>
                      <div className=" flex items-center">
                        <input
                          id="green-radio3"
                          type="radio"
                          value="yes"
                          {...stakingForm.register("is_cancelable")}
                          className="green-radio text-14px h-4 w-4"
                        />
                        <label
                          htmlFor="green-radio3"
                          className="text-sm font-medium text-white"
                        >
                          Yes
                        </label>
                      </div>
                    </div>
                  </div>
                  {stakingForm.formState.errors.is_cancelable && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.is_cancelable.message}
                    </p>
                  )}
                </div>
                {/*   Charge Fee on Cancel */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="charge_fee_on_cancel"
                    className="block font-normal tracking-wide"
                  >
                    Charge Fee on Cancel
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("charge_fee_on_cancel")}
                    id="charge_fee_on_cancel"
                    placeholder="0%"
                    className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.charge_fee_on_cancel && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {
                        stakingForm.formState.errors.charge_fee_on_cancel
                          .message
                      }
                    </p>
                  )}
                </div>
                {/* Maximum Stakable Amount */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="max_staking_amount"
                    className="block font-normal tracking-wide"
                  >
                    Maximum Stakable Amount
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("max_staking_amount")}
                    id="max_staking_amount"
                    placeholder="Only numbers here"
                    className="focus:ring-brand-primar text-14pxy mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none"
                  />
                  {stakingForm.formState.errors.max_staking_amount && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.max_staking_amount.message}
                    </p>
                  )}
                </div>
                {/*    Minimum Stakable Amount */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="min_staking_amount"
                    className="block font-normal tracking-wide"
                  >
                    Minimum Stakable Amount
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("min_staking_amount")}
                    id="min_staking_amount"
                    placeholder="Example: 100000000000"
                    className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  <p
                    className={`text-12px text-gradient pb-2 pt-1 font-medium`}
                  >
                    if you set a min value then staking amount is always a
                    coefficient of this value, for example if min value is 250,
                    then allowed amounts are 250,500,750,1000,etc
                  </p>
                  {stakingForm.formState.errors.min_staking_amount && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.min_staking_amount.message}
                    </p>
                  )}
                </div>
                {/* Total Supply */}
                <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="total_supply"
                    className="block font-normal tracking-wide"
                  >
                    Total Supply
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    type="number"
                    {...stakingForm.register("total_supply")}
                    id="total_supply"
                    placeholder="Only numbers here"
                    className="focus:ring-brand-primar text-14pxy mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none"
                  />
                  {stakingForm.formState.errors.total_supply && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.total_supply.message}
                    </p>
                  )}
                </div>

                <div className="text-14px col-span-2 w-full font-medium text-white">
                  <label htmlFor="test" className="block font-normal">
                    Project Metadata
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="mt-2 flex w-full  items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
                    <span className="text-14px text-gray-shade-17">
                      Add metadata here{" "}
                    </span>
                    {metaDataList.length < 8 && (
                      <button
                        onClick={() => {
                          setMetaDataModal(true);
                        }}
                      >
                        <BsPlusCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  {metaDataErr && (
                    <p
                      className={`text-12px pb-2 pt-[2px] font-medium text-red-500`}
                    >
                      {metaDataErr}
                    </p>
                  )}
                </div>

                {metaDataList?.length > 0 && (
                  <div className="col-span-2 flex w-full rounded-lg bg-black-shade-3 px-6 py-5">
                    <div
                      className={
                        "grid w-full gap-[2%] rounded-[14px]  md:grid-cols-4"
                      }
                    >
                      {metaDataList.map((item: metaDataType, index: number) => {
                        return (
                          <div
                            key={index}
                            className="gradientborders2 relative mb-[2%] flex h-[98px] w-full flex-col items-center justify-center gap-3 rounded-10px bg-background-shade-3 p-[2px] "
                          >
                            <button
                              className="absolute top-[-4px] right-[-4px] flex h-5 w-5 items-center justify-center rounded-full border border-gray-shade-3 bg-elevation-1 text-center"
                              onClick={() => {
                                handleMetaDataRemove(item.title);
                              }}
                            >
                              <IoIosClose className="text-xl text-white" />
                            </button>
                            <h5 className="text-12px textGradient font-medium">
                              {item.title}
                            </h5>
                            <h6 className="text-14px font-semibold text-white">
                              {item.data}
                            </h6>
                          </div>
                        );
                      })}{" "}
                    </div>
                  </div>
                )}
                <p className="text-14px col-span-2 font-normal text-gray-shade-14">
                  <span className="text-white">Note:</span> For create each
                  project you will pay a fee of{" "}
                  <span className="text-gradient"> 1.00 BNB</span>
                </p>
              </div>
              <FinalButton
                title="Next"
                variant="primary"
                className={cn("text-14px mx-auto mt-5 w-[45%]", {
                  hidden: formStep == 1,
                })}
                onClick={handleNext}
              />
            </div>

            {metaDataModal && (
              <CustomModal
                onClose={() => {
                  setMetaDataModal(false);
                }}
                title={"Add new metadata"}
              >
                <div className="mt-8 flex w-full flex-col gap-2 p-[2px] text-center">
                  <div className="flex w-full flex-col gap-2">
                    <label className="text-14px text-start font-normal text-white">
                      Type
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      autoComplete="off"
                      placeholder="Project"
                      className="text-14px w-full rounded-lg  border-0 !bg-black-shade-2  py-3 px-5 font-semibold text-white ring-2 ring-black-shade-7 focus:outline-none focus:!ring-brand-primary active:!ring-brand-primary"
                      onChange={handleMetaDataChange}
                      value={metaDataDetails.title}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <label className="text-14px text-start font-normal text-white">
                      Name
                    </label>
                    <input
                      type="text"
                      name="data"
                      id="data"
                      autoComplete="off"
                      placeholder="Premium"
                      className="text-14px w-full rounded-lg  border-0 !bg-black-shade-2  py-3 px-5 font-semibold text-white ring-2 ring-black-shade-7 focus:outline-none focus:!ring-brand-primary active:!ring-brand-primary"
                      onChange={handleMetaDataChange}
                      value={metaDataDetails.data}
                    />
                  </div>
                  {metaDataErr && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {metaDataErr}
                    </p>
                  )}
                  <FinalButton
                    title={"Save"}
                    variant="primary"
                    onClick={addNewMetaDataFunc}
                    className="mt-2 hover:!scale-95"
                  />
                </div>
              </CustomModal>
            )}
          </motion.div>
          {/* form2 */}
          <motion.div
            className={cn("min-w-[85%] flex-1 fmd:min-w-full", {
              hidden: formStep == 0,
            })}
            animate={{
              translateX: `${100 - formStep * 100}%`,
            }}
          >
            <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-gray-shade-3 bg-black-shade-9 p-6">
              <div className="mb-2 grid w-full gap-6 md:grid-cols-2">
                <div className="text-14px col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="websiteUrl"
                    className="block font-normal tracking-wide"
                  >
                    Website URL
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <input
                    {...stakingForm.register("websiteUrl")}
                    type="text"
                    id="websiteUrl"
                    placeholder="Example: yourweb.com/"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.websiteUrl && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.websiteUrl.message}
                    </p>
                  )}
                </div>

                <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="facebook"
                    className="block font-normal tracking-wide"
                  >
                    Facebook
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("facebook")}
                    id="facebook"
                    placeholder="Example: yourlogo.com/"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.facebook && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.facebook.message}
                    </p>
                  )}
                </div>

                <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="twitter"
                    className="block font-normal tracking-wide"
                  >
                    Twitter
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("twitter")}
                    id="twitter"
                    placeholder="Example: t.com/"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.twitter && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.twitter.message}
                    </p>
                  )}
                </div>

                <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="github"
                    className="block font-normal tracking-wide"
                  >
                    Github
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("github")}
                    id="github"
                    placeholder="Example: github.com/"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.github && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.github.message}
                    </p>
                  )}
                </div>

                <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="telegram"
                    className="block font-normal tracking-wide"
                  >
                    Telegram
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("telegram")}
                    id="telegram"
                    placeholder="Example: yourtel.com/"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.telegram && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.telegram.message}
                    </p>
                  )}
                </div>

                <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="instagram"
                    className="block font-normal tracking-wide"
                  >
                    Instagram
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("instagram")}
                    id="instagram"
                    placeholder="Example: instagram.com/"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.instagram && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.instagram.message}
                    </p>
                  )}
                </div>

                <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="discord"
                    className="block font-normal tracking-wide"
                  >
                    Discord
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("discord")}
                    id="discord"
                    placeholder="Example: yourweb.com/"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.discord && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.discord.message}
                    </p>
                  )}
                </div>

                <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="reddit"
                    className="block font-normal tracking-wide"
                  >
                    Reddit
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("reddit")}
                    id="reddit"
                    placeholder="Example: reddit.com/"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.reddit && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.reddit.message}
                    </p>
                  )}
                </div>

                <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="explorers"
                    className="block font-normal tracking-wide"
                  >
                    Explorers
                    <span className="text-gradient ml-[1px]">*</span>
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("explorers")}
                    id="explorers"
                    placeholder="Example: BscScan"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.explorers && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.explorers.message}
                    </p>
                  )}
                </div>

                <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
                  <label
                    htmlFor="category"
                    className="block font-normal tracking-wide"
                  >
                    Category
                    <span className="text-gradient ml-[1px]">*</span>
                  </label>
                  <input
                    type="text"
                    {...stakingForm.register("category")}
                    id="category"
                    placeholder="Example: Decentralised Finance"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.category && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div className="text-14px col-span-2 w-full font-medium text-white">
                  <label
                    htmlFor="description"
                    className="block font-normal tracking-wide"
                  >
                    Description
                    <span className="text-gradient ml-[1px]">*</span>
                  </label>
                  <textarea
                    {...stakingForm.register("description")}
                    id="description"
                    rows={4}
                    placeholder="Example: This is the best project"
                    className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                  />
                  {stakingForm.formState.errors.description && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {stakingForm.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="text-14px col-span-2 w-full font-medium text-white">
                  <label
                    htmlFor="jobTitle"
                    className="block font-normal tracking-wide"
                  >
                    Team Members
                  </label>
                  <div className="mt-4 w-full rounded-lg border-[1px] border-gray-shade-3">
                    <div className="grid gap-6 p-6 pb-0  md:grid-cols-2">
                      {/* Job title input */}
                      <div className="text-14px w-full font-medium text-white">
                        <label
                          htmlFor="jobTitle"
                          className="block font-normal tracking-wide"
                        >
                          Job title
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          id="jobTitle"
                          placeholder="Example: CEO, CTO, COO etc"
                          className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                          value={memberData.jobTitle}
                          onChange={handleMemberInputChange}
                        />
                      </div>

                      {/* Wallet public address input */}
                      <div className="text-14px w-full font-medium text-white">
                        <label
                          htmlFor="walletAddress"
                          className="block font-normal tracking-wide"
                        >
                          Wallet public address
                        </label>
                        <input
                          type="text"
                          name="walletAddress"
                          id="walletAddress"
                          placeholder="Example: 0x018rhf63hjj7763kuxx098nbvxx90cc23BBK99KXX028"
                          className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                          value={memberData.walletAddress}
                          onChange={handleMemberInputChange}
                        />
                      </div>
                      {memberError && (
                        <p
                          className={`text-12px pb-2 font-medium text-red-500`}
                        >
                          {memberError}
                        </p>
                      )}
                    </div>

                    {/* Button aligned to the right */}
                    <div className="flex justify-end px-6 py-5">
                      <FinalButton
                        title="Add Members"
                        onClick={handleAddMember}
                        variant="primary"
                        className="text-14px max-w-fit"
                        disabled={
                          !memberData.jobTitle || !memberData.walletAddress
                        }
                      />
                    </div>
                    {/* Display added members */}
                    <div className=" ">
                      {members.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-t-[1px] border-gray-shade-3 py-4 px-6 text-white"
                        >
                          <div className="flex items-center gap-1">
                            <TeamMemberIcon />
                            <span>{member.jobTitle}</span>
                            <span>-</span>
                            <span>{member.walletAddress}</span>
                          </div>
                          <button
                            className="ml-2 text-red-500"
                            onClick={() => handleRemoveMember(index)}
                          >
                            <IoClose className="ioCLose h-5 w-5 fill-[#E34048]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <FinalButton
                title="Submit Now"
                onClick={stakingForm.handleSubmit(handleDetails)}
                variant="primary"
                className={cn("text-14px mx-auto mt-5 w-[45%]", {
                  hidden: formStep == 0,
                })}
                disabled={!stakingForm.formState.isValid}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {showMsg && showMsg}
    </section>
  );
};

CreateStaking.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Staking">
    <div className="mx-auto w-full max-w-[1144px] bg-black-shade-3 font-monto ">
      {page}
    </div>
  </AllPagesWrapper>
);

export default CreateStaking;
