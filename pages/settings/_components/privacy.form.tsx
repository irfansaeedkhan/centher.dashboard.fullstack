// React, Next, NPM Packages
import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";

// App imports
import { LoadingState } from "@/models/common";
import PrivacyFormSection from "./privacy.form.section";

// Current directory imports

const ButtonsText = {
  loading: "Continue...",
  update_profile: "Save Changes",
};

export type PrivacyValues =
  | "everyone"
  | "people_who_follow_you"
  | "people_you_follow"
  | "no_one";

export const PrivacyForm = () => {
  const [isLoading, setisLoading] = useState<LoadingState>("idle");
  const [selectedReplyOption, setSelectedReplyOption] =
    useState<PrivacyValues>("everyone");
  const [selectedMessageOption, setSelectedMessageOption] =
    useState<PrivacyValues>("everyone");
  const [selectedPostsOption, setSelectedPostsOption] =
    useState<PrivacyValues>("everyone");

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        <PrivacyFormSection
          title="Reply"
          tagline="Choose who can reply on your posts"
          name="reply"
          handleOptionChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedReplyOption(event.currentTarget.value as any);
          }}
          selectedState={selectedReplyOption}
        />
        <PrivacyFormSection
          title="Message"
          tagline="Choose who can message you directly"
          name="message"
          handleOptionChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedMessageOption(event.currentTarget.value as any);
          }}
          selectedState={selectedMessageOption}
        />
        <PrivacyFormSection
          title="Who can see your posts"
          tagline="Choose who do you want to show your posts"
          name="posts"
          handleOptionChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedPostsOption(event.currentTarget.value as any);
          }}
          selectedState={selectedPostsOption}
        />
        <button className="mt-2 flex w-fit justify-center rounded-lg bg-brand-primary py-2 px-3 text-sm font-semibold text-black transition-all hover:bg-brand-primary-dark">
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
