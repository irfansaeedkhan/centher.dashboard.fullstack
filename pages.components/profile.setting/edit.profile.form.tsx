// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports

// Current directory imports
import { PasswordForm } from "./password.form";
import { InputField } from "./Input.field";
import ProfilePicture from "./profile.picture";

const EditProfileForm: React.FC = () => {
  return (
    <div className="bg-background-shade-1 py-10 flex justify-center items-center">
      <div className="flex flex-col gap-6 max-w-[496px] w-full">
        <ProfilePicture />
        {PasswordForm.slice(0, 5).map((formField) => {
          return (
            <InputField
              key={formField.id}
              {...formField}
              // {...register(formField.id)}
              // error={errors[formField.id]}
            />
          );
        })}
        <div className="flex flex-col gap-2">
          <label htmlFor="textarea" className={fieldTitle}>
            Short bio
          </label>
          <textarea
            placeholder="Enter Your bio!"
            name=""
            id=""
            cols={30}
            rows={5}
            className={inputField}
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="textarea" className={fieldTitle}>
            Filed
          </label>
          <select className={inputField}>
            <option value="">Select</option>
            <option value="">Select</option>
            <option value="">Select</option>
            <option value="">Select</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="textarea" className={fieldTitle}>
            Display Name
          </label>
          <select className={inputField}>
            <option value="">Select</option>
            <option value="pseudonym">Pseudonym</option>
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
          </select>
        </div>
        <button className={connectButton}>Update profile</button>
      </div>
    </div>
  );
};

export default EditProfileForm;

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

const fieldTitle = ctl(`
  text-sm 
  text-white
`);

const inputField = ctl(`
  w-full 
  py-3 
  px-5 
  bg-[#1E1E21] 
  text-white 
  rounded-lg
  border-0
  focus:outline-none 
  focus:ring-brand-primary
`);
