import React, { useEffect, useState, useRef } from "react";
import DOMPurify from "dompurify";
import { SendChatIcon, EyeIcon } from "@/assets/svgs";
import { useStream } from "@/hooks/stream/use.core";
import { BroadcastMessage } from "@/hooks/stream/dto/broadcast-inffo.dto";
import { StreamEventEnum } from "@/stream/model";
import LiveMessage from "@/components/voispace/host/partials/LiveMessage";
import HostModalHeader from "./partials/HostModalHeader";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";
import useUser from "@/hooks/use.user";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";

interface DynamicProps {
  onClose: () => void;
  roomData: Room;
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
  } = liveAgent;
  const [inputValue, setInputValue] = useState("");
  const [formattedMessages, setFormattedMessages] = useState<
    BroadcastMessage[]
  >([]);
  const [limit, setLimit] = useState(10);
  const [isFetching, setIsFetching] = useState(false);
  const { user } = useUser();
  const { messages, loading: subscriptionLoading } = useSubscribeToMessages(
    roomData?.id || "",
    limit
  );

  const { stream: currentStream, loader } = useSubscribeToCurrentStream(
    roomData?.id || "",
    roomData?.type === "AMA" ? BroadcastTypeEnum.AMA : BroadcastTypeEnum.LIVE
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [formattedMessages]);

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
    const pattenr =
      /((https?:\/\/|www\.)[^\s]+)|(\b\d{10}\b)|(\+\d{1,3}\s?\d+)/g;
    let message = DOMPurify.sanitize(inputValue, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    message = message.replace(pattenr, "[filtered]");

    if (message.trim().length > 300) {
      alert("Your message exceeds the 300-character limit.");
      return;
    }
    if (message.trim().length) {
      insertMessage(roomData?.id || "", message);
      setInputValue("");
      addNewMessage({
        sender: {
          display_name: user?.display_name,
          profile_image: user?.profile_image,
        },
        content: message,
        createdAt: new Date(),
      });
    }
  };

  const addNewMessage = (message: any) => {
    setFormattedMessages((prev) => {
      return [...prev, message];
    });
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [formattedMessages]);

  const handleScroll = () => {
    if (
      chatContainerRef.current &&
      chatContainerRef.current.scrollTop === 0 &&
      !isFetching &&
      !subscriptionLoading
    ) {
      setIsFetching(true);
      setLimit((prev) => prev + 10);
      setTimeout(() => setIsFetching(false), 500);
    }
  };
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-col gap-[27px] px-[24px] py-[24px]">
        <HostModalHeader
          subTitle="Voispace"
          title={roomData?.name || ""}
          onClose={onClose}
          onBack={() => setComponentName("Participators")}
        />

        <div className="absolute right-[24px] top-[24px]">
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center gap-[6px]">
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

            <button
              onClick={() => leaveHandler()}
              className="cursor-pointer font-monto text-[14px] font-medium text-[#E34048]"
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 mt-[16%] h-full w-full overflow-hidden rounded-2xl bg-center flg:max-h-[calc(84%-7px)] mobile-max:bottom-0 mobile-max:mt-[35%]">
        <div className="absolute inset-0 h-full w-full">
          {videoStream && (
            <video
              ref={videoRef}
              className="h-full w-full"
              autoPlay
              playsInline
              muted
            />
          )}
        </div>
      </div>

      <div className="z-20 min-h-[70vh] bg-[#00000042] p-4 flg:py-6">
        <div
          className="customScrollbar flex h-[calc(100vh-15.8rem)]  flex-col gap-6 overflow-y-auto !pt-[40%] text-white md:!pt-[25%] flg:h-[calc(100vh-22rem)] flg:p-6"
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
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
                key={index}
                className="max-w-[40ch] break-words  rounded-xl bg-[#212329]/20 p-2 text-sm text-white"
              >
                <LiveMessage message={message} />
              </div>
            ))
          ) : null}
        </div>

        <div className="absolute bottom-3 left-1/2 flex w-[calc(100%-48px)] -translate-x-1/2 items-center  text-white mobile-max:w-[calc(100%-36px)]">
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
