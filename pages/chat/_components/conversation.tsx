import React, { useEffect, useRef, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import clsx from "clsx";
import { Message } from "@/models/chat";
import { eqAddress } from "@/live/utils/address.utils";
import { ChatMessageSkeleton } from "@/components/loading.skeletons/chat.skeletons";
import ClientSide from "./client-side";
import CurrentUserSide from "./current-user-side";
import { UsersDetails } from "../[chat_id].page";

const Conversation: React.FC<{
  openModalReply: (msg: any) => void;
  onDeleteMessage: (msg: any) => void;
  onEditMessage: (msg: any) => void;
  onEmojiReaction: (msg: any, code: string) => void;
  data: {
    messages: Message[];
    usersDetails: UsersDetails[];
  };
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}> = ({
  data,
  openModalReply,
  onDeleteMessage,
  onEditMessage,
  onEmojiReaction,
  setPageSize,
}) => {
  const { account } = useWeb3React();
  const messagesEndRef = useRef<any>(null);
  const [showBlur, setShowBlur] = useState<string>();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className={clsx(`flex flex-col gap-2 px-6 py-8`, showBlur)}>
      {!!data.messages.length ? (
        <>
          {data.messages.length >= 25 && (
            <button
              className="text-sm text-gray-400 underline underline-offset-[3px]"
              onClick={() => setPageSize(data.messages.length + 25)}
            >
              Load older messages
            </button>
          )}

          {data.messages.map((e, i) => {
            if (eqAddress(e.sender, account)) {
              return (
                <CurrentUserSide
                  key={i}
                  data={{
                    message: e,
                    users: data.usersDetails,
                  }}
                  openModalReply={openModalReply}
                  onDeleteMessage={onDeleteMessage}
                  onEditMessage={onEditMessage}
                  onEmojiReaction={onEmojiReaction}
                  setShowBlur={setShowBlur}
                />
              );
            } else {
              return (
                <ClientSide
                  key={i}
                  data={{
                    message: e,
                    users: data.usersDetails,
                  }}
                  openModalReply={openModalReply}
                  onEmojiReaction={onEmojiReaction}
                  setShowBlur={setShowBlur}
                />
              );
            }
          })}
        </>
      ) : (
        <div className="p-5">
          <ChatMessageSkeleton />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Conversation;
