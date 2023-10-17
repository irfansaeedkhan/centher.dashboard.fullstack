import React, { useState } from "react";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import Button from "@/components/button";
import { LoadingState } from "@/models/common";
import { LoggedInUser } from "@/models/user";
import { updateMe } from "@/lib/user";
import { InputField } from "./input.field";
import ProfilePicture from "./profile.picture";

interface EditProfileFormProps {
  user: LoggedInUser;
}

const ButtonsText = {
  loading: "Continue...",
  update_profile: "Save Changes",
};

export const ProfileForm: React.FC<EditProfileFormProps> = (props) => {
  const { mutate } = useSWRConfig();
  const [updatedUser, setUpdatedUser] = React.useState(props.user);
  const [isLoading, setisLoading] = useState<LoadingState>("idle");
  const [isModified, setIsModified] = useState(false); // track if any input field has been modified

  const updateProfile = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = e.currentTarget;
    button.disabled = true;
    setisLoading("loading");
    try {
      const updatedUserRes = await updateMe({
        pseudonym: updatedUser.pseudonym,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        display_name_field: updatedUser.display_name_field,
      });

      setUpdatedUser(updatedUserRes as LoggedInUser);

      await mutate("/api/users/me", updatedUserRes, false);

      toast.success("Profile updated successfully");
      setisLoading("loaded");
      button.disabled = false;
      isModified && setIsModified(false);
    } catch (error: any) {
      button.disabled = false;
      setisLoading("failed");
      toast.error(
        error.response?.data?.message_description ??
          error.message ??
          "Something went wrong"
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        <ProfilePicture user={props.user} />

        <div className="flex flex-col gap-2">
          <label className={`text-sm text-white`}>Display Name Field</label>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <select
              onChange={(e) => {
                setUpdatedUser({
                  ...updatedUser,
                  display_name_field: e.target
                    .value as LoggedInUser["display_name_field"],
                });
                setIsModified(true);
              }}
              value={updatedUser.display_name_field}
              className={`w-full rounded-lg border-0 bg-[#1E1E21] px-5 py-3 text-sm font-medium leading-6 text-white focus:outline-none focus:ring-0`}
            >
              <option value="pseudonym">Pseudonym</option>
              <option value="real_name">Real Name</option>
              <option value="account_address">Account Address</option>
            </select>
          </div>
        </div>
        {updatedUser.display_name_field === "pseudonym" && (
          <InputField
            id="pseudonym"
            label="Pseudonym"
            placeholder="e.g. Steven Paul"
            value={updatedUser.pseudonym}
            maxLength={50}
            onChange={(e) => {
              setUpdatedUser({
                ...updatedUser,
                pseudonym: e.target.value,
              });
              setIsModified(true);
            }}
          />
        )}

        {updatedUser.display_name_field === "real_name" && (
          <div className="flex w-full flex-col gap-6 fsm:flex-row fmd:gap-3">
            <div className="w-full">
              <InputField
                id="first_name"
                label="First Name"
                placeholder="e.g. Steven"
                value={updatedUser.first_name}
                onChange={(e) => {
                  setUpdatedUser({
                    ...updatedUser,
                    first_name: e.target.value,
                  });
                  setIsModified(true);
                }}
              />
            </div>
            <div className="w-full">
              <InputField
                id="last_name"
                label="Last Name"
                placeholder="e.g. Paul"
                value={updatedUser.last_name}
                onChange={(e) => {
                  setUpdatedUser({
                    ...updatedUser,
                    last_name: e.target.value,
                  });
                  setIsModified(true);
                }}
              />
            </div>
          </div>
        )}
        <Button
          title={ButtonsText.update_profile}
          variant={isModified ? "primary" : "secondary"}
          onClick={updateProfile}
          disabled={!isModified}
          Icon={
            isLoading === "loading" && (
              <CgSpinner className="animate-spin text-white" />
            )
          }
          className="w-fit rounded-[14px] text-sm font-medium "
        />
      </div>
    </div>
  );
};
