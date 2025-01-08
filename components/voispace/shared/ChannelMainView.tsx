import React, { useState, useEffect } from "react";

import ModalContainer from "@/components/modal/modal-container";
import LiveView from "@/components/voispace/host/LiveView";

import { Room } from "../host/voispace.create.channel.modal/voispace.create.channel.modal";
import TheRoomOfTraders from "../host/TheRoomOfTraders";
import Participators from "../host/Participators";
import InvitetoRoom from "../host/InvitetoRoom";
import Requests from "../host/Requests";
import ChatRoom from "../host/ChatRoom";

interface ChannelMainViewInterface {
  onClose: () => void;
  formState: Room;
  component: string;
}
type ComponentMap = Map<
  string,
  React.ComponentType<{
    setComponentName: (name: string) => any;
    onClose: () => void;
    formState?: Room;
  }>
>;

const ChannelMainView: React.FC<ChannelMainViewInterface> = ({
  onClose,
  formState,
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

  console.log("formState-create channel::", formState);
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
        <div className="flex gap-[10px]">
          <button
            className="bg-[#ccc] px-[10px] text-[#000]"
            onClick={() => setComponentName("TheRoomOfTraders")}
          >
            Main
          </button>
          <button
            className="bg-[#ccc] px-[10px] text-[#000]"
            onClick={() => setComponentName("Participators")}
          >
            Participators
          </button>
          <button
            className="bg-[#ccc] px-[10px] text-[#000]"
            onClick={() => setComponentName("InvitetoRoom")}
          >
            InvitetoRoom
          </button>
          <button
            className="bg-[#ccc] px-[10px] text-[#000]"
            onClick={() => setComponentName("Requests")}
          >
            Requests
          </button>
          <button
            className="bg-[#ccc] px-[10px] text-[#000]"
            onClick={() => setComponentName("ChatRoom")}
          >
            ChatRoom
          </button>
          <button
            className="bg-[#ccc] px-[10px] text-[#000]"
            onClick={() => setComponentName("LiveView")}
          >
            LiveView
          </button>
        </div>

        {ComponentToRender
          ? React.createElement(ComponentToRender, {
              setComponentName,
              onClose,
              formState,
            })
          : null}
      </div>
    </ModalContainer>
  );
};

export default ChannelMainView;
