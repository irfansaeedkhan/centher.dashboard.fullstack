import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import { BsThreeDots } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import useSound from "use-sound";
import clsx from "clsx";
import { IConversation } from "@/live/types";
import { eqAddress } from "@/live/utils/address.utils";
import { getDateDifferent } from "@/live/utils/time.utils";
import { AppRoutes } from "@/constants/app.routes";
import { User } from "@/models/user";
import useUser from "@/hooks/use.user";
import { GradientTick, PinFill, PinIcon, UnpinIcon } from "@/assets/svgs";
import { ChatModal } from "./chat-modal";

export interface UsersDetails {
  _id: User["_id"];
  display_name: User["display_name"];
  profile_image: User["profile_image"];
}

interface ComponentProp {
  data: IConversation;
  users: UsersDetails[];
  onClickSelectConversation: () => void;
  onDeleteConversation: (data: any) => {};
  pinConversation: (data: any) => {};
  unpinConversation: (data: any) => {};
  isSelectConversation: boolean;
}

type IConversationOverView = {
  image: string;
  id?: string;
  user: string;
  lastMessage: string;
  latestUpdate?: string;
  needAttention?: boolean;
};

type IChannelConversationOverview = {
  channelCoverImage: string;
  id?: string;
  title?: string;
  description?: string;
  latestUpdate?: string;
  needAttention?: boolean;
};

const defaultImageForUsers = "/images/chat-profile.png";
const defaultImageForChannles = "";

const defaultChannelInfo = {
  channelCoverImage: "",
  id: "",
  title: "",
  description: "",
  latestUpdate: "",
  needAttention: false,
};
const defaultPrivateInfo = {
  image: "",
  id: "",
  user: "",
  lastMessage: "",
  latestUpdate: "",
  needAttention: false,
  typing: false,
  recording: false,
};

