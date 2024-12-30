import React from "react";
import HostModalHeader from "./partials/HostModalHeader";
import Button from "@/components/button";
import { requests } from "../dummy.data/requests.list";
import ClientCardView from "@/components/voispace/shared/profile";

import { HostRequestContext } from "@/components/voispace/host/context/HostRequestContext";

import RequestRow from "@/components/voispace/host/partials/RequestRow";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => string;
}

const Requests: React.FC<DynamicProps> = ({ onClose, setComponentName }) => {
  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[16px]">
        <HostModalHeader
          subTitle="The Room of Traders"
          title="Requests"
          onClose={onClose}
          onBack={() => setComponentName("TheRoomOfTraders")}
        />

        <div className="">
          {requests.map((request, index) => {
            return <RequestRow request={request} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Requests;
