// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// Current directory imports
import { PasswordField } from "./password.field";
import { PasswordForm } from "./password.form";
import EditProfileForm from "./edit.profile.form";

const Accordion: React.FC = () => {
  return (
    <div className="accordion accordion-flush" id="accordionFlushExample">
      <div className="accordion-item rounded-none">
        <h2 className="accordion-header mb-0" id="flush-headingTwo">
          <button
            className={titleButton}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseTwo"
            aria-expanded="false"
            aria-controls="flush-collapseTwo"
          >
            Account Settings
          </button>
        </h2>
        <div
          id="flush-collapseTwo"
          className="accordion-collapse border-0 collapse"
          aria-labelledby="flush-headingTwo"
          data-bs-parent="#accordionFlushExample"
        >
          <EditProfileForm />
        </div>
      </div>
      <div className={titleWrapper}>
        <h2 className="accordion-header mb-0" id="flush-headingThree">
          <button
            className={titleButton}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseThree"
            aria-expanded="false"
            aria-controls="flush-collapseThree"
          >
            Your Password
          </button>
        </h2>
        <div
          id="flush-collapseThree"
          className="accordion-collapse collapse"
          aria-labelledby="flush-headingThree"
          data-bs-parent="#accordionFlushExample"
        >
          <div className={passwordFieldWrapper}>
            <div className={FieldWrapper}>
              {PasswordForm.slice(5).map((formField) => {
                return (
                  <PasswordField
                    key={formField.id}
                    {...formField}
                    // {...register(formField.id)}
                    // error={errors[formField.id]}
                  />
                );
              })}
              <button className={connectButton}>Update password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;

const connectButton = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg 
  justify-center 
  text-black
  bg-brand-primary
  hover:bg-brand-primary-dark
  transition-all 
`);

const titleButton = ctl(
  `accordion-button collapsed relative flex items-center w-full lg:p-5 sm:p-3 lg:text-lg sm:text-base text-white text-left !bg-background-shade-1 rounded-none transition focus:outline-none`
);

const titleWrapper = ctl(
  `accordion-item rounded-none bg-background-shade-1 mt-8`
);

const passwordFieldWrapper = ctl(
  `flex bg-background-shade-1 py-10 items-center justify-center`
);

const FieldWrapper = ctl(`flex flex-col gap-6 max-w-[496px] w-full`);