const SingleChatSidebar: React.FC<ComponentProp> = ({
  data,
  users,
  onClickSelectConversation,
  onDeleteConversation,
  isSelectConversation,
  pinConversation,
  unpinConversation,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [conversationOverView, setConversationOverView] =
    useState<IConversationOverView>(defaultPrivateInfo);
  const [channelConversationOverView, setChannelConversationOverView] =
    useState<IChannelConversationOverview>(defaultChannelInfo);

  const [loading, setLoading] = useState<boolean>(true);
  const [isChannel, setIsChannel] = useState<boolean>(false);

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [play] = useSound("/sounds/receive-message.mp3");
  const [playTwo] = useSound("/sounds/send-message.mp3");

  const menuRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const onClickDelete = () => {
    onDeleteConversation(data);
    setIsDeleteModalOpen(false);
  };

  const isMessageSeenByMe = (message: any) => {
    const result = message.activities.find(
      (e: any) => e.type == "seen" && eqAddress(e.user_address, user?._id)
    );
    return !!result;
  };

  const onClicktogglePin = () => {
    if (isPinned) {
      unpinConversation(data);
    } else {
      pinConversation(data);
    }

    setIsPinned((prev) => !prev);
    setIsOpen(false);
  };

  const handleChange = () => {
    setIsChecked((prev) => !prev);
  };

  const controlStringLength = (value: any) => {
    if (typeof value != "string") {
      return "";
    }

    if (value.length > 23) {
      return value.substring(0, 20) + "...";
    } else return value;
  };

  const resetState = () => {
    setLoading(true);
    setIsPinned(false);
    setIsSelected(false);
    setIsChannel(false);
    setChannelConversationOverView(defaultChannelInfo);
    setConversationOverView(defaultPrivateInfo);
  };

  useEffect(() => {
    resetState();
    let needToPlaySound = false;
    if (data && data.is_channel) {
      const myUser = data.user_conversations.find((e) =>
        eqAddress(e.user_address, user?._id)
      );

      if (myUser?.is_pinned) {
        setIsPinned(true);
      }

      const needAttention =
        data.user_conversations
          .filter((e) => !eqAddress(e.user_address, user?._id))
          .map((e) => e.messages)
          .flat()
          .filter((e) => !isMessageSeenByMe(e))?.length > 0;

      const details: IChannelConversationOverview = {
        channelCoverImage: data.cover_path,
        id: data.id,
        title: controlStringLength(data.channel_name),
        description: controlStringLength(data.channel_description),
        latestUpdate: getDateDifferent(data.updated_at),
        needAttention,
      };

      needToPlaySound = needAttention;
      setChannelConversationOverView(details);
      setLoading(false);
      setIsChannel(true);
    }

    if (data && !data.is_channel) {
      const oppositUser = data.user_conversations.find(
        (e) => !eqAddress(e.user_address, user?._id)
      );

      const myUser = data.user_conversations.find((e) =>
        eqAddress(e.user_address, user?._id)
      );

      if (myUser?.is_pinned) {
        setIsPinned(true);
      }

      if (!oppositUser) {
        return;
      }

      const actualUser = users.find((e) =>
        eqAddress(e._id, oppositUser.user_address)
      );

      const messages = data.user_conversations.map((e) => e.messages).flat();
      let lastMessage = "";
      let needAttention = false;

      if (messages?.length) {
        messages.sort(
          (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
        );

        switch (messages[0].type) {
          case "text":
            lastMessage = messages[0].content;
            break;
          case "emoji":
            lastMessage = messages[0].content;
            break;
          case "video":
            lastMessage = "video";
            break;
          case "audio":
            lastMessage = "audio";
            break;
          case "image":
            lastMessage = "image";
            break;
          case "file":
            lastMessage = "document";
            break;
          default:
            break;
        }

        needAttention =
          oppositUser.messages.filter((e) => !isMessageSeenByMe(e))?.length > 0;
      }

      const details: IConversationOverView = {
        image: actualUser ? actualUser.profile_image : defaultImageForUsers,
        id: data.id,
        user: controlStringLength(
          actualUser ? actualUser.display_name : oppositUser.user_address
        ),
        lastMessage: controlStringLength(lastMessage),
        latestUpdate: getDateDifferent(data.updated_at),
        needAttention,
      };

      needToPlaySound = needAttention;
      setConversationOverView(details);
      setLoading(false);
      setIsChannel(false);
    }

    if (needToPlaySound) {
      if (isSelected) {
        playTwo();
      } else {
        // play();
      }
    }
  }, [data, user?._id]);

  useEffect(() => {
    setIsSelected(false);
    if (router.query.chat_id && router.query.chat_id == data.id) {
      setIsSelected(true);
    }
  }, [router, data]);

  return (
    <>
      {loading == false && (
        <div
          className={
            isSelected
              ? "border-gradient-top flex h-20 w-full items-center gap-2 bg-background-shade-3 px-6 py-4"
              : "flex h-20 w-full items-center gap-2 px-6 py-4"
          }
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-grow items-center gap-3">
              {isSelectConversation && (
                <div
                  className={clsx(
                    "relative flex h-4 min-h-[16px] w-4 min-w-[16px] items-center justify-center p-[1px]",
                    {
                      "bg-gray-shade-18": !isChecked,
                      "bg-gradient-pattern": isChecked,
                    }
                  )}
                >
                  {isChecked && (
                    <GradientTick className={clsx("absolute z-10")} />
                  )}

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleChange}
                    className="absolute inset-0 z-20 hidden h-full w-full opacity-0"
                  />

                  <div className="h-full w-full bg-black-shade-3"></div>
                </div>
              )}
              <Link
                href={{
                  pathname: AppRoutes.chat.single_chat,
                  query: { chat_id: data.id },
                }}
                className="flex w-full items-center gap-2"
              >
                <Image
                  src={
                    isChannel
                      ? channelConversationOverView.channelCoverImage
                      : (conversationOverView?.image as string)
                  }
                  alt="profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-grow flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h6 className="text-sm font-semibold leading-[17.07px] text-white">
                      {isChannel
                        ? channelConversationOverView.title
                        : conversationOverView.user}
                    </h6>
                    {isPinned && <PinFill />}
                  </div>
                  <p
                    className={
                      conversationOverView?.needAttention
                        ? "text-xs font-bold leading-[17.07px] text-gray-shade-14"
                        : "text-xs leading-[17.07px] text-gray-shade-14"
                    }
                  >
                    {isChannel
                      ? channelConversationOverView.description
                      : conversationOverView.lastMessage}
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex h-[46px] w-[30px] flex-shrink-0 flex-col items-end justify-between">
              <div className="relative" ref={menuRef}>
                <BsThreeDots
                  className="h-6 w-6 cursor-pointer fill-gray-shade-18 hover:fill-white"
                  onClick={() => setIsOpen((prev) => !prev)}
                />
                {isOpen && (
                  <div className="text-14px absolute right-0 top-[30px] z-[500]  rounded-10px bg-black-shade-12">
                    <span
                      className={clsx(
                        `absolute top-[-3px] right-[18px] h-3 w-3 origin-center translate-y-[-100%] scale-x-[3] text-black-shade-12
                          `
                      )}
                    >
                      &#9650;
                    </span>
                    <button
                      className="flex w-full items-center justify-start gap-3 px-7 py-4 text-white hover:bg-[#202025]"
                      onClick={onClicktogglePin}
                    >
                      {isPinned ? (
                        <>
                          <UnpinIcon className="h-auto w-[20px]" />
                          <span className="min-w-max">Unpin conversation</span>
                        </>
                      ) : (
                        <>
                          <PinIcon className="h-auto w-[20px] " />
                          <span className="min-w-max">Pin conversation</span>
                        </>
                      )}
                    </button>
                    {/* <button
                      className="flex w-full items-center justify-start gap-3 py-4 px-7 text-white hover:bg-[#202025]"
                      onClick={() => {
                        onClickSelectConversation();
                        setIsOpen((prev) => !prev);
                      }}
                    >
                      {isSelectConversation ? (
                        <>
                          <BsCheckSquare className="h-auto w-[18px] fill-white stroke-1" />
                          <span className="min-w-max">
                            Unselect conversation
                          </span>
                        </>
                      ) : (
                        <>
                          <BsCheckSquare className="h-auto w-[18px] fill-white stroke-1" />
                          <span className="min-w-max">Select conversation</span>
                        </>
                      )}
                    </button> */}
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex w-full items-center justify-start gap-3 px-7 py-4 text-red-theme hover:bg-[#202025]"
                    >
                      <FiTrash2 className="h-auto w-[20px] stroke-red-theme" />
                      <span className="min-w-max">Delete conversation</span>
                    </button>
                  </div>
                )}
              </div>

              {/* {conversationOverView?.needAttention ? (
                <div className="flex h-[19px] w-[21px] items-center justify-center bg-gradient-pattern text-xs">
                 
                </div>
              ) : (
                <p className="min-w-max text-xs leading-[14.63px] text-gray-shade-14">
                  {conversationOverView?.latestUpdate}
                </p>
              )} */}
              <p className="min-w-max text-xs leading-[14.63px] text-gray-shade-14">
                {conversationOverView?.latestUpdate}
              </p>
            </div>
          </div>

          <ChatModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onAction={onClickDelete}
            title="Delete conversation"
            content="Do you want to delete this conversation? This process cannot be undone."
          />
        </div>
      )}
    </>
  );
};

export default SingleChatSidebar;
