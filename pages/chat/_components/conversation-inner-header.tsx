import React from "react";
import { ConversationHeadPropModel } from "@/models/chat";
import ProfileImgPlaceholder from "./profile-img-placeholder";

const ConversationInnerHeader: React.FC<{
  data: ConversationHeadPropModel | null;
}> = ({ data }) => {
  return (
    <div className="flex h-[228px] w-full items-center justify-center border-b border-gray-shade-3">
      <div className="flex flex-col items-center justify-center">
        <div>
          <ProfileImgPlaceholder className="min-h-[60px] min-w-[60px] " />
        </div>
        <div className="mt-3">
          <h6 className="text-sm font-semibold leading-[17px] text-white">
            {data ? data.displayName : " "}
          </h6>
          <p className="mt-[2px] text-center text-sm font-medium leading-[17px] text-gray-shade-14">
            {data ? data.address : " "}
          </p>
        </div>
        <div className="mt-3">
          <p className="text-center text-sm leading-[17px] text-gray-shade-14">
            {data ? data.followers : 0} followers · {data ? data.followings : 0}{" "}
            Following
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationInnerHeader;
