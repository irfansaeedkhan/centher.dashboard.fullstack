import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Message } from "@/models/chat";
import { eqAddress } from "@/live/utils/address.utils";
import useUser from "@/hooks/use.user";
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
  messagesEndRef: React.RefObject<HTMLDivElement>;
  pageSize: number;
}> = ({
  data,
  openModalReply,
  onDeleteMessage,
  onEditMessage,
  onEmojiReaction,
  setPageSize,
  messagesEndRef,
  pageSize,
}) => {
  const { user } = useUser();

  const messageRefCallback = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesEndRef]);

  useEffect(() => {
    messageRefCallback();
  }, [messageRefCallback]);

  return (
    <div className={clsx(`flex flex-col gap-2 px-6 pb-8 pt-16`)}>
      {!!data.messages.length ? (
        <>
          {data.messages.length >= 25 && pageSize <= data.messages.length && (
            <button
              className="text-sm text-gray-400 underline underline-offset-[3px]"
              onClick={() => setPageSize(data.messages.length + 25)}
            >
              Load older messages
            </button>
          )}

          {data.messages.map((e, i) => {
            if (eqAddress(e.sender, user?._id)) {
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
