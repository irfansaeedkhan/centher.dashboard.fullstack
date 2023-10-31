import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";
import Joi from "joi";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Select, { StylesConfig } from "react-select";
import { IoClose } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { BsArrowLeftShort, BsPlusCircle } from "react-icons/bs";
import { isAddress } from "ethers/lib/utils";
import cn from "@/utils/cn";
import { CrossIcon, TeamMemberIcon } from "@/assets/svgs";
import { NextPageWithLayout } from "@/pages/_app.page";
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { eqAddress } from "@/live/utils/address.utils";
import { CreatePoolStepsEnum } from "@/staking/enum/create-pool-steps.enum";
import useUser from "@/hooks/use.user";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";
import {
  CreatePoolCallContractError,
  CreatePoolCallStaticError,
  CreatePoolParamsError,
  CreatePoolUploadBannerError,
  CreatePoolUploadLogoError,
  CreatePoolUploadMetadataError,
  InsufficientFundError,
  InvalidAffiliateSystemSettings,
  WalletApprovalError,
  WalletConnectedError,
} from "@/staking/errors/params.error";
import { PreLoader } from "@/components/pre.loader";
import { useStaking } from "@/hooks/staking";
import { BlockchainRead } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import { StakingSuccessModal } from "./_components/staking-success-modal";
import {
  MultiLevelRewards,
  levelDataType,
  metaDataType,
  stakingFormInterface,
  stakingFormInterfaceUpdated,
  teamMember,
} from "../_components/staking-types";
import { StakingFailureModal } from "./_components/staking-failure-modal";
import { StakingReviewModal } from "./_components/staking-review-modal";
import {
  AddAffiliateSettingsInput,
  CreatePoolInput,
  CreatePoolMetadata,
  OptionalType,
  StakingFiles,
} from "@/staking/types";
import { StakingProgressModal } from "./_components/staking-progress-modal";
import { ProgressModal } from "./dto/progress-modal.dto";
import {
  claimPeriodOptions,
  firstReward,
  stakingPeriodOptions,
} from "../constants";
import DropdownStakingForm from "../_components/dropdown-staking-form";

