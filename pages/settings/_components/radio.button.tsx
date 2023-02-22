import React from "react";
import { PrivacyValues } from "./privacy.form";

interface RadioButtonProps {
  name: string;
  value: PrivacyValues;
  checked: boolean;
  label: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  value,
  label,
  checked,
  onChange,
  id,
}) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        className="form-radio mr-2 h-6 w-6"
      />
      <label htmlFor={id} className="text-sm font-medium leading-6 text-white">
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
