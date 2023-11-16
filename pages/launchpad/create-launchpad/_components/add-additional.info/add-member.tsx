import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { TeamMemberIcon } from "@/assets/svgs";
import Button from "@/components/button";
import { FormStateProps } from "../shared-types";

const AddMember: React.FC<FormStateProps> = ({ formState, setFormState }) => {
  const [members, setMembers] = useState({
    job_title: "",
    wallet_address: "",
  });

  const handleMemberInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setMembers((prevMembers) => ({
      ...prevMembers,
      [name]: value,
    }));
  };

  const handleRemoveMember = (index: number): void => {
    setFormState((prev) => {
      return {
        ...prev,
        add_additional_info: {
          ...prev.add_additional_info,
          memberData: prev.add_additional_info.memberData.filter(
            (_, i) => i !== index
          ),
        },
      };
    });
  };

  const handleAddMember = (): void => {
    setFormState((prev) => {
      return {
        ...prev,
        add_additional_info: {
          ...prev.add_additional_info,
          memberData: [
            ...prev.add_additional_info.memberData,
            {
              jobTitle: members.job_title,
              walletAddress: members.wallet_address,
            },
          ],
        },
      };
    });
    setMembers({
      job_title: "",
      wallet_address: "",
    });
  };

  return (
    <div className={gradientBorderInputMain}>
      <label htmlFor="team_members" className={label}>
        Team Members
      </label>
      <div className="mt-4 w-full rounded-lg border-[1px] border-gray-shade-3">
        <div className="grid gap-6 p-6 pb-0  md:grid-cols-2">
          <div className="w-full text-sm font-medium text-white">
            <label htmlFor="job_title" className={label}>
              Job title
            </label>
            <div className={gradientBorderInputParent}>
              <input
                type="text"
                name="job_title"
                id="job_title"
                placeholder="Example: CEO, CTO, COO etc"
                className={gradientBorderInput}
                value={members.job_title}
                onChange={handleMemberInputChange}
              />
            </div>
          </div>
          <div className="w-full text-sm font-medium text-white">
            <label htmlFor="wallet_address" className={label}>
              Wallet public address
            </label>
            <div className={gradientBorderInputParent}>
              <input
                type="text"
                name="wallet_address"
                id="wallet_address"
                placeholder="Example: 0x018rhf63hjj7763kuxx098nbvxx90cc23BBK99KXX028"
                className={gradientBorderInput}
                value={members.wallet_address}
                onChange={handleMemberInputChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end px-6 py-5">
          <Button
            title="Add Members"
            onClick={handleAddMember}
            variant="primary"
            className="max-w-fit text-sm"
            disabled={members.job_title === "" || members.wallet_address === ""}
          />
        </div>
        <div>
          {formState.add_additional_info.memberData.map((member, index) => (
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
  );
};

export default AddMember;

const gradientBorderInputParent =
  "focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]";
const gradientBorderInput =
  "block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0";
const gradientBorderInputMain =
  "col-span-full mb-6 text-sm font-medium text-white fmd:mb-0 fmd:col-span-1";
const label = "block font-normal tracking-wide";
