import React, { useState, useEffect } from "react";

import TheRoomOfTraders from "./TheRoomOfTraders";
import Participators from "./Participators";
import InvitetoRoom from "./InvitetoRoom";
import Requests from "./Requests";
import LiveView from "@/components/voispace/host/LiveView";

import ModalContainer from "@/components/modal/modal-container";
import { Room } from "./voispace.create.channel.modal";

interface HostMainViewInterface {
  onClose: () => void;
  formState: Room;
}
type ComponentMap = Map<
  string,
  React.ComponentType<{
    setComponentName: (name: string) => any;
    onClose: () => void;
  }>
>;

const HostMainView: React.FC<HostMainViewInterface> = ({
  onClose,
  formState,
}) => {
  const [componentName, setComponentName] = useState<string>("");

  const componentMap: ComponentMap = new Map([
    ["TheRoomOfTraders", TheRoomOfTraders],
    ["Participators", Participators],
    ["InvitetoRoom", InvitetoRoom],
    ["Requests", Requests],
    ["LiveView", LiveView],
  ]);

  const ComponentToRender = componentMap.get(componentName);

  useEffect(() => {
    if (!ComponentToRender) {
      setComponentName("TheRoomOfTraders");
    }
  }, [ComponentToRender]);

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

export default HostMainView;
