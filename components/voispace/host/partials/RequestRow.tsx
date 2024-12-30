import React from "react";
import Image from "next/image";
import Button from "@/components/button";
import { VipIcon } from "@/assets/svgs";

interface RequestProps {
  request: any;
}

const RequestRow: React.FC<RequestProps> = ({ request }) => {
  const handler = (action) => {
    alert(action);
  };

  return (
    <div className="flex items-center gap-[12px] py-[12px]">
      <Image
        src={request.imageURL}
        alt={request.name}
        width={40}
        height={40}
        objectFit="cover"
        className="rounded-full object-cover"
      />

      <div className="flex flex-grow flex-col gap-[2px]">
        <div className="flex items-center gap-[2px]">
          <span className="text-[14px] font-medium text-[#FFF]">
            {request.name}
          </span>
          {request.isApproved && <VipIcon />}
        </div>
        {request.type === "join" && (
          <span className="text-[12px] font-medium text-[#A8ABBB]">
            Requested to join The{" "}
            <span className="text-[#FFF]">{request.room}</span>
          </span>
        )}

        {request.type === "speak" && (
          <span className="text-[12px] font-medium text-[#A8ABBB]">
            Requested to speak
          </span>
        )}
      </div>

      <div className="flex gap-[12px]">
        <Button
          title="Accept"
          variant="primary"
          onClick={() => handler("Accept")}
          className={` text-xs font-medium`}
          borderRounded="10px"
        />

        <Button
          title="Decline"
          variant="danger"
          onClick={() => handler("Decline")}
          className={` text-xs font-medium`}
          borderRounded="10px"
        />
      </div>
    </div>
  );
};

export default RequestRow;
