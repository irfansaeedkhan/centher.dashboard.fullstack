import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import toast from "react-hot-toast";
import ModalContainer from "@/components/modal/modal-container";
import { ZeroAddress } from "@/web3/constants/common";
import { OrgMember, inviteOrgMember } from "@/lib/org-team-members";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [newOrgMember, setNewOrgMember] = useState<
    Pick<OrgMember, "user_id" | "title">
  >({
    title: "",
    user_id: "",
  });
  const [newMemberError, setNewMemberError] = useState<string | null>(null);
  const submitButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    onClose();
    setNewOrgMember({
      user_id: "",
      title: "",
    });
  };

  const handleNewMemberInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNewMemberError(null);
    const { name, value } = event.target;
    setNewOrgMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendInvite = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const button = submitButtonRef.current;
    if (button) {
      button.disabled = true;
    }

    try {
      if (!newOrgMember.user_id.trim() || !newOrgMember.title.trim()) {
        throw new Error("All fields are required.");
      }

      if (newOrgMember.title.trim().length > 100) {
        throw new Error("Title must be at most 100 characters.");
      }

      if (
        !newOrgMember.user_id.trim().startsWith("0x") ||
        newOrgMember.user_id.trim().length !== 42
      ) {
        throw new Error("Account address is incorrect.");
      }
    } catch (e: any) {
      setNewMemberError(e.message);
      if (button) {
        button.disabled = false;
      }
      return;
    }

    setNewMemberError(null);

    try {
      await inviteOrgMember(newOrgMember);
      handleClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      if (button) {
        button.disabled = false;
      }
    }
  };

  return (
    <ModalContainer
      modalId="invite-member-modal"
      isOpen={isOpen}
      onClose={handleClose}
      modalContentClassName="max-w-2xl p-6"
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex items-center">
        <h3 className="flex-grow text-base font-medium text-white">
          Invite member to organization
        </h3>
        <IoClose
          className="h-5 w-5 cursor-pointer text-white"
          onClick={handleClose}
        />
      </div>

      <div className="mt-6 p-4 pb-0">
        <form onSubmit={handleSendInvite}>
          <div className="space-y-1.5">
            <label htmlFor="user_id" className="text-sm font-normal text-white">
              Account Address
            </label>
            <input
              type="text"
              name="user_id"
              id="user_id"
              className="w-full rounded-lg border-none bg-black-shade-3 px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-0"
              placeholder={ZeroAddress}
              value={newOrgMember.user_id}
              onChange={handleNewMemberInputChange}
            />
          </div>
          <div className="mt-5 space-y-1.5">
            <label htmlFor="title" className="text-sm font-normal text-white">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="CEO, CTO, etc."
              className="w-full rounded-lg border-none bg-black-shade-3 px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-0"
              value={newOrgMember.title}
              onChange={handleNewMemberInputChange}
            />
          </div>
          {newMemberError && (
            <p className={`mt-5 text-xs font-medium text-red-500`}>
              {newMemberError}
            </p>
          )}
          <div className="mt-6 flex gap-x-5">
            <button
              className="w-full rounded-xl border border-gray-shade-3 p-2.5 text-sm font-medium text-white hover:bg-black-shade-2"
              onClick={handleClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="group w-full rounded-xl border border-gray-shade-3 p-2.5 text-sm font-medium text-white hover:bg-black-shade-2"
              type="submit"
              ref={submitButtonRef}
            >
              <span className="group-disabled:hidden">Invite</span>
              <CgSpinner className="hidden h-4 w-4 animate-spin text-current group-disabled:inline" />
            </button>
          </div>
        </form>
      </div>
    </ModalContainer>
  );
};
