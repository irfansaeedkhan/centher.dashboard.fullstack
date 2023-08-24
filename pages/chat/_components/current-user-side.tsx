// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { useMediaQuery } from "usehooks-ts";
// import clsx from "clsx";
// import { eqAddress } from "@/live/utils/address.utils";
// import { getMessageTime } from "@/live/utils/time.utils";
// import { emojiMapper } from "@/live/utils/emoji.mapper";
// import useUser from "@/hooks/use.user";
// import { urlify } from "@/live/utils/tools";
// import { Emojies } from "@/live/enums/emojis.enum";
// import { Delivered, Pending, Seen, Sent } from "@/assets/svgs";
// import { UsersDetails } from "../[chat_id].page";
// import CurrentUserHoveredList from "./current-user-hovered-list";
// import CurrentUserHoveredListMobile from "./current-user-hovered-list-mobile";
// import EmojiSenderList from "./emoji-sender-list";
// import { set } from "lodash";

// const CurrentUserSide: React.FC<{
//   openModalReply: (msg: any) => void;
//   onDeleteMessage: (msg: any) => void;
//   onEditMessage: (msg: any) => void;
//   onEmojiReaction: (msg: any, code: string) => void;
//   data: { message: any; users: UsersDetails[] | null };
// }> = ({
//   data,
//   openModalReply,
//   onDeleteMessage,
//   onEditMessage,
//   onEmojiReaction,
// }) => {
//   const [time, setTime] = useState<string>("");
//   const { user } = useUser();
//   const [emoji, setEmoji] = useState<{ code: string; sender: string }[]>([]);
//   const [emojiBar, setEmojiBar] = useState<boolean>(true);
//   const [emojiBarMobile, setEmojiBarMobile] = useState<boolean>(false);
//   const [emojiSenderListBar, setEmojiSenderListBar] = useState<boolean>(true);
//   const [isReply, setIsReply] = useState<boolean>(false);
//   const [replyDate, setReplyData] = useState<any>(null);
//   const belowMobile = useMediaQuery("(max-width: 560px)");
//   const [preventSelect, setPreventSelect] = useState(false);
//   const [t, sett] = useState("");

//   const hoverRef = useRef<HTMLDivElement>(null);
//   const clickEmojiRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setEmoji([]);
//     setReplyData(null);
//     setIsReply(false);
//     const time = getMessageTime(data.message.create_at);
//     setTime(time);
//     if (data.message.repliedTo) {
//       const sender = data.users?.find((e) =>
//         eqAddress(e._id, data.message.repliedTo.user_address)
//       );

//       let displayName = sender?.display_name;
//       if (eqAddress(sender?._id, user?._id)) {
//         displayName = "You";
//       }

//       if (!displayName?.length) {
//         displayName =
//           data.message.repliedTo.user_address.substring(0, 22) + "...";
//       }

//       setReplyData({
//         sender: displayName,
//         content: data.message.repliedTo.content,
//         medias: data.message.repliedTo.medias,
//       });
//       setIsReply(true);
//     }

//     if (data.message.reactions.length) {
//       setEmoji(data.message.reactions);
//     }
//   }, [data, user?._id]);

//   const handleMouseEnter = () => {
//     if (hoverRef.current) {
//       hoverRef.current.style.display = "block";
//       setEmojiBar(true);
//     }
//   };

//   const handleMouseLeave = () => {
//     console.log("leave mouse");
//     sett((prevT) => prevT + "leave mouse");
//     if (hoverRef.current) {
//       hoverRef.current.style.display = "none";
//       setEmojiBar((prevEmojiBar) => false);
//       setEmojiBarMobile((setEmojiBarMobile) => false);
//       console.log("check");
//     }
//     sett(t + "check");
//   };

//   const handleMouseClickEmojiList = () => {
//     if (clickEmojiRef.current) {
//       clickEmojiRef.current.style.display = "block";
//       setEmojiSenderListBar((prev) => !prev);
//     }
//   };

//   const handleMouseLeaveEmojiList = () => {
//     sett("handle leve mobile");
//     if (clickEmojiRef.current) {
//       sett("handle leve mobile current");
//       clickEmojiRef.current.style.display = "none";
//       setEmojiSenderListBar(false);
//     }
//   };

