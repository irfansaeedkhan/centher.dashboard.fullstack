import React, { useState } from "react";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

import { LoadingState } from "@/models/common";
import { LoggedInUser } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";

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

  const updateProfile = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = e.currentTarget;
    button.disabled = true;
    setisLoading("loading");
    try {
      const { data } = await axiosNodeApi.patch("/api/users/me", {
        pseudonym: updatedUser.pseudonym,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        display_name_field: updatedUser.display_name_field,
        website_url: updatedUser.website_url,
        twitter_username: updatedUser.twitter_username,
        profile_bio: updatedUser.profile_bio,
        facebook_username: updatedUser.facebook_username,
        instagram_username: updatedUser.instagram_username,
        tiktok_username: updatedUser.tiktok_username,
        twitch_username: updatedUser.twitch_username,
        onlyfans_username: updatedUser.onlyfans_username,
        youtube_url: updatedUser.youtube_url,
      });

      setUpdatedUser(data.user as LoggedInUser);

      await mutate("/api/users/me", data.user, false);

      toast.success("Profile updated successfully");
      setisLoading("loaded");
      button.disabled = false;
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
          }}
        />
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
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={`text-sm text-white`}>Display Name Field</label>
          <select
            onChange={(e) => {
              setUpdatedUser({
                ...updatedUser,
                display_name_field: e.target
                  .value as LoggedInUser["display_name_field"],
              });
            }}
            value={updatedUser.display_name_field}
            className={`w-full rounded-lg border-0 bg-[#1E1E21] py-3 px-5 text-sm font-medium leading-6 text-white focus:outline-none focus:ring-brand-primary`}
          >
            <option value="pseudonym">Pseudonym</option>
            <option value="real_name">Real Name</option>
            <option value="account_address">Account Address</option>
          </select>
        </div>

        <button
          className={`mt-2 flex h-9 w-[128px] items-center justify-center rounded-lg bg-brand-primary py-2 px-3 text-sm font-semibold text-black transition-all hover:bg-brand-primary-dark`}
          onClick={updateProfile}
        >
          {isLoading === "loading" ? (
            <CgSpinner className="animate-spin" />
          ) : (
            ButtonsText.update_profile
          )}
        </button>
      </div>
    </div>
  );
};
