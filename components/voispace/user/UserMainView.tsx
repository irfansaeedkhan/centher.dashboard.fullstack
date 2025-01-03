import React, { useState, useEffect } from "react";

import ModalContainer from "@/components/modal/modal-container";

import { roomType } from "../host/voispace.create.channel.modal";
import TheRoomOfTraders from "../host/TheRoomOfTraders";
import Participators from "../host/Participators";
import InvitetoRoom from "../host/InvitetoRoom";
import ChatRoom from "../host/ChatRoom";
import LiveView from "../host/LiveView";

interface UserMainViewInterface {
  onClose: () => void;
  formState: roomType;
  component: string;
}
type ComponentMap = Map<
  string,
  React.ComponentType<{
    setComponentName: (name: string) => any;
    onClose: () => void;
  }>
>;

const UserMainView: React.FC<UserMainViewInterface> = ({
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
    ["ChatRoom", ChatRoom],
    ["LiveView", LiveView],
  ]);

  const ComponentToRender = componentMap.get(componentName);

  useEffect(() => {
    if (!ComponentToRender) {
      setComponentName("TheRoomOfTraders");
    }
  }, [ComponentToRender]);
  console.log(componentName);
  console.log(formState);
  return (
    <ModalContainer
      modalId="User-settings"
      onClose={onClose}
      isOpen={true}
      modalContentClassName="max-w-[100%] h-[100%] md:h-auto md:max-w-[761px] min-h-[645px] p-0 md:rounded-3xl"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex h-[100%] flex-col justify-between">
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
            })
          : null}
      </div>
    </ModalContainer>
  );
};

export default UserMainView;
