import React, { useEffect, useState, useRef } from "react";
import DOMPurify from "dompurify";
import { SendChatIcon, EyeIcon } from "@/assets/svgs";
import { useStream } from "@/hooks/stream/use.core";
import { BroadcastMessage } from "@/hooks/stream/dto/broadcast-inffo.dto";
import { StreamEventEnum } from "@/stream/model";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import LiveMessage from "@/components/voispace/host/partials/LiveMessage";
import Button from "@/components/button";
import useUser from "@/hooks/use.user";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";
import { CurrentUserContainer } from "../shared/ChannelMainView";

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

interface DynamicProps {
  onClose: () => void;
  roomData: Room;
  currentUserContainer: CurrentUserContainer;
}

const LiveView: React.FC<DynamicProps> = ({
  onClose,
  roomData,
  currentUserContainer,
}) => {
  const {
    useSubscribeToMessages,
    insertMessage,
    liveAgent,
    useSubscribeToCurrentStream,
  } = useStream();

  const {
    event,
    globalIsOwner,
    getAudioStream,
    getVideoStream,
    closeConsumer,
    close,
    userId,
  } = liveAgent;

  const [inputValue, setInputValue] = useState("");
  const [formattedMessages, setFormattedMessages] = useState<
    BroadcastMessage[]
  >([]);
  const { user } = useUser();
  const { messages, loading: subscriptionLoading } = useSubscribeToMessages(
    roomData?.id || "",
    6
  );

  const { stream: currentStream, loader } = useSubscribeToCurrentStream(
    roomData?.id || "",
    roomData?.type === "AMA" ? BroadcastTypeEnum.AMA : BroadcastTypeEnum.LIVE
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesRef = useRef<HTMLDivElement[]>([]);
  const videoStream = getVideoStream();
  const audioStream = getAudioStream();

  useEffect(() => {
    const audioElement = document.getElementById(
      "audioElement"
    ) as HTMLAudioElement;
    if (audioElement && audioStream) {
      audioElement.srcObject = audioStream;
    }
  }, [audioStream]);

  useEffect(() => {
    if (
      event &&
      (event.type == StreamEventEnum.ON_UPDATE_VIDEO_STREAM ||
        event?.type == StreamEventEnum.ON_UPDATE_CONSUMER ||
        event?.type == StreamEventEnum.ON_STREAM_CONNECTED)
    ) {
      const videoElement = videoRef.current;

      if (!videoElement || !videoStream) return;

      videoElement.srcObject = videoStream;
    }
  }, [event, videoStream]);

  const leaveHandler = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.srcObject) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
    try {
      if (globalIsOwner) {
        close();
      } else {
        closeConsumer(roomData.id!);
      }
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  const onSend = async (e: any) => {
    e.preventDefault();
    const pattern =
      /((https?:\/\/|www\.)[^\s]+)|(\b\d{10}\b)|(\+\d{1,3}\s?\d+)/g;
    let message = DOMPurify.sanitize(inputValue, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    message = message.replace(pattern, "[filtered]");
    if (message.trim().length && message.length <= 300) {
      insertMessage(roomData?.id || "", message);
      setInputValue("");
      setFormattedMessages((prev: any) => [
        ...prev.slice(-5),
        {
          sender: {
            display_name: user?.display_name,
            profile_image: user?.profile_image,
          },
          content: message,
          createdAt: new Date(),
        },
      ]);
    }
  };

  useEffect(() => {
    if (messages.length) {
      setFormattedMessages((prev) => {
        const newMessages = messages.filter(
          (msg) => !prev.some((m) => m.id === msg.id)
        );
        const aggregatedMessages = [...prev, ...newMessages]
          .filter((e) => "id" in e)
          .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        return aggregatedMessages;
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="relative min-h-dvh w-full bg-[#0b0b0b] md:min-h-[645px]">
        {/* Video  */}
        <div className="absolute inset-0">
          {videoStream && (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              ref={videoRef}
            ></video>
          )}
        </div>
        {/* Title  */}
        <div className="absolute left-0 top-0 flex w-full flex-col-reverse items-start justify-between gap-2 bg-gradient-to-b from-[#0b0b0b] to-[#0b0b0b7e] p-4 md:flex-row md:gap-3">
          <div className="flex flex-col items-start gap-2">
            <span className="hidden max-w-max rounded bg-[#1C1D21] px-2 py-1 text-xs text-white md:block">
              VoiSpace
            </span>
            <span className="text-gradient-1 font-gravesend text-xl font-bold md:text-2xl">
              {roomData?.name || ""}
            </span>
          </div>
          <div className="flex items-center gap-[20px] mobile-max:w-full mobile-max:justify-between mobile-max:gap-2">
            <div className="flex items-center gap-[6px]">
              <span className="max-w-max rounded bg-[#1C1D21] px-2 py-1 text-xs text-white md:hidden">
                VoiSpace
              </span>
              <div className="flex items-center justify-center gap-2  rounded-[5px] bg-[#1C1D21] px-2 py-1 text-white">
                <span className="h-[10px] w-[10px] rounded-[50%] bg-[#FF453A]"></span>
                <span className="font-monto text-[11px] font-medium">Live</span>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-[5px] bg-[#1C1D21] px-2 py-[1px] text-white">
                <EyeIcon className="scale-75" />
                <span className="font-monto text-[11px] font-medium">
                  {currentStream?.participatorsCount?.aggregate?.count || 0}
                </span>
              </div>
            </div>
            <div className="bg-green-600">
              <audio
                id="audioElement"
                autoPlay
                className="h-4 w-4 bg-red-400 "
              />
            </div>
            <Button
              variant="danger"
              title={
                currentUserContainer?.currentUser?.type == "HOST"
                  ? "Finish"
                  : "Leave"
              }
              className="cursor-pointer font-monto text-[14px] font-medium text-[#E34048]"
              onClick={leaveHandler}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="-bg-gradient-to-t -from-black -to-transparent absolute bottom-0 left-0 w-full space-y-2 p-4">
          <div className="flex flex-col gap-2">
            {subscriptionLoading ? (
              <>
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
              </>
            ) : formattedMessages?.length ? (
              formattedMessages.map((message, index) => (
                <div
                  key={message.id || index}
                  ref={(el) => {
                    if (el) {
                      messagesRef.current[index] = el;
                    } else {
                      delete messagesRef.current[index];
                    }
                  }}
                  style={{
                    opacity: (index + 1) / formattedMessages.length,
                  }}
                  className="max-w-[30ch] break-words text-sm text-white"
                >
                  <LiveMessage message={message} />
                </div>
              ))
            ) : null}
          </div>

          {/* Input Bar */}
          <div className="flex w-full items-center overflow-hidden rounded-[12px] bg-[#212329]">
            <input
              className="font-regular flex-grow border-0 bg-transparent text-[12px] text-white ring-0 focus:outline-none focus:ring-0"
              placeholder="Type something"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSend(e);
                }
              }}
              max={300}
              maxLength={300}
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
