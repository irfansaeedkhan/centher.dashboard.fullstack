import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useRouter } from "next/router";
import { BsEmojiSmile } from "react-icons/bs";
import useSound from "use-sound";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { CentherLive } from "@/live";
import { MessageTypeEnum } from "@/live/enums/message.type";
import { findUnSeenMessages, mapMessages } from "@/live/utils/tools";
import { useCentherLive } from "@/hooks/chat";
import { getUserByIdFromDB } from "@/lib/get-user-by-id";
import { NextPageWithLayout } from "@/pages/_app.page";
import { User } from "@/models/user";
import { ChatPagesWrapper } from "@/components/all.pages.wrapper/chat.pages.wrapper";
import FinalButton from "@/components/button/final.button";
import { customLog } from "@/utils/custom.log";
import {
  CrossIcon,
  EditGradientIcon,
  ReplyGradientIcon,
  SendChatIcon,
} from "@/assets/svgs";
import useUser from "@/hooks/use.user";

import ChatSidebar from "./_components/chat.sidebar";
import SingleChatHeader from "./_components/single-chat-header";
import Conversation from "./_components/conversation";

export interface UsersDetails {
  _id: User["_id"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
}

const SingleChat: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useUser();
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { adapter } = useCentherLive();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [usersDetails, setUsersDetails] = useState<any[]>([]);
  const [timer, setTimer] = useState<any>(null);
  const [typing, setTyping] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(25);
  const [replyModal, setReplyModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [replingMessage, setReplyingMessage] = useState<any>(null);
  const [editingMessage, setEditingMessage] = useState<any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const [play] = useSound("/sounds/send-message.mp3");

  const chatId = router.query.chat_id as string;
  useOnClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));
  useEffect(() => {
    setMessages([]);
    setUsersDetails([]);
  }, [chatId]);

  const messageSubscriptionHandler = useCallback(
    async (connection: CentherLive, args: any) => {
      if (!args) {
        router.push("/chat");
      }

      if (user) {
        let msgs: any[] = [];
        msgs = mapMessages(args, user._id);
        try {
          const messagesReceipts = findUnSeenMessages(msgs, user._id);
          if (messagesReceipts?.length) {
            await connection?.seenMessage({
              message_id: messagesReceipts,
            });
          }

          const sortedMsgs = msgs.sort((a, b) => +a.create_at - +b.create_at);
          setMessages(sortedMsgs);
        } catch (error) {
          customLog(
            ["development", "staging"],
            "error in seen messages",
            error
          );
        }
      } else {
        customLog(["development", "staging"], "Not Logged In!");
      }
    },
    [user, router]
  );

  useEffect(() => {
    const updateTyping = async (adapter: CentherLive, chatId: string) => {
      adapter?.updateIsTyping(chatId, typing);
    };

    if (adapter && chatId) {
      updateTyping(adapter, chatId).catch((e) => {
        customLog(["development", "staging"], e);
      });
    }
  }, [typing, chatId, adapter]);

  useEffect(() => {
    const getUsers = async (
      connection: CentherLive,
      conversationId: string
    ) => {
      const usersIds = await connection?.getConversationUsers(conversationId);

      if (!usersIds?.length) {
        return;
      }

      try {
        const usersDetailsPromise = usersIds.map((item) =>
          getUserByIdFromDB(item)
        );

        const details = (await Promise.allSettled(usersDetailsPromise)).filter(
          (item) => item.status === "fulfilled"
        ) as PromiseFulfilledResult<UsersDetails>[];
        const users = details.map((e) => e.value);
        setUsersDetails(users);
      } catch (error: any) {
        throw error;
      }
    };

    if (adapter && chatId) {
      getUsers(adapter, chatId).catch((e) => {
        customLog(["development", "staging"], e);
      });
    }
  }, [adapter, chatId]);

  useEffect(() => {
    const subToMessages = async (
      connection: CentherLive,
      conversationId: string,
      itemsInPage: number
    ) => {
      await connection?.subToMessages(
        {
          conversationId,
          limit: itemsInPage,
          offset: 0,
        },
        messageSubscriptionHandler,
        connection
      );
    };

    if (chatId) {
      if (adapter) {
        subToMessages(adapter, chatId, pageSize).catch((e) => {
          customLog(["development", "staging"], e);
        });
      } else {
        customLog(["development", "staging"], "adapter is null");
      }
    } else {
      customLog(["development", "staging"], "invalid chat id");
    }
  }, [adapter, chatId, messageSubscriptionHandler, pageSize]);

  const sendMessage = async () => {
    if (!user) {
      return;
    }

    if (!adapter) {
      return;
    }

    if (newMessage.length) {
      play();
      const buffer = newMessage;
      if (editingMessage) {
        await adapter.editMessage(editingMessage.id, buffer);
        setNewMessage("");
        setShowEmojiPicker(false);

        closeEdit();
        setEditingMessage(null);
      } else {
        const replaingMessageBuffer = replingMessage?.message;
        if (messagesEndRef.current) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        setNewMessage("");
        setShowEmojiPicker(false);
        closeReply();
        pushToMessages(buffer, replaingMessageBuffer);

        await adapter?.sendMessage({
          conversationId: chatId,
          content: buffer,
          type: MessageTypeEnum.text,
          user: user._id.toLowerCase(),
          repliedTo: replaingMessageBuffer ? replaingMessageBuffer.id : null,
        });
      }
    }
  };

  const pushToMessages = (content: string, reply: any) => {
    const newMessage = {
      create_at: new Date(),
      id: null,
      sender: user?._id?.toLowerCase(),
      content: content,
      type: "text",
      medias: [],
      isMine: true,
      isSeen: false,
      seenAt: "",
      isFetched: false,
      fetchedAt: "",
      isSent: false,
      reactions: [],
      activities: [],
      repliedTo: reply
        ? {
            content: reply.content,
            created_at: reply.created_at,
            id: reply.id,
            type: reply.type,
            user_address: reply.sender,
            medias: reply.medias,
          }
        : null,
    };

    const newMessageQueue = [...messages, newMessage];
    setMessages(newMessageQueue);
  };

  const onNewMessage = (e: any) => {
    setNewMessage(e.target.value);
  };

  const keyboardHandler = (e: any) => {
    if (e.key == "Enter") {
      sendMessage();
    } else {
      setTyping(true);
      clearTimeout(timer);
      const newTimer = setTimeout(() => {
        setTyping(false);
      }, 1000);

      setTimer(newTimer);
    }
  };

  const openModalReply = (message: any) => {
    setReplyingMessage(message);
    setEditModal(false);
    setReplyModal(true);
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  const closeReply = () => {
    setReplyingMessage(null);
    setReplyModal(false);
    setNewMessage("");
  };

  const deleteMessage = async (msg: any) => {
    await adapter?.removeMessage(msg.message.id);
  };

  const editMessage = (msg: any) => {
    setReplyModal(false);
    setEditModal(true);
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
    setEditingMessage(msg.message);
    setNewMessage(msg.message.content);
  };

  const closeEdit = () => {
    setEditingMessage(null);
    setEditModal(false);
    setNewMessage("");
  };

  const sendEmojiForMessage = async (msg: any, code: string) => {
    await adapter?.addEmojiToMessage(msg.id, code);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji: any) => {
    setNewMessage(newMessage + emoji.native);
  };

  return (
    <div className="h-[calc(100vh-60px)] w-full">
      <SingleChatHeader users={usersDetails} />
      <div className="customScrollbar h-[calc(100%-118px)] overflow-y-auto bg-[url(/images/chat-bg-with-centher-logo.png)] bg-cover bg-center">
        {!!messages.length && (
          <Conversation
            data={{ messages, usersDetails }}
            openModalReply={openModalReply}
            onDeleteMessage={deleteMessage}
            onEditMessage={editMessage}
            onEmojiReaction={sendEmojiForMessage}
            setPageSize={setPageSize}
            messagesEndRef={messagesEndRef}
            pageSize={pageSize}
          />
        )}
      </div>
      <div className="min-h-[60px] w-full border-t border-gray-shade-3 px-4 py-3">
        <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
          <div className="flex w-full flex-col gap-2 rounded-lg  bg-background-shade-3 px-3 py-2 ring-0">
            {replyModal && (
              <div className="flex items-center justify-between bg-background-shade-3 py-2">
                <div className="flex w-full items-center justify-end">
                  <div className="pr-3">
                    <ReplyGradientIcon className="min-w-[20px]" />
                  </div>
                  <div className="flex w-[98%] gap-3">
                    <div className="w-1 bg-gradient-pattern"></div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-gradient text-xs">
                        {replingMessage?.user
                          ? replingMessage?.user.display_name
                          : replingMessage?.message.sender}
                      </h4>
                      <p className="text-xs text-white">
                        {replingMessage?.message.content}
                      </p>
                    </div>
                  </div>
                  <CrossIcon
                    className="mx-auto min-w-[20px] cursor-pointer [&>*]:stroke-gray-shade-14 [&>*]:hover:stroke-white"
                    onClick={() => {
                      closeReply();
                    }}
                  />
                </div>
              </div>
            )}
            {editModal && (
              <div className="flex items-center justify-between bg-background-shade-3 py-2">
                <div className="flex w-full items-center justify-end">
                  <div className="pr-3">
                    <EditGradientIcon className="min-w-[20px]" />
                  </div>
                  <div className="flex w-[98%] gap-3">
                    <div className="w-1 bg-gradient-pattern"></div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-gradient text-xs">Edit Message</h4>
                      <p className="text-xs text-white">
                        {editingMessage?.content}
                      </p>
                    </div>
                  </div>
                  <CrossIcon
                    className="mx-auto min-w-[20px] cursor-pointer [&>*]:stroke-gray-shade-14 [&>*]:hover:stroke-white"
                    onClick={() => {
                      closeEdit();
                    }}
                  />
                </div>
              </div>
            )}

            <div className="focus-within:transparent flex w-full items-center gap-2 ring-0">
              <div
                className="relative mr-2 flex items-center gap-3"
                ref={emojiPickerRef}
              >
                {/* <BsPlusCircleFill className="h-5 w-5 cursor-pointer fill-gray-shade-18 hover:fill-white" />
              <BsImage className="h-5 w-5 cursor-pointer fill-gray-shade-18 hover:fill-white" /> */}
                <button onClick={toggleEmojiPicker}>
                  <BsEmojiSmile className="h-5 w-5 cursor-pointer fill-gray-shade-18 hover:fill-white" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-[2rem] z-[100]">
                    <Picker
                      data={data}
                      onEmojiSelect={handleEmojiSelect}
                      previewPosition={"top"}
                      theme="dark"
                      noCountryFlags={true}
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Type a message"
                className="w-full border-0 bg-transparent p-0 text-white focus:outline-none focus:ring-0"
                onChange={onNewMessage}
                value={newMessage}
                onKeyUp={keyboardHandler}
              />
              {editModal ? (
                <div className="flex w-full flex-col-reverse items-center gap-3 fsm:w-auto fsm:flex-row">
                  <FinalButton
                    title="Cancel"
                    variant="secondary"
                    className="text-14px w-full rounded-[8px] border-gray-shade-7 px-2 py-1 leading-[14px] fsm:w-auto"
                    onClick={() => {
                      closeEdit();
                    }}
                  />
                  <FinalButton
                    title="Save"
                    variant="primary"
                    className="text-14px w-full rounded-[8px] px-2 py-1 leading-[14px] fsm:w-auto"
                    borderRounded="8px"
                    onClick={sendMessage}
                  />
                </div>
              ) : (
                <SendChatIcon
                  className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-shade-3 hover:text-white"
                  onClick={sendMessage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SingleChat.getLayout = (page) => {
  return (
    <ChatPagesWrapper pageTitle="Chat">
      <div className="flex">
        <ChatSidebar />
        {page}
      </div>
    </ChatPagesWrapper>
  );
};

export default SingleChat;
