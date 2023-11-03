import React from "react";
import clsx from "clsx";
import {
  PrivacyValues,
  PrivacyCookiesValues,
  PrivacyMentionValues,
} from "./privacy.form";

interface RadioButtonProps {
  name: string;
  value: PrivacyValues | PrivacyCookiesValues | PrivacyMentionValues;
  checked: boolean;
  gradient?: boolean;
  label: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  value,
  label,
  checked,
  gradient,
  onChange,
  id,
}) => {
  return (
    <div className="flex items-center">
      <div
        className={clsx({
          "radio-container h-2 w-2": gradient,
          checked: checked,
        })}
      >
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          checked={checked}
          className="form-radio mr-2"
        />
      </div>
      <label
        htmlFor={id}
        className={clsx(`text-sm font-medium leading-6 text-white`, {
          "ml-4": gradient,
        })}
      >
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
