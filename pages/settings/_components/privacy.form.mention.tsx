import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { getMentionPermission } from "@/lib/mention-permission";
import { PrivacyMentionValues } from "./privacy.form";
import RadioButton from "./radio.button";

interface Props {
  title: string;
  tagline: string;
  name: string;
  handleOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedState: PrivacyMentionValues;
  setSelectedMentionOption: (value: PrivacyMentionValues) => void;
}

const PrivacyFormMention: React.FC<Props> = ({
  title,
  tagline,
  name,
  handleOptionChange,
  selectedState,
  setSelectedMentionOption,
}) => {
  useEffect(() => {
    getMentionPermission()
      .then((res) => {
        setSelectedMentionOption(res);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [setSelectedMentionOption]);

  return (
    <div>
      <span className="text-lg font-medium text-white">{title}</span>
      <p className="mb-6 text-xs font-medium leading-6 text-gray-shade-14">
        {tagline}
      </p>
      <div className="mt-2 flex flex-col gap-4">
        <RadioButton
          name={name}
          id={name + "everyone"}
          value="everyone"
          label="Everyone"
          checked={selectedState === "everyone"}
          gradient={true}
          onChange={handleOptionChange}
        />
        <RadioButton
          name={name}
          id={name + "followers"}
          value="followers"
          label="Followers"
          checked={selectedState === "followers"}
          gradient={true}
          onChange={handleOptionChange}
        />
        <RadioButton
          name={name}
          id={name + "followings"}
          value="followings"
          label="Followings"
          checked={selectedState === "followings"}
          gradient={true}
          onChange={handleOptionChange}
        />
        <RadioButton
          name={name}
          id={name + "followers_and_followings"}
          value="followers_and_followings"
          label="Followers and Followings"
          checked={selectedState === "followers_and_followings"}
          gradient={true}
          onChange={handleOptionChange}
        />
        <RadioButton
          name={name}
          id={name + "no_one"}
          value="no_one"
          label="No one"
          checked={selectedState === "no_one"}
          gradient={true}
          onChange={handleOptionChange}
        />
      </div>
    </div>
  );
};

export default PrivacyFormMention;
