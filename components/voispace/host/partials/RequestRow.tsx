import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/button";
import { LoaderSpinner, VipIcon } from "@/assets/svgs";

interface RequestProps {
  request: any;
  talkRequestHandler: any;
}

const RequestRow: React.FC<RequestProps> = ({
  request,
  talkRequestHandler,
}) => {
  const [loading, setLoader] = useState(false);

  const handler = (action: string) => {
    setLoader(true);
    talkRequestHandler(request, action);
  };

  return (
    <div className="flex items-center gap-[12px] py-[12px]">
      <Image
        src={request?.profile_image}
        alt={request?.display_name}
        width={40}
        height={40}
        objectFit="cover"
        className="rounded-full object-cover"
      />

      <div className="flex flex-grow flex-col gap-[2px]">
        <div className="flex items-center gap-[2px]">
          <span className="text-[14px] font-medium text-[#FFF]">
            {request?.display_name}
          </span>
          {request?.membership?.status == "citizen" && <VipIcon />}
        </div>
      </div>

      <div className="flex gap-[12px]">
        <Button
          title="Accept"
          variant="primary"
          onClick={() => {
            if (loading) return;
            handler("accept");
          }}
          className={`text-xs font-medium`}
          borderRounded="10px"
          disabled={loading}
          loaderIcon={
            loading &&
            ((
              <LoaderSpinner className="inline-block h-4 w-4 animate-spin" />
            ) as any)
          }
        />

        {/* <Button
          title="Decline"
          variant="danger"
          onClick={() => handler("decline")}
          className={` text-xs font-medium`}
          borderRounded="10px"
        /> */}
      </div>
    </div>
  );
};

export default RequestRow;
