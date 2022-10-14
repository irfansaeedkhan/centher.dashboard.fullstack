// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
import Joi from "joi";
import toast from "react-hot-toast";

// App imports
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import { PasswordForm } from "./password.form";
import { InputField } from "./input.field";
import ProfilePicture from "./profile.picture";

export const EditProfileForm: React.FC = () => {
  const updateProfile = async () => {
    // try {
    //   const { data } = await axiosNodeApi.post("api/socials/analytics/shares", {
    //     post_id: post._id,
    //   });
    //   return data;
    // } catch (error: any) {
    //   toast.error(
    //     error.response.data?.message_description || "Something went wrong"
    //   );
    // }
  };
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
            Display Name
          </label>
          <select className={inputField}>
            <option value="">Select</option>
            <option value="pseudonym">Pseudonym</option>
            <option value="real_name">Real Name</option>
            <option value="account_address">Account Address</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="textarea" className={fieldTitle}>
            Profile bio
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

        <button className={connectButton}>Update profile</button>
      </div>
    </div>
  );
};

// Joi Schema
// exports.UpdateMeSchema = Joi.object()
//   .keys({
//     pseudonym: Joi.string()
//       .label("Pseudonym")
//       .optional()
//       .trim()
//       .pattern(/^[ A-Za-z0-9_]+$/)
//       .messages({
//         "string.pattern.base":
//           "Pseudonym should only contain alphabets numbers _ and space",
//       }),
//     first_name: Joi.string().label("First Name").trim().optional(),
//     last_name: Joi.string().label("Last Name").trim().optional(),
//     short_bio: Joi.string().label("Short Bio").trim().optional(),
//     field: Joi.string().label("Field").trim().optional(),
//     display_name: Joi.string().label("Display").trim().optional(),
//     custom_image: Joi.boolean().label("Custom Image").optional(),
//     profile_image: Joi.string().label("Profile Image").trim().optional(),
//   })
//   .messages({
//     "string.empty": `{#label} is required`,
//   });

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