//   function handleTouchLeave(event: any) {
//     // Code to run when touch leaves the element
//     sett("hiiiiiii");
//     var boxElement = document.getElementById("box");
//     if (!boxElement?.contains(event.target)) {
//       setEmojiBar(false);
//       setEmojiBarMobile(false);
//       console.log("hell");
//     }
//   }

//   const onReplayCalled = () => {
//     if (openModalReply) {
//       openModalReply(data);
//     }
//   };

//   const deleteMessage = () => {
//     onDeleteMessage(data);
//   };

//   const onMessageEdit = () => {
//     onEditMessage(data);
//   };

//   const setEmojiPlaceholder = (emoji: Emojies) => {
//     onEmojiReaction(data.message, emoji);
//   };

//   const setEmojiPlaceholderMobile = (emoji: Emojies) => {
//     onEmojiReaction(data.message, emoji);
//   };

//   // let dummyEmojiData = [emoji, emoji, emoji, emoji, emoji, emoji];

//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const touchDurationRef = useRef<number>(0);

//   const handleTouchStart = () => {
//     handleSetData();
//     const startTime = new Date().getTime();
//     touchDurationRef.current = 0;

//     const timer = setInterval(() => {
//       const duration = new Date().getTime() - startTime;
//       touchDurationRef.current = duration;
//     }, 100);

//     timerRef.current = timer;
//   };

//   const handleTouchEnd = () => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }

//     const threshold = 1000; // Adjust this value to your desired hold duration
//     if (touchDurationRef.current >= threshold) {
//       openPopup();
//     }
//   };

//   const handleMouseLeaveMobile = () => {
//     if (hoverRef.current && belowMobile) {
//       hoverRef.current.style.display = "none";
//       setEmojiBarMobile(false);
//     }
//   };

//   const handleSetData = () => {
//     setEmojiBarMobile(false);
//     setPreventSelect(false);
//   };

//   const openPopup = () => {
//     // Implement your logic to open the pop-up here
//     setPreventSelect(true);
//     if (hoverRef.current && belowMobile) {
//       hoverRef.current.style.display = "block";
//       setEmojiBarMobile(true);
//     }
//   };
//   return (
//     <>
//       <p className="text-white">{t}</p>
//       {isReply ? (
//         <div
//           className={clsx(
//             `relative flex w-full items-center justify-end gap-2`,
//             emoji?.length > 0 && "mb-5",
//             emojiBarMobile && "bg-[#262323b8] p-1"
//           )}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           {belowMobile ? (
//             <div ref={hoverRef} className="hidden">
//               {emojiBarMobile && (
//                 <CurrentUserHoveredListMobile
//                   openModalReply={onReplayCalled}
//                   onDeleteConfirmed={deleteMessage}
//                   onMessageEdit={onMessageEdit}
//                   setEmojiPlaceholder={setEmojiPlaceholderMobile}
//                   emojiBarMobile={emojiBarMobile}
//                   handleSetData={handleSetData}
//                 />
//               )}
//             </div>
//           ) : (
//             <div ref={hoverRef} className="hidden">
//               {emojiBar && (
//                 <CurrentUserHoveredList
//                   openModalReply={onReplayCalled}
//                   onDeleteConfirmed={deleteMessage}
//                   onMessageEdit={onMessageEdit}
//                   setEmojiPlaceholder={setEmojiPlaceholder}
//                   emojiBar={emojiBar}
//                 />
//               )}
//             </div>
//           )}
//           <div
//             className={clsx(
//               `gradient-chat-box relative flex h-auto w-fit items-end justify-between gap-2 rounded-[10px] bg-background-shade-3 bg-gradient-pattern-current px-4 py-[10px] fmd:max-w-[50%]`,
//               emojiBarMobile && "bg-[#262323b8] opacity-[0.8]"
//             )}
//             onTouchStart={handleTouchStart}
//             onTouchEnd={handleTouchEnd}
//           >
//             {emoji.length > 0 && (
//               <div
//                 className="absolute bottom-[5px] right-[35px] z-30 flex translate-x-[50%] translate-y-[100%] items-center justify-center rounded-full bg-black-shade-3 p-1"
//                 onMouseLeave={handleMouseLeaveEmojiList}
//               >
//                 <div
//                   className="flex items-center justify-center gap-2 rounded-full bg-elevation-3 p-[6px]"
//                   onClick={handleMouseClickEmojiList}
//                 >
//                   {emoji.slice(0, 2).map((emoji, index) => {
//                     return (
//                       <Image
//                         key={index}
//                         src={emoji ? emojiMapper[emoji.code as Emojies] : ""}
//                         alt="reaction icon"
//                         width={13}
//                         height={13}
//                         sizes="13px"
//                         className={`h-[13px] w-[13px]`}
//                       />
//                     );
//                   })}
//                   {emoji.length > 2 && (
//                     <span className="text-[10px] text-gray-shade-14">+2</span>
//                   )}
//                 </div>
//                 <div ref={clickEmojiRef} className="hidden">
//                   {emojiSenderListBar && (
//                     <EmojiSenderList
//                       openModalReply={onReplayCalled}
//                       setEmojiPlaceholder={setEmojiPlaceholder}
//                       emojiSenderListBar={emojiSenderListBar}
//                       users={data.users}
//                       emojis={emoji}
//                     />
//                   )}
//                 </div>
//               </div>
//             )}
//             <div className="z-10 flex flex-col gap-3">
//               <div className="flex w-[98%] gap-3">
//                 <div className="w-[1px] bg-gradient-pattern-current"></div>
//                 <div className="flex flex-col gap-1">
//                   <h4 className="text-gradient text-xs">{replyDate?.sender}</h4>
//                   <p className="text-xs text-gray-shade-14">
//                     {replyDate?.content}
//                   </p>
//                 </div>
//               </div>

