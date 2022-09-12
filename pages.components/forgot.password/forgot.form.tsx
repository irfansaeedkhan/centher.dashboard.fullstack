// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NoteLogin } from "@/components/note.login";

export const ForgotForm: React.FC = () => {
  const [emailSentNote, setEmailSentNote] = useState(false);
  return (
    <div className={wrapper}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email or Public key"
          className={inputEmail}
        />
      </div>
      <div>
        <button className={button}>Sent Reset instruction</button>
      </div>
      {emailSentNote && (
        <NoteLogin title="If this email address was used to create an account, instructions to reset your password will be sent to you. Please check your email." />
      )}
    </div>
  );
};

const wrapper = ctl(`
  flex 
  gap-6
  w-full 
  h-auto 
  flex-col 
`);

const fieldWrapper = ctl(`
  flex 
  gap-2
  flex-col 
`);

const fieldTitle = ctl(`
  text-sm 
  text-white
`);

const inputEmail = ctl(`
  py-3 
  px-5 
  w-full 
  border-0 
  rounded-lg 
  text-white 
  bg-[#1E1E21] 
  focus:outline-none 
  focus:ring-brand-primary 
  focus:border-brand-primary
`);

const inputPassword = ctl(`
  p-0 
  w-full
  border-0 
  text-white 
  focus:ring-0 
  bg-transparent 
  focus:border-0 
  focus:outline-none 
`);

const wrapperPassword = ctl(`
  flex 
  py-3 
  px-5 
  gap-2 
  w-full 
  rounded-lg 
  text-white 
  bg-[#1E1E21] 
  items-center 
  justify-between 
`);

const eyeSlash = ctl(`
  cursor-pointer
  text-gray-shade-4
`);

const button = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg 
  dynamicTranss
  text-gray-shade-5 
  justify-center 
  bg-brand-primary 
`);