const categoryOptions = [
  { value: "Metaverse", label: "Metaverse" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Decentralised Finance", label: "Decentralised Finance" },
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
];

const CreateStaking: NextPageWithLayout = () => {
  const [formStep, setFormStep] = useState(0);
  const [totalPercentageError, setTotalPercentageError] = useState(false);
  const [showMsg, setshowMsg] = useState<any>(null);
  // start upload images and videos
  const [showCoverImage, setShowCoverImage] = useState<boolean | null>(false);
  const [showProfileImage, setShowProfileImage] = useState<boolean | null>(
    false
  );
  const [profile, setProfile] = useState<OptionalType<Blob>>(undefined);
  const [cover, setCover] = useState<OptionalType<Blob>>(undefined);
  const [profileErr, setProfileErr] = useState(false);
  const [coverErr, setCoverErr] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const [progressModel, setProgressModel] = useState<ProgressModal | null>(
    null
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const { user: loggedInUser } = useUser();
  const { connectWallet, disconnectWallet, getSigner, connectedAddress } =
    useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const { sdk } = useStaking();
  const [isDifferentTokens, setIsDifferentTokens] = useState(false);
  const [stakingToken, setStakingToken] = useState("");
  const [isCancelable, setIsCancelable] = useState("no");
  const [isLP, setIsLP] = useState("no");
  const [metaDataDetails, setMetaDataDetails] = useState<metaDataType>({
    title: "",
    data: "",
  });
  const [metaDataModal, setMetaDataModal] = useState(false);
  const [metaDataErr, setMetaDataErr] = useState<null | string>(null);
  const [metaDataList, setMetaDataList] = useState<metaDataType[]>([]);
  const [members, setMembers] = useState<teamMember[]>([]);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState({
    jobTitle: "",
    walletAddress: "",
  });

  const [selectedValue, setSelectedValue] = useState<MultiLevelRewards>("");
  const [inputValues, setInputValues] = useState<levelDataType[]>([]);

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
    if (getSigner() && connectedAddress?.length) {
      setIsConnected(true);
    } else setIsConnected(false);
  }, [getSigner, connectedAddress]);

  useEffect(() => {
    if (clearForm) {
      setShowProfileImage(false);
      setProfile(undefined);
      setShowCoverImage(false);
      setCover(undefined);
    }
  }, [clearForm, setCover, setProfile]);
  // end upload images and videos

  // start handle metadata

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
  // end handle metadata

  // start handle level system
  const handleMultilevelChange = (value: MultiLevelRewards) => {
    setSelectedValue(value);

    if (value === "No referral") {
      setInputValues([]);
    } else if (
      value === "Recurring Return (0 to 6 levels)" ||
      value === "Fix Commission (0 to 6 levels)"
    ) {
      const numLevels: number = 6;
      const newInputValues: levelDataType[] = Array.from(
        { length: numLevels },
        (_, index) => ({
          level: index + 1,
          percent: 0,
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

    if (inputValue === "0") {
      const numericValue: number = parseFloat(inputValue);
      const newInputValues: levelDataType[] = [...inputValues];
      newInputValues[index].percent = numericValue;
      setInputValues(newInputValues);
    } else {
      const numericValue: number = parseFloat(inputValue);
      if (!isNaN(numericValue) && isFinite(numericValue) && numericValue >= 0) {
        const newInputValues: levelDataType[] = [...inputValues];
        newInputValues[index].percent = numericValue;
        setInputValues(newInputValues);

        // Calculate total percentage and check if it's over 100
        const totalPercentage = newInputValues.reduce(
          (total, input) => total + input.percent,
          0
        );
        setTotalPercentageError(totalPercentage > 100);
      } else {
        const newInputValues: levelDataType[] = [...inputValues];
        newInputValues[index].percent = 0;
        setInputValues(newInputValues);
      }
    }
  };

  const renderInputFields = (): JSX.Element[] => {
    const numLevels: number = inputValues.length;

    return Array.from({ length: numLevels }, (_, index) => (
      <div
        key={index}
        className={clsx(
          `col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0 ${
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
        <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
          <input
            type="number"
            name={`level-${index + 1}`}
            id={`level-${index + 1}`}
            placeholder="0%"
            className="block w-full appearance-none rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
            value={String(inputValues[index].percent) || ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(event, index)
            }
            title="Please enter numbers only"
            required
          />
        </div>
      </div>
    ));
  };
  // end handle level system

  // start joi validation
  const stakingFormSchema = Joi.object({
    staking_name: Joi.string().max(200).label("staking_name"),
    token_address: Joi.custom((val: any, helper: any) => {
      if (!isAddress(val)) {
        return helper.error("invalid_address");
      }
      return val;
    })
      .label("token address")
      .messages({
        invalid_address: "Invalid address",
      }),
    reward_token_address: Joi.string()
      .optional()
      .allow("")
      .custom((val: any, helper: any) => {
        if (val?.length > 0 && !isAddress(val)) {
          return helper.error("invalid_address");
        }
        return val;
      })
      .label("reward token address")
      .messages({
        invalid_address: "Invalid address",
      }),
    multilevel_rewards: Joi.string().max(100).label("multilevel rewards"),
    apy: Joi.number().min(0).label("apy"),
    staking_reward_token_price_ratio: Joi.number()
      .max(1000000)
      .min(0)
      .optional()
      .allow("")
      .label("staking Reward Token Price Ratio"),
    staking_period: Joi.number().label("staking period"),
    start_date: Joi.string().max(150).label("start date"),
    claim_period: Joi.string().max(150).label("claim period"),
    rewards_release_start: Joi.string().max(150).label("rewards release start"),
    show_on_centher: Joi.string().max(10).label("show on centher"),
    liquidity_pool_provided: Joi.string()
      .max(10)
      .label("liquidity pool provided"),
    is_cancelable: Joi.string().valid("yes", "no").label("is cancelable"),
    charge_fee_on_cancel: Joi.when("is_cancelable", {
      is: "yes",
      then: Joi.number().min(0).max(100).label("charge fee on cancel"),
      otherwise: Joi.number()
        .optional()
        .allow("")
        .min(0)
        .label("charge fee on cancel"),
    }),
    min_staking_amount: Joi.number().min(0).label("min staking amount"),
    // max_staking_amount: Joi.number().label("max staking amount"),
    max_staking_amount: Joi.when("liquidity_pool_provided", {
      is: "yes",
      then: Joi.number().min(0).label("liquidity pool provided"),
      otherwise: Joi.number()
        .optional()
        .allow("")
        .min(0)
        .label("liquidity pool provided"),
    }),
    // total_supply: Joi.number().min(1).label("max staking amount"),
    total_supply: Joi.when("liquidity_pool_provided", {
      is: "yes",
      then: Joi.number().min(0).label("total sypply"),
      otherwise: Joi.number().optional().allow("").min(0).label("total sypply"),
    }),
    website_url: Joi.string().max(150).label("website_url"),
    whitepaper: Joi.string().max(150).label("whitepaper"),
    facebook: Joi.string().max(150).optional().allow("").label("facebook"),
    twitter: Joi.string().max(150).optional().allow("").label("twitter"),
    github: Joi.string().max(150).optional().allow("").label("github"),
    telegram: Joi.string().max(150).optional().allow("").label("telegram"),
    instagram: Joi.string().max(150).optional().allow("").label("instagram"),
    discord: Joi.string().max(150).optional().allow("").label("discord"),
    reddit: Joi.string().max(150).optional().allow("").label("reddit"),
    explorers: Joi.string().max(150).label("explorers"),
    category: Joi.array()
      .items(
        Joi.object({
          value: Joi.string(),
          label: Joi.string(),
        })
      )
      .min(1)
      .required()
      .label("Category")
      .messages({
        "array.min": "At least one category must be selected",
      }),
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
      category: [],
      start_date: new Date(+new Date() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    },
  });

  // form2 start
  // handle adding members

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

  const submitForm = async (data: stakingFormInterface) => {
    let finalData = {
      profile_image: profile,
      cover_image: cover,
      staking_name: data.staking_name,
      token_address: data.token_address,
      reward_token_address: data.reward_token_address,
      multilevel_rewards: data.multilevel_rewards,
      apy: data.apy,
      staking_reward_token_price_ratio: data.staking_reward_token_price_ratio,
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
      website_url: data.website_url,
      whitepaper: data.whitepaper,
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
      centher: "",
      members: members,
    };

    const isTokenAddressValid = await BlockchainRead.isContractAddress(
      getSigner()!,
      finalData.token_address
    );

    if (!isTokenAddressValid) {
      setshowMsg(
        <StakingFailureModal
          onClickClose={onClickClose}
          retryFunc={retryFunc}
          message={`Token with address "${finalData.token_address}" does not exist on network`}
        />
      );
      return;
    }

    if (
      finalData.reward_token_address &&
      finalData.reward_token_address.length > 0 &&
      !eqAddress(finalData.token_address, finalData.reward_token_address)
    ) {
      const isTokenAddressValid = await BlockchainRead.isContractAddress(
        getSigner()!,
        finalData.reward_token_address
      );

      if (!isTokenAddressValid) {
        setshowMsg(
          <StakingFailureModal
            onClickClose={onClickClose}
            retryFunc={retryFunc}
            message={`Token with address "${finalData.reward_token_address}" does not exist on network`}
          />
        );
        return;
      }
    }

    if (finalData) {
      previewBoxModalFunc(finalData);
    }
  };

  const afterSubmitMapper = async (data: stakingFormInterface) => {
    if (!getSigner() || !connectedAddress?.length) {
      throw new WalletConnectedError("connect you wallet");
    }

    if (!sdk) {
      throw new Error("reload the page");
    }

    setshowMsg(null);

    const metadata: CreatePoolMetadata = {
      library: metaDataList,
      banner: "",
      icon: "",
      socialMedias: [
        { name: "website_url", link: data.website_url },
        { name: "whitepaper", link: data.whitepaper },
        { name: "facebook", link: data.facebook },
        { name: "twitter", link: data.twitter },
        { name: "github", link: data.github },
        { name: "telegram", link: data.telegram },
        { name: "instagram", link: data.instagram },
        { name: "discord", link: data.discord },
        { name: "reddit", link: data.reddit },
        { name: "explorers", link: data.explorers },
      ],
      categories: data.category,
      description: data.description,
      team: members,
    };

    const input: CreatePoolInput = {
      name: data.staking_name,
      startTime: data.start_date,
      ownerAddress: connectedAddress,
      stakeToken: data.token_address,
      rewardToken: data.reward_token_address,
      rate:
        data.staking_reward_token_price_ratio &&
        data.staking_reward_token_price_ratio > 0
          ? data.staking_reward_token_price_ratio
          : 0,
      annualStakingRewardRate: data.apy ? data.apy : 0,
      minStakeAmount: data.min_staking_amount ? data.min_staking_amount : 0,
      maxStakeAmount: data.max_staking_amount ? data.max_staking_amount : 0,
      stakingDurationPeriod: data.staking_period ? +data.staking_period : 0,
      claimDuration: data.claim_period
        ? +data.claim_period == -1
          ? +data.staking_period
          : +data.claim_period
        : 0,
      rewardModeForRef:
        data.multilevel_rewards == "No referral"
          ? 0
          : data.multilevel_rewards == "Fix Commission (0 to 6 levels)"
          ? 1
          : 2,
      firstReward: data.rewards_release_start ? +data.rewards_release_start : 0,
      maxStakableAmount: data.total_supply ? data.total_supply : 0,
      cancellationFees: data.charge_fee_on_cancel
        ? data.charge_fee_on_cancel
        : 0,
      poolMetadata: metadata,
      metaDataUrl: "",
      isUnstakable: data.is_cancelable == "yes" ? true : false,
      isLP: data.liquidity_pool_provided == "yes" ? true : false,
      showOnCenther: data.show_on_centher == "yes" ? true : false,
    };

    const files: StakingFiles = {
      banner: cover,
      logo: profile,
    };

    let affiliateSetting: OptionalType<AddAffiliateSettingsInput> = null;

    if (data.multilevel_rewards != "No referral") {
      const levelOne = inputValues.find((e) => e.level == 1);
      const levelTwo = inputValues.find((e) => e.level == 2);
      const levelThree = inputValues.find((e) => e.level == 3);
      const levelFour = inputValues.find((e) => e.level == 4);
      const levelFive = inputValues.find((e) => e.level == 5);
      const levelSix = inputValues.find((e) => e.level == 6);

      affiliateSetting = {
        levelOne: levelOne ? levelOne.percent * 100 : 0,
        levelTwo: levelTwo ? levelTwo.percent * 100 : 0,
        levelThree: levelThree ? levelThree.percent * 100 : 0,
        levelFour: levelFour ? levelFour.percent * 100 : 0,
        levelFive: levelFive ? levelFive.percent * 100 : 0,
        levelSix: levelSix ? levelSix.percent * 100 : 0,
      };

      if (
        affiliateSetting.levelOne +
          affiliateSetting.levelTwo +
          affiliateSetting.levelThree +
          affiliateSetting.levelFour +
          affiliateSetting.levelFive +
          affiliateSetting.levelSix <=
        0
      ) {
        throw new InvalidAffiliateSystemSettings(
          "You need to add percent at least for one level, otherwise use no referral mode."
        );
      }
    }

    await sdk.createPool(
      getSigner()!,
      input,
      files,
      affiliateSetting,
      (title: CreatePoolStepsEnum, value: number) => {
        progressCallbackHandler(title, value);
      }
    );
    await setProgressModel(null);
  };

  const progressCallbackHandler = useCallback(
    (title: CreatePoolStepsEnum, value: number) => {
      setProgressModel({
        title,
        value,
      });
    },
    [setProgressModel]
  );

  const retryFunc = () => {
    setshowMsg(null);
    setFormStep(0);
  };

  const onClickClose = () => {
    setProgressModel(null);
    setshowMsg(null);
  };

  const handleNext = async () => {
    if (!profile) {
      setProfileErr(true);
      return;
    }
    if (!cover) {
      setCoverErr(true);
      return;
    }
    if (totalPercentageError) {
      return;
    }

    await stakingForm.trigger([
      "staking_name",
      "token_address",
      "reward_token_address",
      "multilevel_rewards",
      "apy",
      "staking_reward_token_price_ratio",
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
    const staking_reward_token_price_ratio = stakingForm.getFieldState(
      "staking_reward_token_price_ratio"
    );
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
      staking_reward_token_price_ratio.invalid ||
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
      return;
    } else {
      setProfileErr(false);
      setCoverErr(false);
      setFormStep(1);
    }
  };

  const previewBoxModalFunc = async (data: stakingFormInterfaceUpdated) => {
    setIsLoading(true);
    await setshowMsg(
      <StakingReviewModal
        data={data}
        onClickClose={onClickClose}
        createStaking={createStaking}
        loaded={() => {
          setIsLoading(false);
        }}
      />
    );
  };

  const createStaking = async (data: stakingFormInterfaceUpdated) => {
    try {
      await afterSubmitMapper(data);
      setshowMsg(<StakingSuccessModal onClickClose={onClickClose} />);
      stakingForm.reset({
        staking_name: "",
        token_address: "",
        multilevel_rewards: "",
        apy: null,
        staking_reward_token_price_ratio: null,
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
        website_url: "",
        whitepaper: "",
        facebook: "",
        twitter: "",
        github: "",
        telegram: "",
        instagram: "",
        discord: "",
        reddit: "",
        explorers: "",
        category: [],
        description: "",
      });

      setMetaDataList([]);
      setInputValues([]);
      setSelectedValue("");
      setMemberError(null);
      setMembers([]);
      setClearForm(true);
      setFormStep(0);
    } catch (error: any) {
      let message = "";
      if (error instanceof CreatePoolParamsError) {
        message = `${error.field}:  ${error.message}`;
      }

      if (error instanceof CreatePoolCallStaticError) {
        message = `Examinate network:  ${error.message}`;
      }

      if (error instanceof CreatePoolCallContractError) {
        message = `Contract call:  ${error.message}`;
      }

      if (error instanceof CreatePoolUploadBannerError) {
        message = `Upload banner:  ${error.message}`;
      }

      if (error instanceof CreatePoolUploadLogoError) {
        message = `Upload logo:  ${error.message}`;
      }

      if (error instanceof CreatePoolUploadMetadataError) {
        message = `Create metadata:  ${error.message}`;
      }

      if (error instanceof InsufficientFundError) {
        message = `Wallet balance :  ${error.message}`;
      }

      if (error instanceof WalletApprovalError) {
        message = `Wallet approval:  ${error.message}`;
      }

      if (error instanceof WalletConnectedError) {
        message = `Wallet:  ${error.message}`;
      }

      if (error instanceof InvalidAffiliateSystemSettings) {
        message = `Affiliate setting:  ${error.message}`;
      }

      await setProgressModel(null);

      if (message.includes("user rejected transaction")) {
        message = "Transaction rejected";
      }

      if (message.includes("call revert exception")) {
        message =
          "Something went wrong while we called smart contract, please try again after a while or contact support.";
      }

      setshowMsg(
        <StakingFailureModal
          onClickClose={onClickClose}
          retryFunc={retryFunc}
          message={message}
        />
      );
    }
  };

  // styles for multiple select dropdown
  const customStyles: StylesConfig = {
    control: (provided: any, state: any) => ({
      ...provided,
      background: "#17171a",
      boxShadow: state.isFocused ? "0 0 0 1px #febf32" : "0 0 0 1px #17171a",
      borderColor: state.isFocused ? "#febf32" : "#17171a",
      borderRadius: "8px",
      cursor: "pointer",
      padding: "2px 5px",
      ":hover": {
        borderColor: "#febf32",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      background: state.isFocused ? "#17171a" : "#141416",
      color: state.isFocused ? "#febf32" : "white",
      cursor: "pointer",
    }),
    menu: (provided: any) => ({
      ...provided,
      background: "#17171a",
      zIndex: 2,
      color: "white",
    }),
    menuList: (provided: any) => ({
      ...provided,
      background: "17171a",
      color: "white",
    }),
    multiValue: (provided: any, state: any) => ({
      ...provided,
      background: "#1e212b",
      borderColor: state.isFocused ? "yellow" : "red",
      borderRadius: "8px",
      color: "white",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "white",
      backgroundColor: "transparent",
      borderRadius: "50%",
      ":hover": {
        color: "#febf32",
        backgroundColor: "transparent",
      },
    }),
    clearIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.isFocused ? "#febf32" : "white",
    }),
  };

  const rewardTokenChanged = (e: any) => {
    const rewardToken = e.target.value;
    if (
      rewardToken?.length > 0 &&
      stakingToken?.length > 0 &&
      isAddress(rewardToken) &&
      isAddress(stakingToken) &&
      !eqAddress(rewardToken, stakingToken)
    ) {
      setIsDifferentTokens(true);
    } else {
      setIsDifferentTokens(false);
    }
  };

  return (
    <section className="flex w-full">
      <div className=" flex flex-grow flex-col">
        <div className="flex items-center gap-3 pb-6">
          <button
            onClick={() => {
              setFormStep(0);
            }}
            className={cn(
              "hover:gradient-border-3 group flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-shade-9 p-[1px]",
              {
                hidden: formStep == 0,
              }
            )}
          >
            <BsArrowLeftShort className="h-6 w-6 fill-gray-shade-18 group-hover:fill-white" />
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
            <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-gray-shade-3 bg-black-shade-9 p-3 fmd:p-6">
              {/* logo and cover  */}

              <div className="flex w-full flex-col gap-6">
                <div className="w-full  max-w-[340px]">
                  <p className="text-gradient pb-4 text-xs font-normal">
                    <span className="text-gradient">( * )</span>{" "}
                    <span className="text-gradient">is required</span>
                  </p>
                  <h4 className="pb-2 text-sm font-semibold text-white">
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
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
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
                        className="leading-0 absolute right-5 top-4 z-30 flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-gray-shade-3 bg-gray-shade-3/50 font-semibold leading-none opacity-100 outline-none backdrop-blur-lg focus:outline-none [&>*>*]:stroke-white [&>*]:transition"
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
                          htmlFor="staking-profile-image"
                          className=" absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] border border-gray-shade-3 bg-transparent text-center text-sm font-bold leading-normal text-white hover:bg-[#1E202B]"
                        >
                          Choose File
                        </label>
                        <input
                          type="file"
                          id="staking-profile-image"
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
                          htmlFor="staking-profile-image"
                          className=" absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] border border-gray-shade-3 bg-transparent text-center text-sm font-bold leading-normal text-white hover:bg-[#1E202B]"
                        >
                          Choose File
                        </label>
                        <input
                          type="file"
                          id="staking-profile-image"
                          className="absolute h-full w-full opacity-0"
                          onChange={uploadProfileFile}
                          accept="image/png, image/jpeg, image/webp, image/gif"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="pb-2 text-sm font-semibold text-white">
                    Upload banner image <span className="text-gradient">*</span>
                  </h4>
                  <p className="w-full max-w-[544px] text-xs font-normal leading-6 text-[#A0A4BB]">
                    This image will appear at the top of your staking page.
                    Avoid including too much text in this banner image, 1400 x
                    350 recommended.
                  </p>
                  {coverErr && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
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
                          className="leading-0 [&>*] absolute right-5 top-4 z-30 flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-gray-shade-3 bg-gray-shade-3/50 font-semibold leading-none opacity-100 outline-none backdrop-blur-lg focus:outline-none [&>*>*]:stroke-white [&>*]:transition"
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
                          <span className="text-xs font-semibold text-gray-shade-7">
                            PNG, JPG, GIF
                          </span>
                          <div className="relative h-10 w-[132px]">
                            <label
                              htmlFor="staking-banner-image"
                              className="absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] border border-gray-shade-3 bg-transparent text-center text-sm font-bold leading-normal text-white hover:bg-[#1E202B]"
                            >
                              Choose File
                            </label>
                            <input
                              type="file"
                              id="staking-banner-image"
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
              <div className="mb-2 grid w-full gap-4 fmd:grid-cols-2 fmd:gap-6">
                {/* staking name */}
                <div className="col-span-2 w-full  text-sm font-medium text-white md:col-span-2">
                  <label
                    htmlFor="staking_name"
                    className="block font-normal tracking-wide"
                  >
                    Staking Name
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                    <input
                      type="text"
                      {...stakingForm.register("staking_name")}
                      id="staking_name"
                      placeholder="For example: DeXa Pack 1"
                      className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                    />
                  </div>
                  {stakingForm.formState.errors.staking_name && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.staking_name.message}
                    </p>
                  )}
                </div>
                {/* token address */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="token_address"
                    className="block font-normal tracking-wide"
                  >
                    Token Address
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                    <input
                      type="text"
                      {...stakingForm.register("token_address")}
                      onChange={(e: any) => {
                        setStakingToken(e.target.value);
                      }}
                      id="token_address"
                      placeholder="Add address here"
                      className="block w-full appearance-none rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                    />
                  </div>
                  {stakingForm.formState.errors.token_address && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.token_address.message}
                    </p>
                  )}
                </div>
                {/* Reward Token Address */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="reward_token_address"
                    className="block font-normal tracking-wide"
                  >
                    Reward Token Address
                  </label>
                  <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                    <input
                      type="text"
                      {...stakingForm.register("reward_token_address")}
                      id="reward_token_address"
                      placeholder="Add address here"
                      onChange={rewardTokenChanged}
                      className="block w-full appearance-none rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <p className={`text-gradient pb-2 pt-1 text-xs font-medium`}>
                    If you leave this empty, token address will be use as Reward
                    token address
                  </p>
                  {stakingForm.formState.errors.reward_token_address && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {
                        stakingForm.formState.errors.reward_token_address
                          .message
                      }
                    </p>
                  )}
                </div>

                {
                  /* Staking / Reward Token Price Ratio */
                  isDifferentTokens && (
                    <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                      <label
                        htmlFor="staking_reward_token_price_ratio"
                        className="block font-normal tracking-wide"
                      >
                        Staking / Reward Token Price Ratio
                      </label>
                      <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                        <input
                          type="number"
                          {...stakingForm.register(
                            "staking_reward_token_price_ratio"
                          )}
                          id="staking_reward_token_price_ratio"
                          placeholder="only numbers"
                          className="block w-full appearance-none rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                        />
                      </div>
                      {stakingForm.formState.errors
                        .staking_reward_token_price_ratio && (
                        <p className={`pb-2 text-xs font-medium text-red-500`}>
                          {
                            stakingForm.formState.errors
                              .staking_reward_token_price_ratio.message
                          }
                        </p>
                      )}
                    </div>
                  )
                }

                {/* multi level reward system */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="multilevel_rewards"
                    className="block font-normal tracking-wide"
                  >
                    Multilevel Rewards System
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="mt-2 block w-full appearance-none rounded-lg border-0 text-sm">
                    <DropdownStakingForm
                      placeholder="Select Any"
                      options={[
                        { title: "No referral", value: "No referral" },
                        {
                          title: "Recurring Return (0 to 6 levels)",
                          value: "Recurring Return (0 to 6 levels)",
                        },
                        {
                          title: "Fix Commission (0 to 6 levels)",
                          value: "Fix Commission (0 to 6 levels)",
                        },
                      ]}
                      selectedValue={stakingForm.watch("multilevel_rewards")}
                      onSelect={(value) => {
                        stakingForm.setValue("multilevel_rewards", value);
                        handleMultilevelChange(value);
                      }}
                      error={
                        stakingForm.formState.errors.multilevel_rewards?.message
                      }
                    />
                  </div>
                  {selectedValue === "Recurring Return (0 to 6 levels)" && (
                    <p
                      className={`text-gradient pb-2 pt-1 text-xs font-medium`}
                    >
                      Referral rewards are claimable according to Claim Period
                    </p>
                  )}
                  {stakingForm.formState.errors.multilevel_rewards && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.multilevel_rewards.message}
                    </p>
                  )}
                  {totalPercentageError && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      Total percentage cannot exceed 100%
                    </p>
                  )}
                </div>
                {renderInputFields()}
                {/* Staking Period */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="staking_period"
                    className="block font-normal tracking-wide"
                  >
                    Staking Period
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="mt-2 block w-full appearance-none rounded-lg border-0 text-sm">
                    <DropdownStakingForm
                      placeholder="Select Any"
                      options={stakingPeriodOptions}
                      selectedValue={+stakingForm.watch("staking_period")}
                      onSelect={(value) =>
                        stakingForm.setValue("staking_period", value.toString())
                      }
                      error={
                        stakingForm.formState.errors.staking_period?.message
                      }
                    />
                  </div>
                  {stakingForm.formState.errors.staking_period && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.staking_period.message}
                    </p>
                  )}
                </div>

                {/*  Is Cancelable */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="is_cancelable"
                    className="block font-normal tracking-wide"
                  >
                    Is Cancelable
                  </label>
                  <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 px-5 py-3 placeholder:text-gray-shade-17 focus:outline-none focus:ring-0">
                    <label
                      htmlFor="is_cancelable"
                      className="block font-normal tracking-wide"
                    >
                      Is Cancelable
                    </label>
                    <div className="flex gap-3 fmd:gap-5">
                      <div className="flex items-center">
                        <input
                          id="red-radio3"
                          type="radio"
                          value="no"
                          {...stakingForm.register("is_cancelable")}
                          className="red-radio h-4 w-4 text-sm"
                          onClick={() => setIsCancelable("no")}
                        />
                        <label
                          htmlFor="red-radio3"
                          className="text-sm font-medium text-white"
                        >
                          No
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="green-radio3"
                          type="radio"
                          value="yes"
                          {...stakingForm.register("is_cancelable")}
                          className="green-radio h-4 w-4 text-sm"
                          onClick={() => setIsCancelable("yes")}
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
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.is_cancelable.message}
                    </p>
                  )}
                </div>
                {
                  /*   Charge Fee on Cancel */
                  isCancelable == "yes" && (
                    <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                      <label
                        htmlFor="charge_fee_on_cancel"
                        className="block font-normal tracking-wide"
                      >
                        Charge Fee on Cancel
                        <span className="text-gradient ml-[2px]">*</span>
                      </label>
                      <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                        <input
                          type="number"
                          {...stakingForm.register("charge_fee_on_cancel")}
                          id="charge_fee_on_cancel"
                          placeholder="0%"
                          className="block w-full appearance-none rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                        />
                      </div>
                      {stakingForm.formState.errors.charge_fee_on_cancel && (
                        <p className={`pb-2 text-xs font-medium text-red-500`}>
                          {
                            stakingForm.formState.errors.charge_fee_on_cancel
                              .message
                          }
                        </p>
                      )}
                    </div>
                  )
                }

                {/* APY */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="apy"
                    className="block font-normal tracking-wide"
                  >
                    APY
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                    <input
                      type="number"
                      {...stakingForm.register("apy")}
                      id="apy"
                      placeholder="For example: 2%"
                      className="block w-full appearance-none rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                    />
                  </div>
                  {stakingForm.formState.errors.apy && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.apy.message}
                    </p>
                  )}
                </div>
                {/* start date */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1">
                  <label
                    htmlFor="start_date"
                    className="block font-normal tracking-wide"
                  >
                    Start Date
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                    <input
                      type="date"
                      {...stakingForm.register("start_date")}
                      id="start_date"
                      placeholder="For example: DeXa Pack 1"
                      className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm accent-yellow-400 placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                    />
                  </div>
                  {stakingForm.formState.errors.start_date && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.start_date.message}
                    </p>
                  )}
                </div>
                {/* Rewards Release Start  */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="rewards_release_start"
                    className="block font-normal tracking-wide"
                  >
                    Rewards Release Start
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="mt-2 block w-full appearance-none rounded-lg border-0 text-sm">
                    <DropdownStakingForm
                      placeholder="Select Any"
                      options={firstReward}
                      selectedValue={
                        +stakingForm.watch("rewards_release_start")
                      }
                      onSelect={(value) =>
                        stakingForm.setValue(
                          "rewards_release_start",
                          value.toString()
                        )
                      }
                      error={
                        stakingForm.formState.errors.rewards_release_start
                          ?.message
                      }
                    />
                  </div>
                  {stakingForm.formState.errors.rewards_release_start && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {
                        stakingForm.formState.errors.rewards_release_start
                          .message
                      }
                    </p>
                  )}
                </div>
                {/* claim period */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="claim_period"
                    className="block font-normal tracking-wide"
                  >
                    Claim Period
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="mt-2 block w-full appearance-none rounded-lg border-0 text-sm">
                    <DropdownStakingForm
                      placeholder="Select Any"
                      options={claimPeriodOptions}
                      selectedValue={+stakingForm.watch("claim_period")}
                      onSelect={(value) =>
                        stakingForm.setValue("claim_period", value.toString())
                      }
                      error={stakingForm.formState.errors.claim_period?.message}
                    />
                  </div>
                  {stakingForm.formState.errors.claim_period && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.claim_period.message}
                    </p>
                  )}
                </div>
                {/*  Show on Centher */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="show_on_centher"
                    className="block font-normal tracking-wide"
                  >
                    Show on Centher
                  </label>
                  <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 px-5 py-3 placeholder:text-gray-shade-17 focus:outline-none focus:ring-0">
                    <label
                      htmlFor="show_on_centher"
                      className="block font-normal tracking-wide"
                    >
                      Show on Centher
                    </label>
                    <div className="flex gap-3 fmd:gap-5">
                      <div className="flex items-center">
                        <input
                          id="red-radio1"
                          type="radio"
                          value="no"
                          {...stakingForm.register("show_on_centher")}
                          className="red-radio h-4 w-4 text-sm"
                        />
                        <label
                          htmlFor="red-radio1"
                          className="text-sm font-medium text-white"
                        >
                          No
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="green-radio1"
                          type="radio"
                          value="yes"
                          {...stakingForm.register("show_on_centher")}
                          className="green-radio h-4 w-4 text-sm"
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
                      className={`text-gradient pb-2 pt-1 text-xs font-medium`}
                    >
                      This option costs 1 BNB when selecting YES
                    </p>
                  )}
                  {stakingForm.formState.errors.show_on_centher && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.show_on_centher.message}
                    </p>
                  )}
                </div>
                {/* Liquidity Pool Provided */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="liquidity_pool_provided"
                    className="block font-normal tracking-wide"
                  >
                    Liquidity Pool Provided
                  </label>
                  <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 px-5 py-3 placeholder:text-gray-shade-17 focus:outline-none focus:ring-0">
                    <label
                      htmlFor="liquidity_pool_provided"
                      className="block font-normal tracking-wide"
                    >
                      Liquidity Pool Provided
                    </label>
                    <div className="flex gap-3 fmd:gap-5">
                      <div className="flex items-center">
                        <input
                          id="red-radio2"
                          type="radio"
                          value="no"
                          {...stakingForm.register("liquidity_pool_provided")}
                          className="red-radio h-4 w-4 text-sm"
                          onClick={() => setIsLP("no")}
                        />
                        <label
                          htmlFor="red-radio2"
                          className="text-sm font-medium text-white"
                        >
                          No
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="green-radio2"
                          type="radio"
                          value="yes"
                          {...stakingForm.register("liquidity_pool_provided")}
                          className="green-radio h-4 w-4 text-sm"
                          onClick={() => setIsLP("yes")}
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
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {
                        stakingForm.formState.errors.liquidity_pool_provided
                          .message
                      }
                    </p>
                  )}
                </div>
                {/*    Minimum Stakable Amount */}
                <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                  <label
                    htmlFor="min_staking_amount"
                    className="block font-normal tracking-wide"
                  >
                    Minimum Stakable Amount
                    <span className="text-gradient ml-[2px]">*</span>
                  </label>
                  <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                    <input
                      type="text"
                      {...stakingForm.register("min_staking_amount")}
                      id="min_staking_amount"
                      placeholder="Example: 1000"
                      className="block w-full appearance-none rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <p className={`text-gradient pb-2 pt-1 text-xs font-medium`}>
                    if you set a min value then staking amount is always a
                    coefficient of this value, for example if min value is 250,
                    then allowed amounts are 250,500,750,1000,etc
                  </p>
                  {stakingForm.formState.errors.min_staking_amount && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {stakingForm.formState.errors.min_staking_amount.message}
                    </p>
                  )}
                </div>
                {
                  /* Maximum Stakable Amount */
                  isLP == "yes" ? (
                    <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
                      <label
                        htmlFor="max_staking_amount"
                        className="block font-normal tracking-wide"
                      >
                        Maximum Stakable Amount
                        <span className="text-gradient ml-[2px]">*</span>
                      </label>
                      <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                        <input
                          type="text"
                          {...stakingForm.register("max_staking_amount")}
                          id="max_staking_amount"
                          placeholder="Only numbers here"
                          className="block w-full appearance-none rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                        />
                      </div>
                      {stakingForm.formState.errors.max_staking_amount && (
                        <p className={`pb-2 text-xs font-medium text-red-500`}>
                          {
                            stakingForm.formState.errors.max_staking_amount
                              .message
                          }
                        </p>
                      )}
                    </div>
                  ) : null
                }

                {
                  /* Total Supply */
                  isLP == "yes" ? (
                    <div className="col-span-2 mb-6 w-full text-sm font-medium text-white md:col-span-1 md:mb-0">
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
                        className="focus:ring-brand-primar mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none"
                      />
                      <p
                        className={`text-gradient pb-2 pt-1 text-xs font-medium`}
                      >
                        How much of the Token you want to make available for
                        staking
                      </p>
                      {stakingForm.formState.errors.total_supply && (
                        <p className={`pb-2 text-xs font-medium text-red-500`}>
                          {stakingForm.formState.errors.total_supply.message}
                        </p>
                      )}
                    </div>
                  ) : null
                }

                {/*  Metadata */}
                <div className="col-span-2 w-full text-sm font-medium text-white">
                  <label htmlFor="test" className="block font-normal">
                    Project Metadata
                  </label>
                  <div className="mt-2 flex w-full  items-center justify-between rounded-lg border-0 bg-black-shade-3 px-5 py-3 placeholder:text-gray-shade-17 focus:outline-none focus:ring-0">
                    <span className="text-sm text-gray-shade-17">
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
                      className={`pb-2 pt-[2px] text-xs font-medium text-red-500`}
                    >
                      {metaDataErr}
                    </p>
                  )}
                </div>
                {metaDataList?.length > 0 && (
                  <div className="col-span-2 flex w-full rounded-lg bg-black-shade-3 px-6 py-5">
                    <div
                      className={
                        "grid w-full gap-[2%] rounded-[14px] md:grid-cols-4"
                      }
                    >
                      {metaDataList.map((item: metaDataType, index: number) => {
                        return (
                          <div
                            key={index}
                            className="gradientborders2 relative mb-[2%] flex h-[98px] w-full flex-col items-center justify-center gap-3 rounded-10px bg-background-shade-3 p-[2px]"
                          >
                            <button
                              className="absolute right-[-4px] top-[-4px] flex h-5 w-5 items-center justify-center rounded-full border border-gray-shade-3 bg-elevation-1 text-center"
                              onClick={() => {
                                handleMetaDataRemove(item.title);
                              }}
                            >
                              <IoIosClose className="text-xl text-white" />
                            </button>
                            <h5 className="textGradient text-xs font-medium">
                              {item.title}
                            </h5>
                            <h6 className="text-sm font-semibold text-white">
                              {item.data}
                            </h6>
                          </div>
                        );
                      })}{" "}
                    </div>
                  </div>
                )}
              </div>
              {!isConnected ? (
                <Button
                  title={"Connect Wallet"}
                  variant="primary"
                  onClick={() => {
                    setConnectWalletModal(true);
                  }}
                  className="mx-auto mt-5 w-[45%] text-sm"
                />
              ) : (
                <Button
                  title="Next"
                  variant="primary"
                  className={cn("mx-auto mt-5 w-[45%] text-sm", {
                    hidden: formStep == 1,
                  })}
                  onClick={handleNext}
                />
              )}
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
                    <label className="text-start text-sm font-normal text-white">
                      Type
                    </label>
                    <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="off"
                        placeholder="Project"
                        className="w-full rounded-lg border-0 !bg-black-shade-2 px-5 py-3 text-sm font-semibold text-white ring-2 ring-black-shade-7 focus:outline-none focus:!ring-0"
                        onChange={handleMetaDataChange}
                        value={metaDataDetails.title}
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <label className="text-start text-sm font-normal text-white">
                      Name
                    </label>
                    <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        name="data"
                        id="data"
                        autoComplete="off"
                        placeholder="Premium"
                        className="w-full rounded-lg border-0 !bg-black-shade-2 px-5 py-3 text-sm font-semibold text-white ring-2 ring-black-shade-7 focus:outline-none focus:ring-0"
                        onChange={handleMetaDataChange}
                        value={metaDataDetails.data}
                      />
                    </div>
                  </div>
                  {metaDataErr && (
                    <p className={`pb-2 text-xs font-medium text-red-500`}>
                      {metaDataErr}
                    </p>
                  )}
                  <Button
                    title={"Save"}
                    variant="primary"
                    onClick={addNewMetaDataFunc}
                    className="mt-2"
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
            <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-gray-shade-3 bg-black-shade-9  p-3 fmd:p-6">
              <div className="mb-2 grid w-full gap-4 fmd:grid-cols-2 fmd:gap-6">
                <div className="col-span-2 mb-2 grid w-full gap-6 border-b-2 border-gray-shade-3 pb-8 md:grid-cols-2">
                  <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="whitepaper"
                      className="block font-normal tracking-wide"
                    >
                      Whitepaper
                      <span className="text-gradient ml-[2px]">*</span>
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        {...stakingForm.register("whitepaper")}
                        type="text"
                        id="whitepaper"
                        placeholder="Example: yourweb.com/"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.whitepaper && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.whitepaper.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="website_url"
                      className="block font-normal tracking-wide"
                    >
                      Website URL
                      <span className="text-gradient ml-[2px]">*</span>
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        {...stakingForm.register("website_url")}
                        type="text"
                        id="website_url"
                        placeholder="Example: yourweb.com/"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.website_url && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.website_url.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-2 mb-2 grid w-full gap-6 border-b-2 border-gray-shade-3 pb-8 md:grid-cols-2">
                  <div className="col-span-2  w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="facebook"
                      className="block font-normal tracking-wide"
                    >
                      Facebook
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        {...stakingForm.register("facebook")}
                        id="facebook"
                        placeholder="Example: yourlogo.com/"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.facebook && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.facebook.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2  w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="twitter"
                      className="block font-normal tracking-wide"
                    >
                      X.com
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        {...stakingForm.register("twitter")}
                        id="twitter"
                        placeholder="Example: t.com/"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.twitter && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.twitter.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2  w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="github"
                      className="block font-normal tracking-wide"
                    >
                      Github
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        {...stakingForm.register("github")}
                        id="github"
                        placeholder="Example: github.com/"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.github && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.github.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2  w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="telegram"
                      className="block font-normal tracking-wide"
                    >
                      Telegram
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        {...stakingForm.register("telegram")}
                        id="telegram"
                        placeholder="Example: yourtel.com/"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.telegram && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.telegram.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2  w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="instagram"
                      className="block font-normal tracking-wide"
                    >
                      Instagram
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        {...stakingForm.register("instagram")}
                        id="instagram"
                        placeholder="Example: instagram.com/"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.instagram && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.instagram.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2  w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="discord"
                      className="block font-normal tracking-wide"
                    >
                      Discord
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        {...stakingForm.register("discord")}
                        id="discord"
                        placeholder="Example: yourweb.com/"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.discord && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.discord.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="reddit"
                      className="block font-normal tracking-wide"
                    >
                      Reddit
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        {...stakingForm.register("reddit")}
                        id="reddit"
                        placeholder="Example: reddit.com/"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.reddit && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.reddit.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-2 mb-2 grid w-full gap-6 border-b-2 border-gray-shade-3 pb-8 md:grid-cols-2">
                  <div className="col-span-2  w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="explorers"
                      className="block font-normal tracking-wide"
                    >
                      Explorers
                      <span className="text-gradient ml-[1px]">*</span>
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        {...stakingForm.register("explorers")}
                        id="explorers"
                        placeholder="Example: BscScan"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.explorers && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.explorers.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2  w-full text-sm font-medium text-white md:col-span-1">
                    <label
                      htmlFor="category"
                      className="block font-normal tracking-wide"
                    >
                      Category
                      <span className="text-gradient ml-[1px]">*</span>
                    </label>
                    <Controller
                      name="category"
                      control={stakingForm.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={categoryOptions}
                          styles={customStyles} // Apply the custom styles
                          isMulti
                          className="mt-1 py-1"
                          classNamePrefix="select"
                        />
                      )}
                    />
                    <p
                      className={`text-gradient pb-2 pt-1 text-xs font-medium`}
                    >
                      You can select multiple as categories
                    </p>
                    {stakingForm.formState.errors.category && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.category.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 w-full text-sm font-medium text-white">
                    <label
                      htmlFor="description"
                      className="block font-normal tracking-wide"
                    >
                      Description
                      <span className="text-gradient ml-[1px]">*</span>
                    </label>
                    <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                      <textarea
                        {...stakingForm.register("description")}
                        id="description"
                        rows={4}
                        placeholder="Example: This is the best project"
                        className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                      />
                    </div>
                    {stakingForm.formState.errors.description && (
                      <p className={`pb-2 text-xs font-medium text-red-500`}>
                        {stakingForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-2 w-full text-sm font-medium text-white">
                  <label
                    htmlFor="jobTitle"
                    className="block font-normal tracking-wide"
                  >
                    Team Members
                  </label>
                  <div className="mt-4 w-full rounded-lg border-[1px] border-gray-shade-3">
                    <div className="grid gap-6 p-6 pb-0  md:grid-cols-2">
                      {/* Job title input */}
                      <div className="w-full text-sm font-medium text-white">
                        <label
                          htmlFor="jobTitle"
                          className="block font-normal tracking-wide"
                        >
                          Job title
                        </label>
                        <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                          <input
                            type="text"
                            name="jobTitle"
                            id="jobTitle"
                            placeholder="Example: CEO, CTO, COO etc"
                            className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                            value={memberData.jobTitle}
                            onChange={handleMemberInputChange}
                          />
                        </div>
                      </div>

                      {/* Wallet public address input */}
                      <div className="w-full text-sm font-medium text-white">
                        <label
                          htmlFor="walletAddress"
                          className="block font-normal tracking-wide"
                        >
                          Wallet public address
                        </label>
                        <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                          <input
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            placeholder="Example: 0x018rhf63hjj7763kuxx098nbvxx90cc23BBK99KXX028"
                            className="block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-sm placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                            value={memberData.walletAddress}
                            onChange={handleMemberInputChange}
                          />
                        </div>
                      </div>
                      {memberError && (
                        <p className={`pb-2 text-xs font-medium text-red-500`}>
                          {memberError}
                        </p>
                      )}
                    </div>

                    {/* Button aligned to the right */}
                    <div className="flex justify-end px-6 py-5">
                      <Button
                        title="Add Members"
                        onClick={handleAddMember}
                        variant="primary"
                        className="max-w-fit text-sm"
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
                          className="flex items-center justify-between border-t-[1px] border-gray-shade-3 px-6 py-4 text-white"
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

              {!isConnected ? (
                <Button
                  title={"Connect Wallet"}
                  variant="primary"
                  onClick={() => {
                    setConnectWalletModal(true);
                  }}
                  className="mx-auto mt-5 w-[45%] text-sm"
                />
              ) : (
                <Button
                  title="Review and Submit"
                  onClick={stakingForm.handleSubmit(submitForm)}
                  variant="primary"
                  className={cn("mx-auto mt-5 w-[45%] text-sm", {
                    hidden: formStep == 0,
                  })}
                  disabled={!stakingForm.formState.isValid}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
      {connectWalletModal && (
        <ConnectWalletModal
          connectWallet={connectWallet}
          deactivate={disconnectWallet}
          loggedInUser={loggedInUser}
          setConnectWalletModal={setConnectWalletModal}
        />
      )}
      {showMsg && showMsg}
      {progressModel && (
        <StakingProgressModal
          data={[]}
          item={progressModel}
          onClickClose={onClickClose}
        />
      )}
      {isLoading && <PreLoader />}
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
