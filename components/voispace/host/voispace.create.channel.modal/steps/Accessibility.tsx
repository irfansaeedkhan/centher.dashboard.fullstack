import React from "react";
import { clsx } from "clsx";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";

const Accessibility = ({ formState, handleInputChange }: any) => {
  return (
    <div className="flex flex-col gap-6">
      <div className={`text-xl font-medium text-white`}>
        Dive into <span className={`text-gradient-1`}>VoiceSpace</span>
      </div>
      <div className="flex w-full flex-col gap-4">
        <div
          onClick={() =>
            handleInputChange("accessMode", StreamAccessModeEnum.PUBLIC)
          }
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.accessMode === StreamAccessModeEnum.PUBLIC &&
              "gradient-borders-div"
          )}
        >
          <div className="px-4 pt-2 text-base font-medium text-white">
            Public
          </div>
          <div className={`px-4 pb-2 text-sm font-normal text-[#A0A4BB]`}>
            Everyone can join this Voispace Room
          </div>
        </div>
        <div
          onClick={() =>
            handleInputChange(
              "accessMode",
              StreamAccessModeEnum.ACCESS_BY_INVITATION
            )
          }
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.accessMode ===
              StreamAccessModeEnum.ACCESS_BY_INVITATION &&
              "gradient-borders-div"
          )}
        >
          <div className="px-4 pt-2 text-base font-medium text-white">
            Private
          </div>
          <div className={`px-4 pb-2 text-sm font-normal text-[#A0A4BB]`}>
            In next step you will add people manually or by invite links
          </div>
        </div>

        <div
          onClick={() =>
            handleInputChange(
              "accessMode",
              StreamAccessModeEnum.ACCESS_BY_TOKEN
            )
          }
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.accessMode === StreamAccessModeEnum.ACCESS_BY_TOKEN &&
              "gradient-borders-div"
          )}
        >
          <div className="px-4 pt-2 text-base font-medium text-white">
            Privilege
          </div>
          <div className={`px-4 pb-2 text-sm font-normal text-[#A0A4BB]`}>
            In next step you will add collection address to get started
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
