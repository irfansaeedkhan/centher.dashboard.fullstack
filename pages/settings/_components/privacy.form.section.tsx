import React, { useState } from "react";
import { PrivacyValues } from "./privacy.form";
import RadioButton from "./radio.button";

interface Props {
  title: string;
  tagline: string;
  name: string;
  handleOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedState: PrivacyValues;
}

const PrivacyFormSection: React.FC<Props> = ({
  title,
  tagline,
  name,
  handleOptionChange,
  selectedState,
}) => {
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
          onChange={handleOptionChange}
        />
        <RadioButton
          name={name}
          id={name + "people_who_follow_you"}
          value="people_who_follow_you"
          label="People who follow you"
          checked={selectedState === "people_who_follow_you"}
          onChange={handleOptionChange}
        />
        <RadioButton
          name={name}
          id={name + "people_you_follow"}
          value="people_you_follow"
          label="People you follow"
          checked={selectedState === "people_you_follow"}
          onChange={handleOptionChange}
        />
        <RadioButton
          name={name}
          id={name + "no_one"}
          value="no_one"
          label="No one"
          checked={selectedState === "no_one"}
          onChange={handleOptionChange}
        />
      </div>
    </div>
  );
};

export default PrivacyFormSection;
