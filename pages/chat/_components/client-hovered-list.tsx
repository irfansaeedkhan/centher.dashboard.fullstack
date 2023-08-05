import React, { useState } from "react";
import Image from "next/image";
import { useOnClickOutside } from "usehooks-ts";
import { BsThreeDots, BsEmojiSmile } from "react-icons/bs";
import { HiOutlineReply } from "react-icons/hi";
import { emojiMapper } from "@/live/utils/emoji.mapper";
import { Emojies } from "@/live/enums/emojis.enum";
import { ChatModal } from "./chat-modal";

interface ClientHoveredListProps {
  openModalReply: (value: string) => void;
  setEmojiPlaceholder: (value: Emojies) => void;
  emojiBar: boolean;
}

const ClientHoveredList: React.FC<ClientHoveredListProps> = ({
  openModalReply,
  setEmojiPlaceholder,
  emojiBar,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const menuRef = React.useRef<HTMLDivElement>(null);
  const emojiRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));
  useOnClickOutside(emojiRef, () => setIsEmojiOpen(false));

  const onClickDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleMouseLeave = () => {
    if (emojiRef.current) {
      setIsEmojiOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative" ref={emojiRef}>
          <BsEmojiSmile
            className="h-5 w-5 cursor-pointer fill-gray-shade-18 hover:fill-white"
            onClick={() => setIsEmojiOpen((prev) => !prev)}
          />
          {isEmojiOpen && emojiBar && (
            <div
              className="text-14px absolute left-[50%]  right-0 top-[-20px] z-[500] flex w-[225px] translate-x-[-50%] translate-y-[-100%] items-center justify-between gap-4 rounded-10px bg-black-shade-12 p-2 px-5"
              onMouseLeave={handleMouseLeave}
            >
              <span className="translate-[-50%] absolute bottom-[-10%] left-[50%] h-5 w-5 translate-y-[50%] scale-x-[3] text-black-shade-12">
                &#9660;
              </span>
              <Image
                src={emojiMapper[Emojies.heart]}
                alt="heart"
                width={20}
                height={20}
                sizes="20px"
                className={`h-5 w-5 cursor-pointer`}
                onClick={() => {
                  setEmojiPlaceholder(Emojies.heart);
                  setIsEmojiOpen((prev) => !prev);
                }}
              />
              <Image
                src={emojiMapper[Emojies.laughing]}
                alt="heart"
                width={20}
                height={20}
                sizes="20px"
                className={`h-5 w-5 cursor-pointer`}
                onClick={() => {
                  setEmojiPlaceholder(Emojies.laughing);
                  setIsEmojiOpen((prev) => !prev);
                }}
              />
              <Image
                src={emojiMapper[Emojies.lovely]}
                alt="heart"
                width={20}
                height={20}
                sizes="20px"
                className={`h-5 w-5 cursor-pointer`}
                onClick={() => {
                  setEmojiPlaceholder(Emojies.lovely);
                  setIsEmojiOpen((prev) => !prev);
                }}
              />
              <Image
                src={emojiMapper[Emojies.fire]}
                alt="heart"
                width={20}
                height={20}
                sizes="20px"
                className={`h-5 w-5 cursor-pointer`}
                onClick={() => {
                  setEmojiPlaceholder(Emojies.fire);
                  setIsEmojiOpen((prev) => !prev);
                }}
              />
              <Image
                src={emojiMapper[Emojies.crying]}
                alt="heart"
                width={20}
                height={20}
                sizes="20px"
                className={`h-5 w-5 cursor-pointer`}
                onClick={() => {
                  setEmojiPlaceholder(Emojies.crying);
                  setIsEmojiOpen((prev) => !prev);
                }}
              />
            </div>
          )}
        </div>
        <div className="relative" ref={menuRef}>
          <BsThreeDots
            className="h-6 w-6 cursor-pointer fill-gray-shade-18 hover:fill-white"
            onClick={() => setIsOpen((prev) => !prev)}
          />
          {isOpen && (
            <div className="text-14px absolute right-0 top-[40px] z-[500] rounded-10px bg-black-shade-12">
              <span
                className={`absolute right-[-10px] top-[-3px] h-3 w-7 origin-center translate-y-[-100%] scale-x-[3] text-black-shade-12
                          `}
              >
                &#9650;
              </span>
              <button
                onClick={() => openModalReply("current message hardcode")}
                className="flex w-full items-center justify-start gap-3 px-7 py-4 text-white hover:bg-[#202025]"
              >
                <HiOutlineReply className="h-[18px] w-[18px] " />
                <span className="min-w-max">Reply</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ChatModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onAction={onClickDelete}
        content="Do you want to delete this message? This process cannot be
        undone."
        title="Delete message"
      />
    </>
  );
};

export default ClientHoveredList;
