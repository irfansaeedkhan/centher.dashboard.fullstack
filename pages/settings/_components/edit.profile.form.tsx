// React, Next, NPM Packages
import React, { useState } from "react";
import { useSWRConfig } from "swr";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";
import clsx from "clsx";

// App imports
import { PostTextCounter } from "@/components/feed.components/create.post/post.modal/post.text.counter";
import { LoadingState } from "@/models/common";
import { LoggedInUser } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";
import { SpinIcon3 } from "@/assets/svgs";

// Current directory imports
import { InputField } from "./input.field";
import ProfilePicture from "./profile.picture";

interface EditProfileFormProps {
  user: LoggedInUser;
}

const ButtonsText = {
  loading: "Continue...",
  update_profile: "Update Profile",
};

export const EditProfileForm: React.FC<EditProfileFormProps> = (props) => {
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
    <div className="flex items-center justify-center rounded-lg bg-background-shade-1 py-10 px-5">
      <div className="flex w-full max-w-[496px] flex-col gap-6">
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

        <div className="flex flex-col gap-2">
          <label className={fieldTitle}>Display Name Field</label>
          <select
            onChange={(e) => {
              setUpdatedUser({
                ...updatedUser,
                display_name_field: e.target
                  .value as LoggedInUser["display_name_field"],
              });
            }}
            value={updatedUser.display_name_field}
            className={inputField}
          >
            <option value="pseudonym">Pseudonym</option>
            <option value="real_name">Real Name</option>
            <option value="account_address">Account Address</option>
          </select>
        </div>

        <InputField
          id="website_url"
          label="Website URL"
          placeholder="e.g. https://stevenpaul.com"
          value={updatedUser.website_url}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              website_url: e.target.value,
            });
          }}
        />

        <InputField
          id="twitter_username"
          label="Twitter Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.twitter_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              twitter_username: e.target.value,
            });
          }}
        />

        <InputField
          id="facebook_username"
          label="Facebook Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.facebook_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              facebook_username: e.target.value,
            });
          }}
        />

        <InputField
          id="instagram_username"
          label="Instagram Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.instagram_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              instagram_username: e.target.value,
            });
          }}
        />

        <InputField
          id="tiktok_username"
          label="Tiktok Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.tiktok_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              tiktok_username: e.target.value,
            });
          }}
        />

        <InputField
          id="twitch_username"
          label="Twitch Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.twitch_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              twitch_username: e.target.value,
            });
          }}
        />

        <InputField
          id="onlyfans_username"
          label="OnlyFans Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.onlyfans_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              onlyfans_username: e.target.value,
            });
          }}
        />
        <InputField
          id="youtube_url"
          label="Youtube URL"
          placeholder="e.g. https://youtube.com/stevenpaul"
          value={updatedUser.youtube_url}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              youtube_url: e.target.value,
            });
          }}
        />

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
            <>
              <SpinIcon3 className="animate-spin" />
            </>
          ) : (
            ButtonsText.update_profile
          )}
        </button>
      </div>
    </div>
  );
};

const connectButton = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg 
  justify-center 
  text-black
  bg-brand-primary
  hover:bg-brand-primary-dark
  transition-all 
`);

const fieldTitle = ctl(`
  text-sm 
  text-white
`);

const inputField = ctl(`
  w-full 
  py-3 
  px-5 
  bg-[#1E1E21] 
  text-white 
  rounded-lg
  border-0
  focus:outline-none 
  focus:ring-brand-primary
`);
