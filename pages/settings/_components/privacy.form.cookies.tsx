import React, { useState } from "react";
import { PrivacyCookiesValues } from "./privacy.form";
import RadioButton from "./radio.button";

interface Props {
  title: string;
  tagline: string;
  name: string;
  handleOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedState: PrivacyCookiesValues;
}

const PrivacyFormCookies: React.FC<Props> = ({
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
          id={name + "allow"}
          value="allow"
          label="Allow"
          checked={selectedState === "allow"}
          gradient={true}
          onChange={handleOptionChange}
        />
        <RadioButton
          name={name}
          id={name + "decline"}
          value="decline"
          label="Decline"
          checked={selectedState === "decline"}
          gradient={true}
          onChange={handleOptionChange}
        />
      </div>
    </div>
  );
};

export default PrivacyFormCookies;
