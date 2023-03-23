import React, { useState } from "react";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";

import { PostTextCounter } from "@/components/feed.components/create.post/post.modal/post.text.counter";
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

export const AboutForm: React.FC<EditProfileFormProps> = (props) => {
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
        <div className="relative flex flex-col gap-2">
          <label htmlFor="textarea" className={fieldTitle}>
            Profile bio
          </label>
          <textarea
            onChange={(e) => {
              setUpdatedUser({
                ...updatedUser,
                profile_bio: e.target.value,
              });
            }}
            value={updatedUser.profile_bio}
            placeholder="Enter Your bio!"
            name=""
            id=""
            cols={30}
            rows={5}
            maxLength={160}
            className={clsx(inputField)}
          ></textarea>
          {updatedUser.profile_bio.length > 0 && (
            <div className="absolute bottom-2 right-2 z-[100] ml-4 h-7 w-7 fsm:ml-0">
              <PostTextCounter
                currentLength={updatedUser.profile_bio.length}
                maxLength={160}
              />
            </div>
          )}
        </div>

        <button className={connectButton} onClick={updateProfile}>
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

const connectButton = `mt-2 py-2 px-3 text-sm flex w-[128px] h-9 font-semibold rounded-lg justify-center items-center text-black bg-brand-primary hover:bg-brand-primary-dark transition-all`;

const fieldTitle = `text-sm text-white`;

const inputField = `w-full py-3 px-5 bg-[#1E1E21] text-white rounded-lg border-0 focus:outline-none focus:ring-brand-primary text-sm font-medium leading-6`;
