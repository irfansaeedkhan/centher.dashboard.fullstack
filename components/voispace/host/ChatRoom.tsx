import React, { useState } from "react";
import Image from "next/image";

import { SendChatIcon } from "@/assets/svgs";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";

import ActionButton from "./ui/ActionButton";
import { messages } from "../dummy.data/chat.list";
import DOMPurify from "dompurify";
import { stat } from "fs";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => any;
}

const ChatRoom: React.FC<DynamicProps> = ({ onClose, setComponentName }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const user = {
    id: 10,
    userName: "Shahram",
    userImage: "/images/profiles/Profile-0.svg",
    time: "Just now",
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
      messages.push({
        ...user,
        message,
      });

      setInputValue("");
      // TODO: Message -> Push to server
    }
  };

  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[42px]">
        <HostModalHeader
          subTitle="The Room of Traders"
          title="Chat Room"
          onClose={onClose}
          hasBackButton={true}
          onBack={() => setComponentName("TheRoomOfTraders")}
        ></HostModalHeader>

        <div className="flex flex-col gap-[32px]">
          <div className="customScrollbar flex max-h-[40vh] flex-col gap-6 overflow-y-auto p-6 text-white">
            {messages.map((msg, index) => (
              <div key={index} className="flex gap-3">
                {/* User Avatar */}
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={msg.userImage}
                    alt={msg.userName}
                    width={48}
                    height={48}
                    className="h-full w-full rounded-full"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#141416] bg-green-500" />
                </div>

                {/* Message Content */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{msg.userName}</span>
                    {msg.isReply && (
                      <span className="text-xs text-gray-shade-24">
                        replying to{" "}
                        <span className="text-white">{msg.replyTo}</span>
                      </span>
                    )}
                    <span className="text-xs text-gray-shade-24">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-xs">{msg.message}</p>
                  <button className="mt-1 text-xs text-gray-shade-24 hover:underline">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-h-[70px] items-center rounded-[24px] border border-[#32343C] bg-[#141416] p-[16px] text-white">
          <form
            id="messageForm"
            onSubmit={(e) => onSend(e)}
            className="relative flex w-full items-center justify-between rounded-xl bg-[#212329] pl-4"
          >
            <input
              name="messageInput"
              id="messageInput"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full border-0 bg-transparent p-0 text-white ring-0 focus:outline-none focus:ring-0"
              placeholder="Type something"
            />

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
