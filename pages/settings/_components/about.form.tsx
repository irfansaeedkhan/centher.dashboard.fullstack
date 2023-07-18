import React, { useState } from "react";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";
import FinalButton from "@/components/button/final.button";
import { PostTextCounter } from "@/components/feed.components/create.post/post.modal/post.text.counter";
import { LoadingState } from "@/models/common";
import { LoggedInUser } from "@/models/user";
import { updateMe } from "@/lib/user";

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
  const [isModified, setIsModified] = useState(false); // track if any input field has been modified

  const updateProfile = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = e.currentTarget;
    button.disabled = true;
    setisLoading("loading");
    try {
      const updatedUserRes = await updateMe({
        profile_bio: updatedUser.profile_bio,
      });

      setUpdatedUser(updatedUserRes);

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
              setIsModified(true);
            }}
            value={updatedUser.profile_bio}
            placeholder="Enter Your bio!"
            name=""
            id=""
            cols={30}
            rows={5}
            maxLength={160}
            className={clsx(inputField, "scrollSetLight2 overflow-auto")}
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

const fieldTitle = `text-sm text-white`;

const inputField = `w-full py-3 px-5 bg-[#1E1E21] text-white rounded-lg border-0 focus:outline-none focus:ring-brand-primary text-sm font-medium leading-6`;
