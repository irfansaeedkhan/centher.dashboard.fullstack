// React, Next, NPM Packages
import React from "react";
import { useSWRConfig } from "swr";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";

// App imports
import { LoggedInUser } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";

// Current directory imports
import { InputField } from "./input.field";
import ProfilePicture from "./profile.picture";

interface EditProfileFormProps {
  user: LoggedInUser;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = (props) => {
  const { mutate } = useSWRConfig();
  const [updatedUser, setUpdatedUser] = React.useState(props.user);

  const updateProfile = async () => {
    try {
      const { data } = await axiosNodeApi.patch("/api/users/me", {
        pseudonym: updatedUser.pseudonym,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        display_name_field: updatedUser.display_name_field,
        website_url: updatedUser.website_url,
        twitter_username: updatedUser.twitter_username,
        profile_bio: updatedUser.profile_bio,
      });

      setUpdatedUser(data.user as LoggedInUser);

      await mutate("/api/users/me", data.user, false);

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message_description ??
          error.message ??
          "Something went wrong"
      );
    }
  };

  return (
    <div className="bg-background-shade-1 py-10 flex justify-center items-center">
      <div className="flex flex-col gap-6 max-w-[496px] w-full">
        <ProfilePicture user={props.user} />

        <InputField
          id="pseudonym"
          label="Pseudonym"
          placeholder="Enter your pseudonym"
          value={updatedUser.pseudonym}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              pseudonym: e.target.value,
            });
          }}
        />

        <InputField
          id="first_name"
          label="First Name"
          placeholder="Enter your first name"
          value={updatedUser.first_name}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              first_name: e.target.value,
            });
          }}
        />

        <InputField
          id="last_name"
          label="Last Name"
          placeholder="Enter your last name"
          value={updatedUser.last_name}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              last_name: e.target.value,
            });
          }}
        />

        <div className="flex flex-col gap-2">
          <label className={fieldTitle}>Display Name Field</label>
          <select
            onChange={(e) => {
              setUpdatedUser({
                ...updatedUser,
                display_name_field: e.target
                  .value as LoggedInUser["display_name_field"],
              });
            }}
            value={updatedUser.display_name_field}
            className={inputField}
          >
            <option value="pseudonym">Pseudonym</option>
            <option value="real_name">Real Name</option>
            <option value="account_address">Account Address</option>
          </select>
        </div>

        <InputField
          id="website_url"
          label="Website URL"
          placeholder="Enter your website url"
          value={updatedUser.website_url}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              website_url: e.target.value,
            });
          }}
        />

        <InputField
          id="twitter_username"
          label="Twitter Username"
          placeholder="Enter your twitter username"
          value={updatedUser.twitter_username}
          onChange={(e) => {
            setUpdatedUser({
              ...updatedUser,
              twitter_username: e.target.value,
            });
          }}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="textarea" className={fieldTitle}>
            Profile bio
          </label>
          <textarea
            onChange={(e) => {
              setUpdatedUser({
                ...updatedUser,
                profile_bio: e.target.value,
              });
            }}
            value={updatedUser.profile_bio}
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