//               <div
//                 className={clsx(
//                   `word-break text-14px  z-10 leading-[17.07px] text-white`,
//                   emojiBarMobile && "bg-[#262323b8]",
//                   `${preventSelect && "prevent-select"}`
//                 )}
//                 dangerouslySetInnerHTML={{
//                   __html: urlify(data.message.content),
//                 }}
//               ></div>
//             </div>
//             <p className="z-10 flex gap-1 text-[10px] text-gray-shade-14">
//               <span className="min-w-max">{time}</span>
//               <span>
//                 <span>
//                   {data.message.isSent ? (
//                     data.message.isSeen ? (
//                       <Seen className="h-3 w-4" />
//                     ) : data.message.isFetched ? (
//                       <Delivered className="h-3 w-4" />
//                     ) : (
//                       <Sent className="h-3 w-4" />
//                     )
//                   ) : (
//                     <Pending className="h-3 w-4" />
//                   )}
//                 </span>
//               </span>
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//           // onTouchStart={handleTouchStart}
//           //onTouchMove={(e) => handleTouchLeave(e)}
//           // onTouchCancel={handleTouchCancel}
//           className={clsx(` relative flex gap-2`, emoji?.length > 0 && "mb-5")}
//         >
//           {emoji?.length > 0 && (
//             <div
//               className="absolute bottom-[5px] right-[38px] z-30 flex translate-x-[50%] translate-y-[100%] items-center justify-center rounded-full bg-black-shade-3 p-1"
//               onMouseLeave={handleMouseLeaveEmojiList}
//             >
//               <div
//                 className="flex items-center justify-center gap-2 rounded-full bg-elevation-3 p-[6px]"
//                 onClick={handleMouseClickEmojiList}
//               >
//                 {emoji.slice(0, 2).map((emoji, index) => {
//                   return (
//                     <Image
//                       key={index}
//                       src={emoji ? emojiMapper[emoji.code as Emojies] : ""}
//                       alt="reaction icon"
//                       width={13}
//                       height={13}
//                       sizes="13px"
//                       className={`h-[13px] w-[13px]`}
//                     />
//                   );
//                 })}
//                 {emoji.length > 2 && (
//                   <span className="text-[10px] text-gray-shade-14">+2</span>
//                 )}
//               </div>
//               <div ref={clickEmojiRef} className="hidden">
//                 {emojiSenderListBar && (
//                   <EmojiSenderList
//                     openModalReply={onReplayCalled}
//                     setEmojiPlaceholder={setEmojiPlaceholder}
//                     emojiSenderListBar={emojiSenderListBar}
//                     users={data.users}
//                     emojis={emoji}
//                   />
//                 )}
//               </div>
//             </div>
//           )}

