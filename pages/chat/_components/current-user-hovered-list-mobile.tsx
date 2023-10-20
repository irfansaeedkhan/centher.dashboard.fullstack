import React, { useState } from "react";
import Image from "next/image";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiOutlineReply } from "react-icons/hi";
import { emojiMapper } from "@/live/utils/emoji.mapper";
import { Emojies } from "@/live/enums/emojis.enum";
import { ChatModal } from "./chat-modal";

interface CurrentUserHoveredListProps {
  openModalReply: () => void;
  onDeleteConfirmed: () => void;
  onMessageEdit: () => void;
  setEmojiPlaceholder: (value: Emojies) => void;
  handleSetData: () => void;
  emojiBarMobile: boolean;
}

const CurrentUserHoveredListMobile: React.FC<CurrentUserHoveredListProps> = ({
  openModalReply,
  onDeleteConfirmed,
  onMessageEdit,
  setEmojiPlaceholder,
  emojiBarMobile,
  handleSetData,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const emojiRef = React.useRef<HTMLDivElement>(null);

  const onClickDelete = () => {
    onDeleteConfirmed();
    setIsDeleteModalOpen(false);
  };

  const handleMouseLeave = () => {
    if (emojiRef.current) {
      handleSetData();
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="" ref={emojiRef}>
          {emojiBarMobile && (
            <div
              className="absolute right-0 top-[-48px]  z-[500] flex w-[225px] items-center justify-between gap-4 rounded-10px bg-black-shade-12 p-2 px-5 text-sm"
              onMouseLeave={handleMouseLeave}
            >
              <span className="translate-[-50%] absolute bottom-[-10%] left-[50%] h-5 w-5 translate-y-[50%] scale-x-[3] text-black-shade-12">
                &#9660;
              </span>
              <span
                onClick={() => {
                  setEmojiPlaceholder(Emojies.heart);
                  handleSetData();
                }}
              >
                <Image
                  src={emojiMapper[Emojies.heart]}
                  alt="heart"
                  width={20}
                  height={20}
                  sizes="20px"
                  className={`h-5 w-5 cursor-pointer`}
                />
              </span>
              <span
                onClick={() => {
                  setEmojiPlaceholder(Emojies.laughing);
                  handleSetData();
                }}
              >
                <Image
                  src={emojiMapper[Emojies.laughing]}
                  alt="heart"
                  width={20}
                  height={20}
                  sizes="20px"
                  className={`h-5 w-5 cursor-pointer`}
                />
              </span>
              <span
                onClick={() => {
                  setEmojiPlaceholder(Emojies.lovely);
                  handleSetData();
                }}
              >
                <Image
                  src={emojiMapper[Emojies.lovely]}
                  alt="heart"
                  width={20}
                  height={20}
                  sizes="20px"
                  className={`h-5 w-5 cursor-pointer`}
                />
              </span>
              <span
                onClick={() => {
                  setEmojiPlaceholder(Emojies.fire);
                  handleSetData();
                }}
              >
                <Image
                  src={emojiMapper[Emojies.fire]}
                  alt="heart"
                  width={20}
                  height={20}
                  sizes="20px"
                  className={`h-5 w-5 cursor-pointer`}
                />
              </span>
              <span
                onClick={() => {
                  setEmojiPlaceholder(Emojies.crying);
                  handleSetData();
                }}
              >
                <Image
                  src={emojiMapper[Emojies.crying]}
                  alt="heart"
                  width={20}
                  height={20}
                  sizes="20px"
                  className={`h-5 w-5 cursor-pointer`}
                />
              </span>
            </div>
          )}
        </div>
        <div>
          {emojiBarMobile && (
            <div className="absolute bottom-[-20px] right-0 z-[500] translate-y-[100%] rounded-10px bg-black-shade-12 text-sm">
              <span
                className={`absolute left-[50%] top-[-3px] h-3 w-7 origin-center translate-y-[-100%] scale-x-[3] text-black-shade-12
                          `}
              >
                &#9650;
              </span>
              <button
                onClick={() => openModalReply()}
                className="flex w-full items-center justify-start gap-3 px-7 py-4 text-white hover:bg-[#202025]"
              >
                <HiOutlineReply className="h-[18px] w-[18px] " />
                <span className="min-w-max">Reply</span>
              </button>
              <button
                onClick={() => onMessageEdit()}
                className="flex w-full items-center justify-start gap-3 px-7 py-4 text-white hover:bg-[#202025]"
              >
                <FiEdit className="h-[18px] w-[18px] text-white" />
                <span className="min-w-max">Edit message</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex w-full items-center justify-start gap-3 px-7 py-4 text-red-theme hover:bg-[#202025]"
              >
                <FiTrash2 className="h-[18px] w-[18px] stroke-red-theme" />
                <span className="min-w-max">Delete message</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ChatModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onAction={onClickDelete}
        content="Do you want to delete this message? This process cannot be undone."
        title="Delete message"
      />
    </>
  );
};

export default CurrentUserHoveredListMobile;
