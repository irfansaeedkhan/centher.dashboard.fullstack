import React, { useState, ChangeEvent, useEffect } from "react";
import toast from "react-hot-toast";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import FinalButton from "@/components/button/final.button";

import { IoClose } from "react-icons/io5";
import { TeamMemberIcon } from "@/assets/svgs";

const CitizenshipUpdateDetails: NextPageWithLayout = () => {
  const [initialData, setInitialData] = useState<teamMember[] | null>(null);

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

  const handleSubmit = async () => {
    if (members.length < 1) {
      setMemberError("add members please");
      return;
    }
    toast.success("Members Added !");
    // dummy setting so user can see its data
    setInitialData(members);
  };

  const handleUpdate = async () => {
    if (members.length < 1) {
      setMemberError("add members please");
      return;
    }
    let finalUpdatedData = {
      members: members,
    };

    console.log("updatedData:", finalUpdatedData);
    toast.success("Form Updated!");
  };

  let initialDummyData = [
    {
      jobTitle: "CEO",
      walletAddress: "Ricky",
    },
    {
      jobTitle: "CTO",
      walletAddress: "Shivam",
    },
  ];

  // let initialDummyData: teamMember[] | null = null;

  useEffect(() => {
    const fetchDataForEdit = async () => {
      try {
        // Fetch the initial data for editing here
        if (initialDummyData) {
          // Set the initial data to populate the form fields for editing
          setInitialData(initialDummyData);
          if (initialDummyData) {
            setMembers(initialDummyData);
          }
          // Reset the form to clear any previous validation errors
        }
      } catch (error) {
        console.error("Error fetching data for edit:", error);
      }
    };
    fetchDataForEdit();
  }, []);

  return (
    <section className="flex w-full">
      <div className="flex flex-grow flex-col">
        <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-gray-shade-3 bg-black-shade-9 p-6">
          <div className="mb-2 grid w-full gap-6 md:grid-cols-2">
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
                {
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
                }
              </div>
            </div>
          </div>

          <FinalButton
            title="Submit Now"
            onClick={initialData ? () => handleUpdate() : () => handleSubmit()}
            variant="primary"
            className=" text-14px mx-auto mt-5 w-[45%]"
          />
        </div>
      </div>
    </section>
  );
};

CitizenshipUpdateDetails.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Staking">
    <div className="mx-auto w-full max-w-[1144px] bg-black-shade-3 font-monto ">
      {page}
    </div>
  </AllPagesWrapper>
);

export default CitizenshipUpdateDetails;
