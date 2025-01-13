import React, { useEffect, useState, useRef } from "react";
import DOMPurify from "dompurify";
import { SendChatIcon, EyeIcon } from "@/assets/svgs";
import { useStream } from "@/hooks/stream/use.core";
import { BroadcastMessage } from "@/hooks/stream/dto/broadcast-inffo.dto";
import { StreamEventEnum } from "@/stream/model";
import LiveMessage from "@/components/voispace/host/partials/LiveMessage";
import HostModalHeader from "./partials/HostModalHeader";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";

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
  const { useSubscribeToMessages, insertMessage, liveAgent } = useStream();
  const { event, getAudioStream, getVideoStream, globalIsOwner } = liveAgent;
  const [inputValue, setInputValue] = useState("");
  const [formattedMessages, setFormattedMessages] = useState<
    BroadcastMessage[]
  >([]);

  const { messages, loading: subscriptionLoading } = useSubscribeToMessages(
    roomData?.id || ""
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoStream = getVideoStream();
  const audioStream = getAudioStream();

  useEffect(() => {
    const audioElement = document.getElementById(
      "audioElement"
    ) as HTMLAudioElement;
    console.log({ audioElement, audioStream });
    if (audioElement && audioStream) {
      audioElement.srcObject = audioStream;
    }
  }, [audioStream]);

  useEffect(() => {
    if (event && event.type == StreamEventEnum.ON_UPDATE_VIDEO_STREAM) {
      const videoElement = videoRef.current;

      if (!videoElement || !videoStream) return;

      videoElement.srcObject = videoStream;
    }
  }, [event, videoStream]);

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
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.srcObject) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
    if (globalIsOwner) {
      liveAgent.c;
    }
    onClose();
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
            <div className="bg-green-600">
              <audio
                id="audioElement"
                autoPlay
                className="h-4 w-4 bg-red-400 "
              />
            </div>

            <button
              onClick={() => leaveHandler()}
              className="cursor-pointer font-monto text-[14px] font-medium text-[#E34048]"
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 mt-20 h-[80%] bg-center">
        <div className="absolute inset-0  h-[100%]  w-full">
          {videoStream && (
            <video
              ref={videoRef}
              className="h-[80%] w-full"
              autoPlay
              playsInline
              muted
            />
          )}
        </div>
      </div>

      {/* <div className="absolute inset-0 h-[80%] bg-[url('/images/live-room-bg.svg')] bg-cover bg-center" /> */}
      <div className="relative flex h-[80%] min-h-[645px] flex-col justify-end px-[16px] py-[16px]">
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
              <p className="text-center text-sm text-white">No messages yet</p>
            </div>
          )}
        </div>

        <div className="mt-[50px] flex gap-[8px]">
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
  );
};

export default LiveView;
