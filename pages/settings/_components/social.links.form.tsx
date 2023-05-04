// React, Next, NPM Packages
import React, { useState } from "react";
import { useSWRConfig } from "swr";
import { CgSpinner } from "react-icons/cg";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";

// App imports
import { LoadingState } from "@/models/common";
import { LoggedInUser } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";

// Current directory imports
import { InputField } from "./input.field";

interface EditProfileFormProps {
  user: LoggedInUser;
}

const ButtonsText = {
  loading: "Continue...",
  update_profile: "Save Changes",
};

export const SocialLinksForm: React.FC<EditProfileFormProps> = (props) => {
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
        telegram_username: updatedUser.telegram_username,
      });

      setUpdatedUser(data.user as LoggedInUser);

      await mutate("/api/users/me", data.user, false);

      toast.success("Social links updated successfully");
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
          id="telegram_username"
          label="Telegram Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.telegram_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              telegram_username: e.target.value,
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
