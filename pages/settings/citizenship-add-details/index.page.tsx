import React, { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import FinalButton from "@/components/button/final.button";

import { IoClose } from "react-icons/io5";
import { TeamMemberIcon } from "@/assets/svgs";
import { CitizenShipSuccessModal } from "@/components/modal/buy-citizenship-modal/success-modal";

const CitizenshipAddDetails: NextPageWithLayout = () => {
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
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
  type teamMember = {
    jobTitle: string;
    walletAddress: string;
  };

  interface citizenshipFormInterface {
    websiteUrl: string;
    facebook: string;
    twitter: string;
    github: string;
    telegram: string;
    instagram: string;
    discord: string;
    reddit: string;
    explorers: string;
    category: string;
    description: string;
  }

  const CitizenshipDetailsSchema = Joi.object({
    websiteUrl: Joi.string().max(150).optional().allow("").label("websiteUrl"),
    facebook: Joi.string().max(150).optional().allow("").label("facebook"),
    twitter: Joi.string().max(150).optional().allow("").label("twitter"),
    github: Joi.string().max(150).optional().allow("").label("github"),
    telegram: Joi.string().max(150).optional().allow("").label("telegram"),
    instagram: Joi.string().max(150).optional().allow("").label("instagram"),
    discord: Joi.string().max(150).optional().allow("").label("discord"),
    reddit: Joi.string().max(150).optional().allow("").label("reddit"),
    explorers: Joi.string().max(150).optional().allow("").label("explorers"),
    category: Joi.string().max(150).optional().allow("").label("category"),
    description: Joi.string()
      .max(550)
      .required()
      .label("description")
      .messages({
        "any.required": `description Field`,
      }),
  });

  const citizenshipForm = useForm<citizenshipFormInterface>({
    mode: "onChange",
    resolver: joiResolver(CitizenshipDetailsSchema),
  });

  const handleDetails = (data: citizenshipFormInterface) => {
    if (members.length < 1) {
      setMemberError("add members please");
      return;
    }
    setMemberError(null);
    let finalData = {
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

    citizenshipForm.reset({
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
    setMembers([]);

    setShowSuccessMsg(true);
  };

  return (
    <section className="flex min-h-[calc(100vh-120px)] w-full">
      <div className="flex flex-grow flex-col">
        <h1 className="textGradient pb-6 font-semibold leading-[42px] sm:text-2xl ">
          Set up your CITIZEN Passport Membership.
        </h1>
        <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-gray-shade-3 bg-black-shade-9 p-6">
          <div className="mb-2 grid w-full gap-6 md:grid-cols-2">
            <div className="text-14px col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Website URL
              </label>
              <input
                {...citizenshipForm.register("websiteUrl")}
                type="text"
                id="websiteUrl"
                placeholder="Example: yourweb.com/"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.websiteUrl && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.websiteUrl.message}
                </p>
              )}
            </div>

            <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Facebook
              </label>
              <input
                type="text"
                {...citizenshipForm.register("facebook")}
                id="test"
                placeholder="Example: yourlogo.com/"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.facebook && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.facebook.message}
                </p>
              )}
            </div>

            <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Twitter
              </label>
              <input
                type="text"
                {...citizenshipForm.register("twitter")}
                id="test"
                placeholder="Example: t.com/"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.twitter && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.twitter.message}
                </p>
              )}
            </div>

            <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Github
              </label>
              <input
                type="text"
                {...citizenshipForm.register("github")}
                id="test"
                placeholder="Example: github.com/"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.github && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.github.message}
                </p>
              )}
            </div>

            <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Telegram
              </label>
              <input
                type="text"
                {...citizenshipForm.register("telegram")}
                id="test"
                placeholder="Example: yourtel.com/"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.telegram && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.telegram.message}
                </p>
              )}
            </div>

            <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Instagram
              </label>
              <input
                type="text"
                {...citizenshipForm.register("instagram")}
                id="test"
                placeholder="Example: instagram.com/"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.instagram && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.instagram.message}
                </p>
              )}
            </div>

            <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Discord
              </label>
              <input
                type="text"
                {...citizenshipForm.register("discord")}
                id="test"
                placeholder="Example: yourweb.com/"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.discord && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.discord.message}
                </p>
              )}
            </div>

            <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Reddit
              </label>
              <input
                type="text"
                {...citizenshipForm.register("reddit")}
                id="test"
                placeholder="Example: reddit.com/"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.reddit && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.reddit.message}
                </p>
              )}
            </div>

            <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Explorers
              </label>
              <input
                type="text"
                {...citizenshipForm.register("explorers")}
                id="test"
                placeholder="Example: BscScan"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.explorers && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.explorers.message}
                </p>
              )}
            </div>

            <div className="text-14px  col-span-2 w-full font-medium text-white md:col-span-1">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Category
              </label>
              <input
                type="text"
                {...citizenshipForm.register("category")}
                id="test"
                placeholder="Example: Decentralised Finance"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.category && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.category.message}
                </p>
              )}
            </div>

            <div className="text-14px col-span-2 w-full font-medium text-white">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Description<span className="text-brand-primary">*</span>
              </label>
              <textarea
                {...citizenshipForm.register("description")}
                id="test"
                rows={4}
                placeholder="Example: This is the best project"
                className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
              {citizenshipForm.formState.errors.description && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {citizenshipForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="text-14px col-span-2 w-full font-medium text-white">
              <label htmlFor="test" className="block font-normal tracking-wide">
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
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
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
                    disabled={!memberData.jobTitle || !memberData.walletAddress}
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
            onClick={citizenshipForm.handleSubmit(handleDetails)}
            variant="primary"
            className=" text-14px mx-auto mt-5 w-[45%]"
            disabled={!citizenshipForm.formState.isValid}
          />
        </div>
      </div>
      {showSuccessMsg && (
        <CitizenShipSuccessModal
          onClickClose={() => {
            setShowSuccessMsg(false);
          }}
        />
      )}
    </section>
  );
};

CitizenshipAddDetails.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Staking">
    <div className="mx-auto w-full max-w-[1144px] bg-black-shade-3 font-monto ">
      {page}
    </div>
  </AllPagesWrapper>
);

export default CitizenshipAddDetails;
