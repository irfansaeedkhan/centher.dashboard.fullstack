import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import { useCentherLive } from "@/hooks/chat";
import { CentherLive } from "@/live";
import { eqAddress } from "@/live/utils/address.utils";
import { findOnlineUsers } from "@/live/utils/tools";
import {
  getHoursAndMinutes,
  isToday,
  isYesterday,
} from "@/live/utils/time.utils";
import { UsersDetails } from "../[chat_id].page";
import { ChatModal } from "./chat-modal";
import ProfileImgPlaceholder from "./profile-img-placeholder";
import { customLog } from "@/utils/custom.log";
import useUser from "@/hooks/use.user";
import { BackButton } from "@/components/button/back-button";

const loadingPage = "/images/chat-profile.png";
const defaultImage = "/images/chat-profile.png";
const defaultChannelImage = "/images/chat-profile.png";

const SingleChatHeader: React.FC<{ users: UsersDetails[] }> = ({ users }) => {
  const router = useRouter();
  const { user } = useUser();
  const { adapter } = useCentherLive();
  const [header, setHeader] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [image, setImage] = useState<string>(defaultImage);
  const [title, setTitle] = useState<string>("");
  const [typingUsers, setTypingUsers] = useState<string | null>();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [link, setLink] = useState<string>("");

  const menuRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const onClickDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const onClicktogglePin = () => {
    setIsPinned((prev) => !prev);
    setIsOpen(false);
  };

  const chatId = router.query.chat_id as string;

  const conversationDetailshandler = useCallback(
    (arg: any) => {
      const oppositUserConversation = arg.user_conversations.filter(
        (e: any) => !eqAddress(e.user_address, user?._id)
      );

      if (!oppositUserConversation?.length) return;

      const onlineUsers = findOnlineUsers(oppositUserConversation);

      const header = {
        isChannel: arg.is_channel,
        title: arg.channel_name,
        userAddress: arg.is_channel
          ? ""
          : oppositUserConversation[0]?.user_address,
        description: arg.channel_description,
        onlineUsers,
        latestSeen: !arg.is_channel
          ? oppositUserConversation[0]?.user.latest_update
          : 0,
        typingUsers: oppositUserConversation.filter((e: any) => e.is_typing),
        recordingUsers: oppositUserConversation.filter(
          (e: any) => e.is_recording
        ),
        image: arg.is_channel ? arg.cover_path : defaultChannelImage,
      };

      if (header.isChannel) {
        setImage(header.image);
        setTitle(header.title);
      } else {
        setLink(header.userAddress);
      }

      setHeader(header);
      handleTyping(header.typingUsers, header.isChannel);
    },
    [user?._id]
  );

  useEffect(() => {
    const subToConversation = async (
      connection: CentherLive,
      conversationId: string
    ) => {
      await connection?.subToConversationDetails(
        conversationId,
        conversationDetailshandler
      );
    };

    resetHeaderData();

    if (chatId && adapter) {
      subToConversation(adapter, chatId).catch((e) => {
        customLog(["development", "staging"], e);
      });
    }
  }, [adapter, chatId, conversationDetailshandler]);

  useEffect(() => {
    const getUser = async (address: string) => {
      try {
        const _user = users.find((e) => eqAddress(address, e._id));
        if (_user) {
          setImage(_user.profile_image);
          setTitle(_user.display_name);
        }
      } catch (error: any) {
        throw error;
      }
    };

    if (users.length && users.length == 2 && user) {
      const oppositUser = users.find((e) => !eqAddress(e._id, user?._id));

      if (oppositUser) {
        getUser(oppositUser._id).catch((e) => {
          customLog(["development", "staging"], e);
        });
      }
    }
  }, [users, user]);

  const getUserStatus = useCallback(() => {
    if (!header || !header.latestSeen || header.latestSeen == 0) {
      return "";
    }

    const dateTime = new Date(header?.latestSeen);
    if (header.is_channel) {
      return "";
    }
    if (header.onlineUsers.length > 0) {
      return "online";
    }
    const hoursAndMinutes = getHoursAndMinutes(dateTime);
    if (isToday(dateTime)) {
      return `today ${hoursAndMinutes}`;
    }
    if (isYesterday(dateTime)) {
      return `yesterday ${hoursAndMinutes}`;
    }

    return `${dateTime.toLocaleString().split(",")[0]} ${hoursAndMinutes}`;
  }, [header]);

  const updateStatus = useCallback(() => {
    let stat = getUserStatus();
    setStatus(stat);
  }, [getUserStatus]);

  useEffect(() => {
    updateStatus();
  }, [header, updateStatus]);

  const resetHeaderData = () => {
    setStatus("");
    setHeader(null);
    setImage(loadingPage);
    setTitle("");
    setTypingUsers(null);
  };

  const handleTyping = (userConversations: any[], isChannel: boolean) => {
    if (userConversations.length > 0) {
      const typingUsers = userConversations.map((e: any) => e.user_address);
      if (isChannel) {
        if (typingUsers.length == 1) {
          setTypingUsers(`${typingUsers[0]} is typing...`);
        } else if (typingUsers.length == 2) {
          setTypingUsers(
            `${typingUsers[0]} and ${typingUsers[1]} are typing...`
          );
        } else {
          setTypingUsers(`${typingUsers.length} people are typing...`);
        }
      } else {
        setTypingUsers("typing...");
      }
    } else {
      setTypingUsers(null);
    }
  };

  return (
    <div className="flex h-14 w-full items-center justify-between gap-2 border border-gray-shade-3 bg-elevation-1 px-6">
      <div
        className="flex w-full cursor-pointer items-center gap-2"
        onClick={() => router.push(`/profile/${link}`)}
      >
        {/* TODO=> for channel use cover photo */}
        {image ? (
          <Image
            src={image}
            alt="profile image"
            width={40}
            height={40}
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <ProfileImgPlaceholder className="min-h-[40px] min-w-[40px] " />
        )}
        <div className="flex flex-grow flex-col gap-1">
          <h6 className="text-sm font-semibold leading-[17.07px] text-white">
            {title.length < 20 ? title : title.substring(0, 17) + "..."}
          </h6>
          <p className="text-sm leading-[17.07px] text-gray-shade-14">
            {typingUsers ? typingUsers : status}
          </p>
        </div>
        <BackButton svgClassName="size-[50px]" />
      </div>

      {/* <div className="flex flex-shrink-0 flex-col items-end justify-between">
        <div className="relative" ref={menuRef}>
          <BsThreeDots
            className="h-6 w-6 cursor-pointer fill-gray-shade-18 hover:fill-white"
            onClick={() => setIsOpen((prev) => !prev)}
          />
          {isOpen && (
            <div className="text-sm absolute right-0 top-full z-[500] overflow-hidden rounded-10px bg-black-shade-12">
              <button
                className="flex w-full items-center justify-start gap-3 py-4 px-7 text-white hover:bg-[#202025]"
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
              <button className="flex w-full items-center justify-start gap-3 py-4 px-7 text-white hover:bg-[#202025]">
                <BsCheckSquare className="h-auto w-[18px] fill-white stroke-1" />
                <span className="min-w-max">Select conversation</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex w-full items-center justify-start gap-3 py-4 px-7 text-red-theme hover:bg-[#202025]"
              >
                <FiTrash2 className="h-auto w-[20px] stroke-red-theme" />
                <span className="min-w-max">Delete conversation</span>
              </button>
            </div>
          )}
        </div>
      </div> */}
      <ChatModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onAction={onClickDelete}
        content="Do you want to delete this conversation? This process cannot be undone."
        title="Delete conversation"
      />
    </div>
  );
};

export default SingleChatHeader;
