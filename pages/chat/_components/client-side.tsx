import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import { useWeb3React } from "@web3-react/core";
import clsx from "clsx";
import { getMessageTime } from "@/live/utils/time.utils";
import { eqAddress } from "@/live/utils/address.utils";
import { emojiMapper } from "@/live/utils/emoji.mapper";
import { Emojies } from "@/live/enums/emojis.enum";
import { UsersDetails } from "../[chat_id].page";
import EmojiSenderList from "./emoji-sender-list";
import ProfileImgPlaceholder from "./profile-img-placeholder";
import ClientHoveredList from "./client-hovered-list";
import ClientHoveredListMobile from "./client-hovered-list-mobile";

const defaultImage = "/images/chat-profile.png";

const ClientSide: React.FC<{
  openModalReply: (msg: any) => void;
  onEmojiReaction: (msg: any, code: string) => void;
  data: { message: any; users: UsersDetails[] | null };
}> = ({ data, openModalReply, onEmojiReaction }) => {
  const [time, setTime] = useState<string>("");
  const [emoji, setEmoji] = useState<{ code: string; sender: string }[]>([]);
  const [emojiBar, setEmojiBar] = useState<boolean>(true);
  const [emojiBarMobile, setEmojiBarMobile] = useState<boolean>(false);
  const [emojiSenderListBar, setEmojiSenderListBar] = useState<boolean>(true);
  const [isReply, setIsReply] = useState<boolean>(false);
  const [replyDate, setReplyData] = useState<any>(null);
  const { account } = useWeb3React();
  const [image, setImage] = useState<string>(defaultImage);
  const belowMobile = useMediaQuery("(max-width: 560px)");
  const [preventSelect, setPreventSelect] = useState(false);

  const hoverRef = useRef<HTMLDivElement>(null);
  const clickEmojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEmoji([]);
    setReplyData(null);
    setIsReply(false);
    const time = getMessageTime(data.message.create_at);
    setTime(time);
    if (data.message.repliedTo) {
      const sender = data.users?.find((e) =>
        eqAddress(e._id, data.message.repliedTo.user_address)
      );

      let displayName = sender?.display_name;
      if (eqAddress(sender?._id, account)) {
        displayName = "You";
      }

      if (!displayName?.length) {
        displayName =
          data.message.repliedTo.user_address.substring(0, 22) + "...";
      }

      setReplyData({
        sender: displayName,
        content: data.message.repliedTo.content,
        medias: data.message.repliedTo.medias,
      });

      setIsReply(true);
    }

    if (data.message.reactions.length) {
      setEmoji(data.message.reactions);
    }

    updateImage();
  }, [data]);

  const updateImage = () => {
    const user = data.users?.find((e) => eqAddress(data.message.sender, e._id));

    if (user) {
      setImage(user.profile_image);
    }
  };

  const handleMouseEnter = () => {
    if (hoverRef.current) {
      hoverRef.current.style.display = "block";
      setEmojiBar(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverRef.current) {
      hoverRef.current.style.display = "none";
      setEmojiBar(false);
      handleSetData();
      setEmojiBarMobile(false);
    }
  };

  const handleMouseClickEmojiList = () => {
    if (clickEmojiRef.current) {
      clickEmojiRef.current.style.display = "block";
      setEmojiSenderListBar((prev) => !prev);
    }
  };

  const handleMouseLeaveEmojiList = () => {
    if (clickEmojiRef.current) {
      clickEmojiRef.current.style.display = "none";
      setEmojiSenderListBar(false);
    }
  };

  const onReplayCalled = () => {
    if (openModalReply) {
      openModalReply(data);
    }
  };

  const setEmojiPlaceholder = (emoji: Emojies) => {
    onEmojiReaction(data.message, emoji);
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchDurationRef = useRef<number>(0);

  const handleTouchStart = () => {
    handleSetData();
    const startTime = new Date().getTime();
    touchDurationRef.current = 0;

    const timer = setInterval(() => {
      const duration = new Date().getTime() - startTime;
      touchDurationRef.current = duration;
    }, 100);

    timerRef.current = timer;
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const threshold = 1000; // Adjust this value to your desired hold duration
    if (touchDurationRef.current >= threshold) {
      openPopup();
    }
  };

  const handleSetData = () => {
    setEmojiBarMobile(false);
    setPreventSelect(false);
  };

  const openPopup = () => {
    // Implement your logic to open the pop-up here
    setPreventSelect(true);
    if (hoverRef.current && belowMobile) {
      hoverRef.current.style.display = "block";
      setEmojiBarMobile(true);
    }
  };

  return (
    <>
      {isReply ? (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={clsx(
            `relative flex w-full items-center gap-2`,
            emoji?.length > 0 && "mb-5",
            emojiBarMobile && " bg-[#262323b8] p-1"
          )}
        >
          <div
            className={clsx(
              `flex h-auto w-fit items-end justify-between gap-2 rounded-[10px] border border-gray-shade-3 bg-background-shade-3 px-4 py-[10px] fmd:max-w-[50%]`,
              emojiBarMobile && "bg-[#262323b8] opacity-[0.8]"
            )}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {emoji?.length > 0 && (
              <div
                className="absolute bottom-[5px] left-[35px] z-30 flex translate-y-[100%] items-center justify-center rounded-full bg-black-shade-3  p-1"
                onMouseLeave={handleMouseLeaveEmojiList}
              >
                <div
                  className="flex items-center justify-center gap-2 rounded-full bg-elevation-3 p-[6px]"
                  onClick={handleMouseClickEmojiList}
                >
                  {emoji.length > 0 &&
                    emoji.slice(0, 2).map((emoji, index) => {
                      return (
                        <Image
                          key={index}
                          src={emoji ? emojiMapper[emoji.code as Emojies] : ""}
                          alt="reaction icon"
                          width={13}
                          height={13}
                          sizes="13px"
                          className={`h-[13px] w-[13px]`}
                        />
                      );
                    })}
                  {emoji.length > 2 && (
                    <span className="text-[10px] text-gray-shade-14">+2</span>
                  )}
                </div>
                <div ref={clickEmojiRef} className="hidden">
                  {emojiSenderListBar && (
                    <EmojiSenderList
                      openModalReply={onReplayCalled}
                      setEmojiPlaceholder={setEmojiPlaceholder}
                      emojiSenderListBar={emojiSenderListBar}
                      clientSide={true}
                      users={data.users}
                      emojis={emoji}
                    />
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex w-[98%] gap-3">
                <div className="w-[1px] bg-gradient-pattern"></div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-gradient text-xs">{replyDate.sender}</h4>
                  <p className="text-xs text-gray-shade-14">
                    {replyDate.content}
                  </p>
                </div>
              </div>
              <p
                className={clsx(
                  `word-break text-14px  z-10 leading-[17.07px] text-white`,
                  emojiBarMobile && "bg-[#262323b8]",
                  `${preventSelect && "prevent-select"}`
                )}
              >
                {data.message.content}
              </p>
            </div>
            <p className="z-10 flex gap-1 text-[10px] text-gray-shade-14">
              <span className="min-w-max">{time}</span>
            </p>
          </div>

          {belowMobile ? (
            <div ref={hoverRef} className="hidden">
              {emojiBarMobile && (
                <ClientHoveredListMobile
                  openModalReply={onReplayCalled}
                  setEmojiPlaceholder={setEmojiPlaceholder}
                  emojiBarMobile={emojiBarMobile}
                  handleSetData={handleSetData}
                />
              )}
            </div>
          ) : (
            <div ref={hoverRef} className="hidden">
              {emojiBar && (
                <ClientHoveredList
                  openModalReply={onReplayCalled}
                  setEmojiPlaceholder={setEmojiPlaceholder}
                  emojiBar={emojiBar}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={clsx(
            `relative flex items-center gap-2`,
            emoji?.length > 0 && "mb-5",
            emojiBarMobile && " bg-[#262323b8] p-1"
          )}
        >
          {emoji.length > 0 && (
            <div
              className="absolute bottom-[5px] left-[35px] z-30 flex translate-y-[100%] translate-x-[50%] items-center justify-center rounded-full  bg-black-shade-3 p-1"
              onMouseLeave={handleMouseLeaveEmojiList}
            >
              <div
                className="flex items-center justify-center gap-2 rounded-full bg-elevation-3 p-[6px]"
                onClick={handleMouseClickEmojiList}
              >
                {emoji.slice(0, 2).map((emoji, index) => {
                  return (
                    <Image
                      key={index}
                      src={emoji ? emojiMapper[emoji.code as Emojies] : ""}
                      alt="reaction icon"
                      width={13}
                      height={13}
                      sizes="13px"
                      className={`h-[13px] w-[13px]`}
                    />
                  );
                })}
                {emoji.length > 2 && (
                  <span className="text-[10px] text-gray-shade-14">+2</span>
                )}
              </div>
              <div ref={clickEmojiRef} className="hidden ">
                {emojiSenderListBar && (
                  <EmojiSenderList
                    openModalReply={onReplayCalled}
                    setEmojiPlaceholder={setEmojiPlaceholder}
                    emojiSenderListBar={emojiSenderListBar}
                    clientSide={true}
                    users={data.users}
                    emojis={emoji}
                  />
                )}
              </div>
            </div>
          )}
          {image ? (
            <Image
              src={image}
              alt="user image"
              width={28}
              height={28}
              className="mt-1 !h-7 !w-7 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <ProfileImgPlaceholder className="min-h-[28px] min-w-[28px] " />
          )}

          <div
            className={clsx(
              `flex h-auto w-fit items-end justify-between gap-2 rounded-[10px] border border-gray-shade-3 bg-background-shade-3 px-4 py-[10px] fmd:max-w-[50%]`,
              emojiBarMobile && "bg-[#262323b8] opacity-[0.8]"
            )}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <p
              className={clsx(
                `word-break text-14px z-10 max-w-[calc(90%-10px)] whitespace-pre-wrap break-words leading-[17.07px] text-white`,
                emojiBarMobile && "bg-[#262323b8]",
                `${preventSelect && "prevent-select"}`
              )}
            >
              {data.message.content}
            </p>
            <span className="min-w-max text-[10px] text-gray-shade-14">
              {time}
            </span>
          </div>
          {belowMobile ? (
            <div ref={hoverRef} className="hidden">
              {emojiBarMobile && (
                <ClientHoveredListMobile
                  openModalReply={onReplayCalled}
                  setEmojiPlaceholder={setEmojiPlaceholder}
                  emojiBarMobile={emojiBarMobile}
                  handleSetData={handleSetData}
                />
              )}
            </div>
          ) : (
            <div ref={hoverRef} className="hidden">
              {emojiBar && (
                <ClientHoveredList
                  openModalReply={onReplayCalled}
                  setEmojiPlaceholder={setEmojiPlaceholder}
                  emojiBar={emojiBar}
                />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ClientSide;
