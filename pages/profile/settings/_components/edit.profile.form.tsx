// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
import Joi from "joi";
import toast from "react-hot-toast";

// App imports
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { axiosNodeApi } from "@/utils/axios";

// Current directory imports
import { PasswordForm } from "./account.profile.form";
import { InputField } from "./input.field";
import ProfilePicture from "./profile.picture";

interface EditProfileFormProps {
  user: any;
  // TODO: Mubashir Add type for user
}

export const EditProfileForm: React.FC<EditProfileFormProps> = (props) => {
  // TODO: Mubashir Add type for user
  const [updatedUser, setUpdatedUser] = React.useState(props.user);
  const updateProfile = async () => {
    try {
      await axiosNodeApi.patch("api/users/me", {
        pseudonym: updatedUser.pseudonym,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        profile_bio: updatedUser.profile_bio,
        website_url: updatedUser.website_url,
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  console.log("props", props.user);
  return (
    <div className="bg-background-shade-1 py-10 flex justify-center items-center">
      <div className="flex flex-col gap-6 max-w-[496px] w-full">
        <ProfilePicture />
        {PasswordForm.map((formField) => {
          console.log(
            updatedUser && updatedUser[formField.id as keyof typeof updatedUser]
          );

          return (
            <InputField
              value={
                updatedUser &&
                updatedUser[formField.id as keyof typeof updatedUser]
              }
              onChange={(e) => {
                updatedUser &&
                  setUpdatedUser({
                    ...updatedUser,
                    [formField.id as keyof typeof updatedUser]: e.target.value,
                  });
              }}
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
          <select
            onChange={(e) => {
              updatedUser &&
                setUpdatedUser({
                  ...updatedUser,
                  display_name_field: e.target.value,
                });
            }}
            value={props.user?.display_name_field}
            className={inputField}
          >
            <option value="">Select</option>
            <option
              selected={
                props.user.display_name_field === "pseudonym" ? true : false
              }
              value="pseudonym"
            >
              Pseudonym
            </option>
            <option
              selected={
                props.user.display_name_field === "real_name" ? true : false
              }
              value="real_name"
            >
              Real Name
            </option>
            <option
              selected={
                props.user.display_name_field === "account_address"
                  ? true
                  : false
              }
              value="account_address"
            >
              Account Address
            </option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="textarea" className={fieldTitle}>
            Profile bio
          </label>
          <textarea
            onChange={(e) => {
              updatedUser &&
                setUpdatedUser({
                  ...updatedUser,
                  profile_bio: e.target.value,
                });
            }}
            value={updatedUser?.profile_bio}
            placeholder="Enter Your bio!"
            name=""
            id=""
            cols={30}
            rows={5}
            className={inputField}
          ></textarea>
        </div>

        <button onClick={updateProfile} className={connectButton}>
          Update profile
        </button>
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
