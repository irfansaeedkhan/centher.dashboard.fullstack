import React from "react";
import { clsx } from "clsx";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";

const Accessibility = ({ formState, handleInputChange, loading }: any) => {
  return (
    <div className={clsx(`flex flex-col gap-6`, loading && "opacity-50")}>
      <div className={`text-xl font-medium text-white`}>
        Dive into <span className={`text-gradient-1`}>VoiSpace</span>
      </div>
      <div className="flex w-full flex-col gap-4">
        <div
          onClick={
            !loading
              ? () =>
                  handleInputChange("accessMode", StreamAccessModeEnum.PUBLIC)
              : undefined
          }
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.accessMode === StreamAccessModeEnum.PUBLIC &&
              "gradient-borders-div",
            loading && "pointer-events-none"
          )}
        >
          <div className="px-4 pt-3 text-base font-medium text-white">
            Public
          </div>
          <div className={`px-4 pb-3 text-sm font-normal text-[#A0A4BB]`}>
            Everyone can join this Voispace Room
          </div>
        </div>
        <div
          onClick={
            !loading
              ? () =>
                  handleInputChange(
                    "accessMode",
                    StreamAccessModeEnum.ACCESS_BY_INVITATION
                  )
              : undefined
          }
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.accessMode ===
              StreamAccessModeEnum.ACCESS_BY_INVITATION &&
              "gradient-borders-div",
            loading && "pointer-events-none"
          )}
        >
          <div className="px-4 pt-3 text-base font-medium text-white">
            Private
          </div>
          <div className={`px-4 pb-3 text-sm font-normal text-[#A0A4BB]`}>
            In next step you will add people manually or by invite links
          </div>
        </div>

        <div
          onClick={
            !loading
              ? () =>
                  handleInputChange(
                    "accessMode",
                    StreamAccessModeEnum.ACCESS_BY_TOKEN
                  )
              : undefined
          }
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.accessMode === StreamAccessModeEnum.ACCESS_BY_TOKEN &&
              "gradient-borders-div",
            loading && "pointer-events-none"
          )}
        >
          <div className="px-4 pt-3 text-base font-medium text-white">
            Privileged
          </div>
          <div className={`px-4 pb-3 text-sm font-normal text-[#A0A4BB]`}>
            In next step you will add collection address to get started
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
