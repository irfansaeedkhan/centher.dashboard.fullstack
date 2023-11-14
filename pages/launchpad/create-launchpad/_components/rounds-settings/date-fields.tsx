import React, { MouseEvent, useState } from "react";
import { FormState } from "../../index.page";
import IndexMain from "./date-picker/index-main";

interface Props {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  currentComponent: any;
  handleChangeEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateFields: React.FC<Props> = ({
  formState,
  setFormState,
  currentComponent,
  handleChangeEvent,
}) => {
  return (
    <div className="relative">
      {/* <IndexMain /> */}
      <div className={gradientBorderInputMain}>
        <label htmlFor="end_time" className={label}>
          End Time
          <span className={labelSpan}>*</span>
        </label>
        <div className={gradientBorderInputParent}>
          <input
            type="date"
            id="end_time"
            name="end_time"
            placeholder="Example: 0"
            className={gradientBorderInput}
            value={currentComponent.end_time}
            onChange={handleChangeEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default DateFields;

const gradientBorderInputParent =
  "focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]";
const gradientBorderInput =
  "block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0";
const gradientBorderInputMain =
  "col-span-full mb-6 text-sm font-medium text-white fmd:mb-0 fmd:col-span-1";
const label = "block font-normal tracking-wide";
const labelSpan = "text-gradient ml-[2px]";
