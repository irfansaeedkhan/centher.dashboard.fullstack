import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import {
  OrgMember,
  addOrgMember,
  getOrgMembers,
  removeOrgMembers,
} from "@/lib/org-team-members";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import FinalButton from "@/components/button/final.button";
import { TeamMemberIcon } from "@/assets/svgs";
import useUser from "@/hooks/use.user";

const CitizenshipUpdateDetails: NextPageWithLayout = () => {
  const { user: loggedInUser } = useUser();
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [newOrgMember, setNewOrgMember] = useState<
    Pick<OrgMember, "user_id" | "title">
  >({
    title: "",
    user_id: "",
  });
  const [newMemberError, setNewMemberError] = useState<string | null>(null);

  const fetchOrgMembers = useCallback(async () => {
    if (!loggedInUser?._id) return;
    try {
      const _orgMembers = await getOrgMembers(loggedInUser?._id);
      setOrgMembers(_orgMembers);
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [loggedInUser]);

  useEffect(() => {
    fetchOrgMembers();
  }, [fetchOrgMembers]);

  const handleNewMemberInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setNewOrgMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async (): Promise<void> => {
    if (!newOrgMember.user_id.trim() || !newOrgMember.title.trim()) {
      setNewMemberError("All fields are required.");
      return;
    }

    if (newOrgMember.title.trim().length > 100) {
      setNewMemberError("Title must be at most 100 characters.");
      return;
    }

    if (
      !newOrgMember.user_id.trim().startsWith("0x") ||
      newOrgMember.user_id.trim().length !== 42
    ) {
      setNewMemberError("Account address is incorrect.");
      return;
    }

    setNewMemberError(null);

    try {
      const newlyAddedMember = await addOrgMember(newOrgMember);

      setOrgMembers((prevMembers) => {
        const members = prevMembers.concat(newlyAddedMember);
        // Remove duplicates
        const uniqueMembers = members.filter(
          (member, index, self) =>
            index === self.findIndex((m) => m.user_id === member.user_id)
        );
        return uniqueMembers;
      });

      setNewOrgMember({
        user_id: "",
        title: "",
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRemoveOrgMember = async (user_id: string) => {
    try {
      await removeOrgMembers(user_id);
      setOrgMembers((members) =>
        members.filter((mem) => mem.user_id !== user_id)
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

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
                  {/* Title input */}
                  <div className="text-14px w-full font-medium text-white">
                    <label
                      htmlFor="title"
                      className="mb-2 block font-normal tracking-wide"
                    >
                      Title
                    </label>
                    <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Example: CEO, CTO, COO etc"
                        className="text-14px block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                        value={newOrgMember.title}
                        onChange={handleNewMemberInputChange}
                      />
                    </div>
                  </div>

                  {/* User account address input */}
                  <div className="text-14px w-full font-medium text-white">
                    <label
                      htmlFor="user_id"
                      className="mb-2 block font-normal tracking-wide"
                    >
                      Account Address
                    </label>
                    <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
                      <input
                        type="text"
                        name="user_id"
                        id="user_id"
                        placeholder="Example: 0x1234567890123... "
                        className="text-14px block w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                        value={newOrgMember.user_id}
                        onChange={handleNewMemberInputChange}
                      />
                    </div>
                  </div>
                  {newMemberError && (
                    <p className={`text-12px pb-2 font-medium text-red-500`}>
                      {newMemberError}
                    </p>
                  )}
                </div>

                {/* Button aligned to the right */}
                <div className="flex justify-end px-6 py-5">
                  <FinalButton
                    title="Add Member"
                    onClick={handleAddMember}
                    variant="primary"
                    className="text-14px max-w-fit"
                    disabled={!newOrgMember.title || !newOrgMember.user_id}
                  />
                </div>

                {/* Display org members */}
                {
                  <div>
                    {orgMembers.map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between border-t-[1px] border-gray-shade-3 px-6 py-4 text-white"
                      >
                        <div className="flex items-center gap-1">
                          <TeamMemberIcon />
                          <span>{member.title}</span>
                          <span>-</span>
                          <span>{member.display_name}</span>
                        </div>
                        <button
                          className="ml-2 text-red-500"
                          onClick={() => handleRemoveOrgMember(member.user_id)}
                        >
                          <IoClose className="h-5 w-5 fill-[#E34048]" />
                        </button>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
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
