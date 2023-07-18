import React, { useState } from "react";
import { useSWRConfig } from "swr";
import { CgSpinner } from "react-icons/cg";
import toast from "react-hot-toast";
import FinalButton from "@/components/button/final.button";
import { LoadingState } from "@/models/common";
import { LoggedInUser } from "@/models/user";
import { updateMe } from "@/lib/user";
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
  const [isModified, setIsModified] = useState(false); // track if any input field has been modified

  const updateProfile = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = e.currentTarget;
    button.disabled = true;
    setisLoading("loading");
    try {
      const updatedUserRes = await updateMe({
        social_media: {
          website_url: updatedUser.social_media.website_url,
          twitter_username: updatedUser.social_media.twitter_username,
          facebook_username: updatedUser.social_media.facebook_username,
          instagram_username: updatedUser.social_media.instagram_username,
          tiktok_username: updatedUser.social_media.tiktok_username,
          twitch_username: updatedUser.social_media.twitch_username,
          onlyfans_username: updatedUser.social_media.onlyfans_username,
          youtube_url: updatedUser.social_media.youtube_url,
          telegram_username: updatedUser.social_media.telegram_username,
        },
      });

      setUpdatedUser(updatedUserRes as LoggedInUser);

      await mutate("/api/users/me", updatedUserRes, false);

      toast.success("Social links updated successfully");
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
        <InputField
          id="website_url"
          label="Website URL"
          placeholder="e.g. https://stevenpaul.com"
          value={updatedUser.social_media.website_url}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              social_media: {
                ...updatedUser.social_media,
                website_url: e.target.value,
              },
            });
            setIsModified(true);
          }}
        />

        <InputField
          id="twitter_username"
          label="Twitter Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.social_media.twitter_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              social_media: {
                ...updatedUser.social_media,
                twitter_username: e.target.value,
              },
            });
            setIsModified(true);
          }}
        />

        <InputField
          id="facebook_username"
          label="Facebook Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.social_media.facebook_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              social_media: {
                ...updatedUser.social_media,
                facebook_username: e.target.value,
              },
            });
            setIsModified(true);
          }}
        />

        <InputField
          id="instagram_username"
          label="Instagram Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.social_media.instagram_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              social_media: {
                ...updatedUser.social_media,
                instagram_username: e.target.value,
              },
            });
            setIsModified(true);
          }}
        />

        <InputField
          id="tiktok_username"
          label="Tiktok Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.social_media.tiktok_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              social_media: {
                ...updatedUser.social_media,
                tiktok_username: e.target.value,
              },
            });
            setIsModified(true);
          }}
        />

        <InputField
          id="twitch_username"
          label="Twitch Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.social_media.twitch_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              social_media: {
                ...updatedUser.social_media,
                twitch_username: e.target.value,
              },
            });
            setIsModified(true);
          }}
        />

        <InputField
          id="onlyfans_username"
          label="OnlyFans Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.social_media.onlyfans_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              social_media: {
                ...updatedUser.social_media,
                onlyfans_username: e.target.value,
              },
            });
            setIsModified(true);
          }}
        />
        <InputField
          id="telegram_username"
          label="Telegram Username"
          placeholder="e.g. stevenpaul"
          value={updatedUser.social_media.telegram_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              social_media: {
                ...updatedUser.social_media,
                telegram_username: e.target.value,
              },
            });
          }}
        />
        <InputField
          id="youtube_url"
          label="Youtube URL"
          placeholder="e.g. https://youtube.com/stevenpaul"
          value={updatedUser.social_media.youtube_url}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              social_media: {
                ...updatedUser.social_media,
                youtube_url: e.target.value,
              },
            });
            setIsModified(true);
          }}
        />

        <FinalButton
          title={ButtonsText.update_profile}
          variant={isModified ? "primary" : "secondary"}
          onClick={updateProfile}
          disabled={!isModified}
          Icon={
            isLoading === "loading" && (
              <CgSpinner className="animate-spin text-white" />
            )
          }
          className="w-fit rounded-[14px] text-sm font-semibold"
        />
      </div>
    </div>
  );
};
