import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { SendChatIcon } from "@/assets/svgs";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";
import ActionButton from "./ui/ActionButton";
import DOMPurify from "dompurify";
import { useStream } from "@/hooks/stream/use.core";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import useUser from "@/hooks/use.user";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => any;
  roomData: Room;
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

const ChatRoom: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
  roomData,
}) => {
  const { useSubscribeToMessages, insertMessage } = useStream();
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(5);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { messages: fetchedMessages, loading: subscriptionLoading } =
    useSubscribeToMessages(roomData?.id || "", limit);
  const { user } = useUser();

  useEffect(() => {
    if (fetchedMessages) {
      const sortedMessages = [...fetchedMessages].sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
      );

      setAllMessages((prev) => {
        const newMessages = sortedMessages.filter(
          (msg) => !prev.some((m) => m.id === msg.id)
        );
        return [...newMessages, ...prev];
      });
    }
  }, [fetchedMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages]);

  const handleScroll = () => {
    if (
      scrollRef.current &&
      scrollRef.current.scrollTop === 0 &&
      !subscriptionLoading &&
      !isFetching
    ) {
      setIsFetching(true);
      setLimit((prev) => prev + 5);
      setTimeout(() => setIsFetching(false), 500);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const addNewMessage = (message: any) => {
    setAllMessages((prev) => {
      return [...prev, message];
    });
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
      setShowEmojiPicker(false);
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

  const getTimeLapsed = (date: Date | string): string => {
    date = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "just now";
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[42px]">
        <HostModalHeader
          subTitle={roomData?.name || "N/A"}
          title="Chat Room"
          onClose={onClose}
          hasBackButton={true}
          onBack={() => setComponentName("TheRoomOfTraders")}
        ></HostModalHeader>
        <div className="flex flex-col gap-[32px]">
          <div
            className="customScrollbar flex h-[calc(100vh-15rem)] flex-col gap-6 overflow-y-auto text-white md:h-[40vh] md:py-6"
            ref={scrollRef}
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
            ) : allMessages.length ? (
              allMessages.map((msg: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="relative flex h-12 w-12 shrink-0  object-cover">
                    <Image
                      src={msg.sender.profile_image}
                      alt={msg.sender.display_name}
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#141416] bg-green-500" />
                  </div>

                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {msg.sender.display_name}
                      </span>

                      <span className="text-xs text-gray-shade-24">
                        {getTimeLapsed(msg.createdAt)}
                      </span>
                    </div>
                    <p className="overflow-wrap white-space max-w-[37.5rem] break-words text-xs mobile-max:w-[72vw]">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-gray-shade-24">
                No messages yet
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 flex min-h-[70px] w-[calc(100%-48px)] -translate-x-1/2 items-center rounded-2xl border border-[#32343C] bg-[#141416] p-[16px] text-white mobile-max:w-[calc(100%-36px)]">
          <form
            id="messageForm"
            onSubmit={(e) => onSend(e)}
            className="relative flex w-full items-center justify-between rounded-xl bg-[#212329] pl-4"
          >
            <div className="relative flex w-full items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-400 transition-colors hover:text-white"
              >
                🙂
              </button>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-12 left-0 z-10"
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                    theme={Theme.DARK}
                  />
                </div>
              )}

              <input
                name="messageInput"
                id="messageInput"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full border-0 bg-transparent p-0 text-white ring-0 focus:outline-none focus:ring-0"
                placeholder="Type something"
              />
            </div>

            <ActionButton
              text="Finish"
              className="bg-transparent"
              form="messageForm"
              type="submit"
            >
              <SendChatIcon />
            </ActionButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