//           <div
//             className={clsx(
//               `flex w-full items-center justify-end gap-2`,
//               emojiBarMobile && "bg-[#262323b8] p-1"
//             )}
//           >
//             {belowMobile ? (
//               <div ref={hoverRef} className={`hidden`}>
//                 {emojiBarMobile && (
//                   <CurrentUserHoveredListMobile
//                     openModalReply={onReplayCalled}
//                     onDeleteConfirmed={deleteMessage}
//                     onMessageEdit={onMessageEdit}
//                     setEmojiPlaceholder={setEmojiPlaceholderMobile}
//                     emojiBarMobile={emojiBarMobile}
//                     handleSetData={handleSetData}
//                   />
//                 )}
//               </div>
//             ) : (
//               <div ref={hoverRef} className="hidden">
//                 {emojiBar && (
//                   <CurrentUserHoveredList
//                     openModalReply={onReplayCalled}
//                     onDeleteConfirmed={deleteMessage}
//                     onMessageEdit={onMessageEdit}
//                     setEmojiPlaceholder={setEmojiPlaceholder}
//                     emojiBar={emojiBar}
//                   />
//                 )}
//               </div>
//             )}
//             <div
//               className={clsx(
//                 `gradient-chat-box relative flex h-auto items-end gap-2 rounded-[10px] bg-gradient-pattern-current px-4 py-[10px] fmd:max-w-[50%]`,
//                 emojiBarMobile && "bg-[#262323b8] opacity-[0.8]"
//               )}
//               onTouchStart={handleTouchStart}
//               onTouchEnd={handleTouchEnd}
//               onMouseLeave={handleMouseLeaveMobile}
//             >
//               {/* <p
//                 className={clsx(
//                   `word-break text-14px z-10 max-w-[calc(90%-10px)] justify-between gap-2 whitespace-pre-wrap break-words leading-[17.07px] text-white`,
//                   emojiBarMobile && "bg-[#262323b8]",
//                   `${preventSelect && "prevent-select"}`
//                 )}
//               >
//                 {urlify(data.message.content)}
//               </p> */}
//               <div
//                 className={clsx(
//                   `word-break text-14px z-10 max-w-[calc(90%-10px)] justify-between gap-2 whitespace-pre-wrap break-words leading-[17.07px] text-white`,
//                   emojiBarMobile && "bg-[#262323b8]",
//                   preventSelect && "prevent-select"
//                 )}
//                 dangerouslySetInnerHTML={{
//                   __html: urlify(data.message.content),
//                 }}
//               ></div>
//               <p className="z-10 flex gap-1 text-[10px] text-gray-shade-14">
//                 <span className="min-w-max">{time}</span>{" "}
//                 <span>
//                   {data.message.isSent ? (
//                     data.message.isSeen ? (
//                       <Seen className="h-3 w-4" />
//                     ) : data.message.isFetched ? (
//                       <Delivered className="h-3 w-4" />
//                     ) : (
//                       <Sent className="h-3 w-4" />
//                     )
//                   ) : (
//                     <Pending className="h-3 w-4" />
//                   )}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CurrentUserSide;

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import clsx from "clsx";
import { eqAddress } from "@/live/utils/address.utils";
import { getMessageTime } from "@/live/utils/time.utils";
import { emojiMapper } from "@/live/utils/emoji.mapper";
import useUser from "@/hooks/use.user";
import { urlify } from "@/live/utils/tools";
import { Emojies } from "@/live/enums/emojis.enum";
import { Delivered, Pending, Seen, Sent } from "@/assets/svgs";
import { UsersDetails } from "../[chat_id].page";
import CurrentUserHoveredList from "./current-user-hovered-list";
import CurrentUserHoveredListMobile from "./current-user-hovered-list-mobile";
import EmojiSenderList from "./emoji-sender-list";

