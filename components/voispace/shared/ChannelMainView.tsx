import React, { useState, useEffect } from "react";

import ModalContainer from "@/components/modal/modal-container";
import LiveView from "@/components/voispace/host/LiveView";

import TheRoomOfTraders from "../host/TheRoomOfTraders";
import Participators from "../host/Participators";
import InvitetoRoom from "../host/InvitetoRoom";
import Requests from "../host/Requests";
import ChatRoom from "../host/ChatRoom";
import { RoomData } from "../voispace.feed.card";

interface ChannelMainViewInterface {
  onClose: () => void;
  roomData: RoomData;
  component: string;
}

type ComponentMap = Map<
  string,
  React.ComponentType<{
    setComponentName: (name: string) => any;
    onClose: () => void;
    roomData?: RoomData;
  }>
>;

const ChannelMainView: React.FC<ChannelMainViewInterface> = ({
  onClose,
  roomData,
  component,
}) => {
  const [componentName, setComponentName] = useState<string>(
    component || "TheRoomOfTraders"
  );

  const componentMap: ComponentMap = new Map([
    ["TheRoomOfTraders", TheRoomOfTraders],
    ["Participators", Participators],
    ["InvitetoRoom", InvitetoRoom],
    ["Requests", Requests],
    ["ChatRoom", ChatRoom],
    ["LiveView", LiveView],
  ]);

  const ComponentToRender = componentMap.get(componentName);

  useEffect(() => {
    if (!ComponentToRender) {
      setComponentName("TheRoomOfTraders");
    }
  }, [ComponentToRender]);

  console.log("roomData::", roomData);
  return (
    <ModalContainer
      modalId="host-settings"
      onClose={onClose}
      isOpen={true}
      modalContentClassName="max-w-[100%] h-[100%] md:h-auto md:max-w-[761px] min-h-[645px] p-0 md:rounded-3xl"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="text-white">{JSON.stringify(formState)}</div>
        <div className="flex gap-[10px]">
          {Array.from(componentMap.keys()).map((key) => (
            <button
              key={key}
              className="bg-[#ccc] px-[10px] text-[#000]"
              onClick={() => setComponentName(key)}
            >
              {key}
            </button>
          ))}
        </div>

        {ComponentToRender &&
          React.createElement(ComponentToRender, {
            setComponentName,
            onClose,
            roomData,
          })}
      </div>
    </ModalContainer>
  );
};

export default ChannelMainView;
