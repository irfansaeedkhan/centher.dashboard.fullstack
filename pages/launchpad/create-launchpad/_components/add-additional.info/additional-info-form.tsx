import React from "react";
import AddMember from "./add-member";
import { FormStateProps } from "../shared-types";

const AdditionalInfoForm: React.FC<FormStateProps> = ({
  formState,
  setFormState,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => {
      return {
        ...prev,
        verify_token: {
          ...prev.verify_token,
          [name]: value,
        },
      };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={gridParent}>
        <div className={gradientBorderInputMain}>
          <label htmlFor="logo_url" className={label}>
            Logo URL
            <span className={labelSpan}>*</span>
          </label>
          <div className={gradientBorderInputParent}>
            <input
              type="text"
              id="logo_url"
              name="logo_url"
              placeholder="Example: yourlogo.com/"
              className={gradientBorderInput}
              value={formState.add_additional_info.logo_url}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={gradientBorderInputMain}>
          <label htmlFor="website_url" className={label}>
            Website URL
            <span className={labelSpan}>*</span>
          </label>
          <div className={gradientBorderInputParent}>
            <input
              type="text"
              id="website_url"
              name="website_url"
              placeholder="Example: yourweb.com/"
              className={gradientBorderInput}
              value={formState.add_additional_info.website_url}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className={gridParent}>
        <div className={gradientBorderInputMain}>
          <label htmlFor="facebook" className={label}>
            Facebook
          </label>
          <div className={gradientBorderInputParent}>
            <input
              type="text"
              id="facebook"
              name="facebook"
              placeholder="Example: facebook.com/"
              className={gradientBorderInput}
              value={formState.add_additional_info.facebook}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={gradientBorderInputMain}>
          <label htmlFor="twitter" className={label}>
            Twitter
          </label>
          <div className={gradientBorderInputParent}>
            <input
              type="text"
              id="twitter"
              name="twitter"
              placeholder="Example: twitter.com/"
              className={gradientBorderInput}
              value={formState.add_additional_info.twitter}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className={gridParent}>
        <div className={gradientBorderInputMain}>
          <label htmlFor="github" className={label}>
            Github
            <span className={labelSpan}>*</span>
          </label>
          <div className={gradientBorderInputParent}>
            <input
              type="text"
              id="github"
              name="github"
              placeholder="Example: github.com/"
              className={gradientBorderInput}
              value={formState.add_additional_info.github}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={gradientBorderInputMain}>
          <label htmlFor="telegram" className={label}>
            Telegram
          </label>
          <div className={gradientBorderInputParent}>
            <input
              type="text"
              id="telegram"
              name="telegram"
              placeholder="Example: telegram.com/"
              className={gradientBorderInput}
              value={formState.add_additional_info.telegram}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className={gridParent}>
        <div className={gradientBorderInputMain}>
          <label htmlFor="instagram" className={label}>
            Instagram
          </label>
          <div className={gradientBorderInputParent}>
            <input
              type="text"
              id="instagram"
              name="instagram"
              placeholder="Example: instagram.com/"
              className={gradientBorderInput}
              value={formState.add_additional_info.instagram}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={gradientBorderInputMain}>
          <label htmlFor="discord" className={label}>
            Discord
          </label>
          <div className={gradientBorderInputParent}>
            <input
              type="text"
              id="discord"
              name="discord"
              placeholder="Example: discord.com/"
              className={gradientBorderInput}
              value={formState.add_additional_info.discord}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className={gradientBorderInputMain}>
        <label htmlFor="reddit" className={label}>
          Reddit
        </label>
        <div className={gradientBorderInputParent}>
          <input
            type="text"
            id="reddit"
            name="reddit"
            placeholder="Example: reddit.com/"
            className={gradientBorderInput}
            value={formState.add_additional_info.reddit}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={gradientBorderInputMain}>
        <label htmlFor="description" className={label}>
          Description
          <span className={labelSpan}>*</span>
        </label>
        <div className={gradientBorderInputParent}>
          <textarea
            rows={5}
            id="description"
            name="description"
            placeholder="Example: description"
            className={gradientBorderInput}
            value={formState.add_additional_info.description}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                add_additional_info: {
                  ...prev.add_additional_info,
                  description: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>
      <AddMember formState={formState} setFormState={setFormState} />
      <p className="text-sm text-gray-shade-14">
        <span className="text-white">Note: </span>
        Disclaimer: The information provided shall not in any way constitute a
        recommendation as to whether you should invest in any product discussed.
        We accept no liability for any loss occasioned to any person acting or
        refraining from action as a result of any material provided or
        published.
      </p>
    </div>
  );
};

export default AdditionalInfoForm;

const gradientBorderInputParent =
  "focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]";
const gradientBorderInput =
  "block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0";
const gradientBorderInputMain =
  "col-span-full mb-6 text-sm font-medium text-white fmd:mb-0 fmd:col-span-1";
const label = "block font-normal tracking-wide";
const labelSpan = "text-gradient ml-[2px]";
const gridParent = "grid gap-5 fmd:grid-cols-2";
