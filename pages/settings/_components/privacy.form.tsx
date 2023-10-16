import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";

import Button from "@/components/button";
import useUser from "@/hooks/use.user";
import { LoadingState } from "@/models/common";
import { updateCookiesConsent } from "@/lib/cookies-consent";

// import PrivacyFormSection from "./privacy.form.section";
import PrivacyFormCookies from "./privacy.form.cookies";

const ButtonsText = {
  loading: "Continue...",
  update_profile: "Save Changes",
};

export const PrivacyForm = () => {
  const [isLoading, setIsLoading] = useState<LoadingState>("idle");
  const { user } = useUser();
  // const [selectedReplyOption, setSelectedReplyOption] =
  //   useState<PrivacyValues>("everyone");
  // const [selectedMessageOption, setSelectedMessageOption] =
  //   useState<PrivacyValues>("everyone");
  // const [selectedPostsOption, setSelectedPostsOption] =
  //   useState<PrivacyValues>("everyone");
  const [selectedCookieOption, setSelectedCookieOption] =
    useState<PrivacyCookiesValues>("allow");

  useEffect(() => {
    if (user) {
      setSelectedCookieOption(
        user.cookies_consent?.consent_given ? "allow" : "decline"
      );
    }
  }, [user]);

  const changePrivacy = async () => {
    try {
      setIsLoading("loading");
      await updateCookiesConsent(selectedCookieOption === "allow");
      setIsLoading("idle");
    } catch {
      setIsLoading("failed");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        {/* <PrivacyFormSection
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
        /> */}

        <PrivacyFormCookies
          title="Cookies"
          tagline="We use third-party cookies in order to personalize your site experience."
          name="cookies"
          handleOptionChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedCookieOption(event.currentTarget.value as any);
          }}
          selectedState={selectedCookieOption}
        />

        <Button
          title={ButtonsText.update_profile}
          variant={"primary"}
          onClick={changePrivacy}
          Icon={
            isLoading === "loading" && (
              <CgSpinner className="animate-spin text-white" />
            )
          }
          className="w-fit text-sm font-medium"
        />
      </div>
    </div>
  );
};

export type PrivacyValues =
  | "everyone"
  | "people_who_follow_you"
  | "people_you_follow"
  | "no_one";

export type PrivacyCookiesValues = "allow" | "decline";
