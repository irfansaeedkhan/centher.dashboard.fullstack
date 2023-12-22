import React from "react";
import { FormStateProps } from "../shared-types";
import { CustomNumberInput } from "@/components/custom-number-input";

const MultilevelRewardSystem: React.FC<FormStateProps> = ({
  formState,
  setFormState,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {formState.verify_token.multilevel_reward_system.map((item, i) => {
        return (
          <div className={gradientBorderInputMain} key={i}>
            <label htmlFor="level" className={label}>
              Level {item.level}
            </label>
            <div className={gradientBorderInputParent}>
              <CustomNumberInput
                id="level"
                name="level"
                placeholder="%Monthly"
                className={gradientBorderInput}
                value={item.reward === 0 ? "" : item.reward}
                onChange={(e) => {
                  setFormState((prev) => {
                    return {
                      ...prev,
                      verify_token: {
                        ...prev.verify_token,
                        multilevel_reward_system: [
                          ...prev.verify_token.multilevel_reward_system,
                          {
                            level: item.level,
                            reward: Number(e.target.value),
                          },
                        ],
                      },
                    };
                  });
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MultilevelRewardSystem;

const gradientBorderInputParent =
  "focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]";
const gradientBorderInput =
  "block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0";
const gradientBorderInputMain =
  "col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0";
const label = "block font-normal tracking-wide";
