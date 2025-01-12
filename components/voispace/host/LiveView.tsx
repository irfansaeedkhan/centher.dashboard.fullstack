import React, { useEffect, useState } from "react";

import {
  SendChatIcon,
  MicIcon,
  MicIcon2,
  VideoIcon2,
  EyeIcon,
} from "@/assets/svgs";
import LiveMessage from "@/components/voispace/host/partials/LiveMessage";
import DropdownButton from "@/components/voispace/host/ui/DropdownButton";

import HostModalHeader from "./partials/HostModalHeader";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";
import { useStream } from "@/hooks/stream/use.core";
import DOMPurify from "dompurify";
import { BroadcastMessage } from "@/hooks/stream/dto/broadcast-inffo.dto";
import useMediaDevices from "@/hooks/use.get.media.devices";

interface DynamicProps {
  onClose: () => void;
  roomData?: Room;
  setComponentName: (name: string) => string;
}

const MessageSkeleton = () => (
  <div className="flex animate-pulse gap-3">
    <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-700" />
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 rounded bg-gray-700" />
        <div className="h-3 w-12 rounded bg-gray-700" />
      </div>
      <div className="h-3 w-3/4 rounded bg-gray-700" />
    </div>
  </div>
);

const LiveView: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
  roomData,
}) => {
  const { useSubscribeToMessages, insertMessage } = useStream();
  const [inputValue, setInputValue] = useState("");
  const [formattedMessages, setFormattedMessages] = useState<
    BroadcastMessage[]
  >([]);
  const { cameras, microphones, error, updateDevices, getMediaPermissions } =
    useMediaDevices();

  const { messages, loading: subscriptionLoading } = useSubscribeToMessages(
    roomData?.id || ""
  );

  useEffect(() => {
    updateDevices();
  }, [updateDevices]);

  useEffect(() => {
    if (messages.length) {
      console.log({ messages });
      const formattedMessages =
        messages
          ?.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
          ?.reverse() || [];

      setFormattedMessages(formattedMessages);
    }
  }, [messages]);

  const leaveHandler = () => {
    alert("Leave");
  };

  const onSelectCamera = (
    value: MediaDeviceInfo,
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    if (roomData) {
      roomData.videoDevice = value;
    }
  };

  const onSelectMic = (value: MediaDeviceInfo) => {
    if (roomData) {
      roomData.audioDevice = value;
    }
  };

  const onSend = async (e: any) => {
    e.preventDefault();
    const pattenr =
      /((https?:\/\/|www\.)[^\s]+)|(\b\d{10}\b)|(\+\d{1,3}\s?\d+)/g;
    let message = DOMPurify.sanitize(inputValue, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    message = message.replace(pattenr, "[filtered]");

    if (message.trim().length) {
      insertMessage(roomData?.id || "", message);
      setInputValue("");
    }
  };

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-col gap-[27px] px-[24px] py-[24px]">
        <HostModalHeader
          subTitle="Voispace"
          title="Your room for China networks coming to defi"
          onClose={onClose}
          onBack={() => setComponentName("Participators")}
        />

        <div className="absolute right-[24px] top-[24px]">
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center gap-[6px]">
              <div className="flex h-[20px] w-[44px] items-center justify-center gap-[4px] rounded-[5px] bg-[#1C1D21] text-white">
                <span className="h-[8px] w-[8px] rounded-[50%] bg-[#FF453A]"></span>
                <span className="font-monto text-[11px] font-medium">Live</span>
              </div>
              {/* //TODO : number of viewers   */}
              <div className="flex h-[20px] w-[44px] items-center justify-center gap-[2px] rounded-[5px] bg-[#1C1D21] text-white">
                <EyeIcon />
                <span className="font-monto text-[11px] font-medium">549</span>
              </div>
            </div>

            <button
              onClick={leaveHandler}
              className="font-monto text-[14px] font-medium text-[#E34048]"
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      <div className="h-[100%] min-h-[645px] bg-[url('/images/live-room-bg.svg')]">
        <div className="flex h-[100%] min-h-[645px] flex-col justify-end px-[16px] py-[16px]">
          <div className="customScrollbar flex max-h-[40vh] flex-col overflow-y-auto px-2">
            {subscriptionLoading ? (
              <>
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
              </>
            ) : formattedMessages?.length ? (
              formattedMessages.map((message, index) => {
                return <LiveMessage message={message} key={index} />;
              })
            ) : (
              <div className="mx-auto max-w-[350px] rounded-lg bg-black-shade-3/30 px-8 py-4 text-center">
                <p className="text-center text-sm text-white">
                  No messages yet
                </p>
              </div>
            )}
          </div>

          <div className="mt-[50px] flex gap-[8px]">
            <div>
              <DropdownButton
                dropdownContent={() => (
                  <ul className="flex flex-col gap-[8px] p-[8px]">
                    {microphones.map((microphone, index) => (
                      <li
                        className={
                          "flex cursor-pointer gap-[8px] rounded-[1000px] border border-[#32343C] bg-[#212228] p-2 px-[10px] py-[6px] text-[11px] font-medium" +
                          (roomData?.audioDevice?.deviceId ===
                          microphone.deviceId
                            ? "border-black-shade-2 bg-black-shade-2"
                            : "")
                        }
                        key={index}
                        value={microphone.deviceId}
                        onClick={() => onSelectMic(microphone)}
                      >
                        {/* <MicIcon /> */}
                        {microphone.label}
                      </li>
                    ))}
                  </ul>
                )}
              >
                <MicIcon2 className="  [&>*]:stroke-[#A8ABBB]" />
              </DropdownButton>
            </div>
            <div>
              <DropdownButton
                dropdownContent={() => (
                  <ul className="flex flex-col gap-[8px] p-[8px]">
                    {cameras.map((camers, index) => (
                      <li
                        className={
                          "flex cursor-pointer gap-[8px] rounded-[1000px] border border-[#32343C] bg-[#212228] p-2 px-[10px] py-[6px] text-[11px] font-medium" +
                          (roomData?.videoDevice?.deviceId === camers.deviceId
                            ? "border-black-shade-2 bg-black-shade-2"
                            : "")
                        }
                        key={index}
                        value={camers.deviceId}
                        onClick={(e) => onSelectCamera(camers, e)}
                      >
                        {/* <VideoIcon2 /> */}
                        {camers.label}
                      </li>
                    ))}
                  </ul>
                )}
              >
                <VideoIcon2 className="text-white [&>*]:fill-[#A8ABBB]" />
              </DropdownButton>
            </div>
            <div className="flex w-[100%] max-w-[583px] items-center overflow-hidden rounded-[12px] bg-[#212329]">
              <input
                className="font-regular flex-grow border-0 bg-transparent text-[12px] text-white"
                placeholder="Type something"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                className="mr-[12px] h-[20px] w-[20px]"
                onClick={(e) => onSend(e)}
              >
                <SendChatIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
