import React, { useState, useEffect } from "react";
import clsx from "clsx";

import ModalContainer from "@/components/modal/modal-container";
import LiveView from "@/components/voispace/host/LiveView";

import TheRoomOfTraders from "../host/TheRoomOfTraders";
import Participators from "../host/Participators";
import InvitetoRoom from "../host/InvitetoRoom";
import Requests from "../host/Requests";
import ChatRoom from "../host/ChatRoom";
import { Room } from "../host/voispace.create.channel.modal/voispace.create.channel.modal";
import { useStream } from "@/hooks/stream/use.core";

interface ChannelMainViewInterface {
  onClose: () => void;
  roomData: Room;
  component: string;
}

type ComponentMap = Map<
  string,
  React.ComponentType<{
    setComponentName: (name: string) => any;
    onClose: () => void;
    roomData: Room;
    unreadMessages: number;
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

  const [lastReadMessageCount, setLastReadMessageCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const { useSubscribeToMessages } = useStream();
  const { messages } = useSubscribeToMessages(roomData?.id || "");

  const componentMap: ComponentMap = new Map();

  componentMap.set("TheRoomOfTraders", TheRoomOfTraders);
  componentMap.set("Participators", Participators);
  componentMap.set("InvitetoRoom", InvitetoRoom);
  componentMap.set("Requests", Requests);
  componentMap.set("ChatRoom", ChatRoom);
  componentMap.set("LiveView", LiveView);

  // const componentMap: ComponentMap = new Map([
  //   ["TheRoomOfTraders", TheRoomOfTraders],
  //   ["Participators", Participators],
  //   ["InvitetoRoom", InvitetoRoom],
  //   ["Requests", Requests],
  //   ["ChatRoom", ChatRoom],
  //   ["LiveView", LiveView],
  // ]);

  const ComponentToRender = componentMap.get(componentName);

  useEffect(() => {
    if (!ComponentToRender) {
      setComponentName("TheRoomOfTraders");
    }
  }, [ComponentToRender]);

  useEffect(() => {
    if (componentName === "ChatRoom") {
      setLastReadMessageCount(messages?.length || 0);
      setUnreadMessages(0);
    }
  }, [componentName, messages]);

  useEffect(() => {
    if (componentName !== "ChatRoom" && messages?.length) {
      const newUnreadCount = messages.length - lastReadMessageCount;
      setUnreadMessages(newUnreadCount > 0 ? newUnreadCount : 0);
    }
  }, [componentName, messages, lastReadMessageCount]);

  return (
    <ModalContainer
      modalId="host-settings"
      onClose={onClose}
      isOpen={true}
      modalContentClassName={clsx(
        `mobile-max:h-[100vh] mobile-max:rounded-none mobile-max:mx-0 max-w-[100%] h-[100%] md:h-auto md:max-w-[761px] min-h-[645px] p-0 md:rounded-3xl`,
        component === "LiveView" && "overflow-hidden"
      )}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex h-full flex-col justify-between">
        {ComponentToRender &&
          React.createElement(ComponentToRender, {
            setComponentName,
            onClose,
            roomData,
            unreadMessages,
          })}
      </div>
    </ModalContainer>
  );
};

export default ChannelMainView;