const CurrentUserSide: React.FC<{
  openModalReply: (msg: any) => void;
  onDeleteMessage: (msg: any) => void;
  onEditMessage: (msg: any) => void;
  onEmojiReaction: (msg: any, code: string) => void;
  data: { message: any; users: UsersDetails[] | null };
  setShowBlur: (value: string) => void;
}> = ({
  data,
  openModalReply,
  onDeleteMessage,
  onEditMessage,
  onEmojiReaction,
  setShowBlur,
}) => {
  const [time, setTime] = useState<string>("");
  const { user } = useUser();
  const [emoji, setEmoji] = useState<{ code: string; sender: string }[]>([]);
  const [emojiBar, setEmojiBar] = useState<boolean>(true);
  const [emojiBarMobile, setEmojiBarMobile] = useState<boolean>(false);
  const [emojiSenderListBar, setEmojiSenderListBar] = useState<boolean>(true);
  const [isReply, setIsReply] = useState<boolean>(false);
  const [replyDate, setReplyData] = useState<any>(null);
  const belowMobile = useMediaQuery("(max-width: 560px)");
  const [showNonBlur, setNonShowBlur] = useState<string>();
  const [showBackground, setShowBackground] = useState<boolean>();
  const [t, sett] = useState("");

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
      if (eqAddress(sender?._id, user?._id)) {
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
  }, [data, user?._id]);

  const handleMouseEnter = () => {
    if (hoverRef.current) {
      hoverRef.current.style.display = "block";
      setEmojiBar(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverRef.current) {
      hoverRef.current.style.display = "none";
      setEmojiBar((prevEmojiBar) => false);
      sett("emojibar");
      setEmojiBarMobile((prevEmojiBarMobile) => false);
      setShowBackground((prevBackground) => false);
      setShowBlur("");
      setNonShowBlur((prevShowNonBlur) => "");
      sett("last");
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

  const deleteMessage = () => {
    onDeleteMessage(data);
  };

  const onMessageEdit = () => {
    onEditMessage(data);
  };

  const setEmojiPlaceholder = (emoji: Emojies) => {
    onEmojiReaction(data.message, emoji);
  };

  const setEmojiPlaceholderMobile = (emoji: Emojies) => {
    onEmojiReaction(data.message, emoji);
  };

  // let dummyEmojiData = [emoji, emoji, emoji, emoji, emoji, emoji];

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

  const handleMouseLeaveMobile = () => {
    if (hoverRef.current && belowMobile) {
      hoverRef.current.style.display = "none";
      setEmojiBarMobile(false);
    }
  };

  const handleSetData = () => {
    setEmojiBarMobile(false);
    setShowBackground(false);
    setShowBlur("");
    setNonShowBlur("");
  };

  const openPopup = () => {
    // Implement your logic to open the pop-up here
    if (hoverRef.current) {
      hoverRef.current.style.display = "block";
      setShowBlur("blur-local");
      setShowBackground(true);
      setNonShowBlur("not-blur");
      setEmojiBarMobile(true);
    }
  };

  console.log("emoji bar", emojiBar);

  return (
    <>
      {isReply ? (
        <div
          className={clsx(
            `child relative flex w-full items-center justify-end gap-2 ${showNonBlur}`,
            `${emoji?.length > 0 && "mb-5"}`
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {belowMobile ? (
            <div ref={hoverRef} className="hidden">
              {emojiBarMobile && (
                <CurrentUserHoveredListMobile
                  openModalReply={onReplayCalled}
                  onDeleteConfirmed={deleteMessage}
                  onMessageEdit={onMessageEdit}
                  setEmojiPlaceholder={setEmojiPlaceholderMobile}
                  emojiBarMobile={emojiBarMobile}
                  handleSetData={handleSetData}
                />
              )}
            </div>
          ) : (
            <div ref={hoverRef} className="hidden">
              {emojiBar && (
                <CurrentUserHoveredList
                  openModalReply={onReplayCalled}
                  onDeleteConfirmed={deleteMessage}
                  onMessageEdit={onMessageEdit}
                  setEmojiPlaceholder={setEmojiPlaceholder}
                  emojiBar={emojiBar}
                />
              )}
            </div>
          )}
          <div
            className="gradient-chat-box relative flex h-auto w-fit items-end justify-between gap-2 rounded-[10px] bg-background-shade-3 bg-gradient-pattern-current px-4 py-[10px] fmd:max-w-[50%]
        "
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {emoji.length > 0 && (
              <div
                className="absolute bottom-[5px] right-[38px] z-30 flex translate-x-[50%] translate-y-[100%] items-center justify-center rounded-full bg-black-shade-3 p-1"
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
                <div ref={clickEmojiRef} className="hidden">
                  {emojiSenderListBar && (
                    <EmojiSenderList
                      openModalReply={onReplayCalled}
                      setEmojiPlaceholder={setEmojiPlaceholder}
                      emojiSenderListBar={emojiSenderListBar}
                      users={data.users}
                      emojis={emoji}
                    />
                  )}
                </div>
              </div>
            )}
            <div className="z-10 flex flex-col gap-3">
              <div className="flex w-[98%] gap-3">
                <div className="w-[1px] bg-gradient-pattern-current"></div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-gradient text-xs">{replyDate?.sender}</h4>
                  <p className="text-xs text-gray-shade-14">
                    {replyDate?.content}
                  </p>
                </div>
              </div>

              <div
                className={clsx(
                  `word-break text-14px  z-10 leading-[17.07px] text-white`
                )}
                dangerouslySetInnerHTML={{
                  __html: urlify(data.message.content),
                }}
              ></div>
            </div>
            <p className="z-10 flex gap-1 text-[10px] text-gray-shade-14">
              <span className="min-w-max">{time}</span>
              <span>
                <span>
                  {data.message.isSent ? (
                    data.message.isSeen ? (
                      <Seen className="h-3 w-4" />
                    ) : data.message.isFetched ? (
                      <Delivered className="h-3 w-4" />
                    ) : (
                      <Sent className="h-3 w-4" />
                    )
                  ) : (
                    <Pending className="h-3 w-4" />
                  )}
                </span>
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // onTouchStart={handleTouchStart}
          // onTouchEnd={handleTouchEnd}
          // onTouchCancel={handleTouchCancel}
          className={clsx(
            `child ${showNonBlur} relative flex gap-2`,
            `${emoji?.length > 0 && "mb-5"}`,
            showBackground && "bg-black/50 p-2"
          )}
        >
          {emoji?.length > 0 && (
            <div
              className="absolute bottom-[5px] right-[38px] z-30 flex translate-x-[50%] translate-y-[100%] items-center justify-center rounded-full bg-black-shade-3 p-1"
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
              <div ref={clickEmojiRef} className="hidden">
                {emojiSenderListBar && (
                  <EmojiSenderList
                    openModalReply={onReplayCalled}
                    setEmojiPlaceholder={setEmojiPlaceholder}
                    emojiSenderListBar={emojiSenderListBar}
                    users={data.users}
                    emojis={emoji}
                  />
                )}
              </div>
            </div>
          )}
          <p className="text-white">emojibar-- {emojiBar.toString()}</p>
          <p className="text-white">
            emojibarmobile--{emojiBarMobile.toString()}
          </p>
          <p className="text-white">{t}</p>
          <div className={`flex w-full items-center justify-end gap-2`}>
            {belowMobile ? (
              <div ref={hoverRef} className={`hidden `}>
                {emojiBarMobile && (
                  <CurrentUserHoveredListMobile
                    openModalReply={onReplayCalled}
                    onDeleteConfirmed={deleteMessage}
                    onMessageEdit={onMessageEdit}
                    setEmojiPlaceholder={setEmojiPlaceholderMobile}
                    emojiBarMobile={emojiBarMobile}
                    handleSetData={handleSetData}
                  />
                )}
              </div>
            ) : (
              <div ref={hoverRef} className="hidden">
                {emojiBar && (
                  <CurrentUserHoveredList
                    openModalReply={onReplayCalled}
                    onDeleteConfirmed={deleteMessage}
                    onMessageEdit={onMessageEdit}
                    setEmojiPlaceholder={setEmojiPlaceholder}
                    emojiBar={emojiBar}
                  />
                )}
              </div>
            )}
            <div
              className={`gradient-chat-box relative flex h-auto items-end gap-2 rounded-[10px] bg-gradient-pattern-current px-4 py-[10px] fmd:max-w-[50%]`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              //onMouseLeave={handleMouseLeaveMobile}
            >
              {/* <p
                className={clsx(
                  `word-break text-14px z-10 max-w-[calc(90%-10px)] justify-between gap-2 whitespace-pre-wrap break-words leading-[17.07px] text-white`
                )}
              >
                {urlify(data.message.content)}
              </p> */}
              <div
                className={clsx(
                  `word-break text-14px z-10 max-w-[calc(90%-10px)] justify-between gap-2 whitespace-pre-wrap break-words leading-[17.07px] text-white`
                )}
                dangerouslySetInnerHTML={{
                  __html: urlify(data.message.content),
                }}
              ></div>
              <p className="z-10 flex gap-1 text-[10px] text-gray-shade-14">
                <span className="min-w-max">{time}</span>
                <span>
                  {data.message.isSent ? (
                    data.message.isSeen ? (
                      <Seen className="h-3 w-4" />
                    ) : data.message.isFetched ? (
                      <Delivered className="h-3 w-4" />
                    ) : (
                      <Sent className="h-3 w-4" />
                    )
                  ) : (
                    <Pending className="h-3 w-4" />
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CurrentUserSide;
