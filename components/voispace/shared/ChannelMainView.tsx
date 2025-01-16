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
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";

interface ChannelMainViewInterface {
  onClose: () => void;
  roomData: Room;
  component: string;
}
interface User {
  citizenshipEnd: string;
  createdAt: string;
  id: string;
  lastSeen: string;
}

interface CurrentUser {
  id: string;
  hasTalkRequest: boolean;
  createdAt: string;
  user: User;
  broadcastId: string;
  type: "HOST" | "LISTENER" | "SPEAKER";
  hasPermissionToMessage: boolean;
  isMuted: boolean;
}

export interface CurrentUserContainer {
  currentUser: CurrentUser;
  loader: boolean;
}

type ComponentMap = Map<
  string,
  React.ComponentType<{
    setComponentName: (name: string) => any;
    onClose: () => void;
    roomData: Room;
    unreadMessages: number;
    currentUserContainer: CurrentUserContainer;
  }>
>;

const ChannelMainView: React.FC<ChannelMainViewInterface> = ({
  onClose,
  roomData,
  component,
}) => {
  const {
    amaAgent,
    liveAgent,
    useSubscribeToMessages,
    useSubscribeToCurrentUser,
  } = useStream();

  const userId =
    roomData.type === BroadcastTypeEnum.AMA
      ? amaAgent.userId
      : liveAgent.userId;

  const currentUserContainer = useSubscribeToCurrentUser(
    roomData?.id || "",
    userId || ""
  );

  console.log("currentUserContainer::", currentUserContainer);

  const [componentName, setComponentName] = useState<string>(
    component || "TheRoomOfTraders"
  );

  const [lastReadMessageCount, setLastReadMessageCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const { messages } = useSubscribeToMessages(roomData?.id || "", 5);

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
        `mobile-max:h-dvh mobile-max:rounded-none mobile-max:mx-0 max-w-[100%] h-[100%] md:h-auto md:max-w-[761px] min-h-[645px] p-0 md:rounded-3xl`,
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
            currentUserContainer,
          })}
      </div>
    </ModalContainer>
  );
};

export default ChannelMainView;
