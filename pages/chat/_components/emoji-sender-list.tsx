import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { emojiMapper } from "@/live/utils/emoji.mapper";
import { eqAddress } from "@/live/utils/address.utils";
import { Emojies } from "@/live/enums/emojis.enum";
import { UsersDetails } from "./single-chat-sidebar";

interface ClientHoveredListProps {
  openModalReply: (value: string) => void;
  setEmojiPlaceholder: (value: Emojies) => void;
  emojiSenderListBar: boolean;
  clientSide?: boolean;
  emojis: { code: string; sender: string }[];
  users: UsersDetails[] | null;
}
const EmojiSenderList: React.FC<ClientHoveredListProps> = ({
  setEmojiPlaceholder,
  clientSide = false,
  emojis,
  users,
}) => {
  const getUser = (address: string): UsersDetails => {
    let user = null;
    if (users) {
      user = users.find((e) => eqAddress(address, e._id));
    }

    if (user) {
      return user;
    } else
      return {
        _id: address,
        display_name: address,
        profile_image: "/images/chat-profile.png",
      };
  };

  return (
    <>
      {emojis && emojis.length && (
        <div>
          {true && (
            <div
              className={clsx(
                `text-14px absolute  top-[46px] z-[500] flex w-full min-w-max max-w-[220px] flex-col items-center justify-between gap-5 rounded-10px bg-black-shade-12 p-3 ${
                  clientSide ? "left-0" : "right-0"
                }`
              )}
            >
              <span
                className={clsx(
                  `absolute top-[6px]  h-5 w-5 origin-center translate-y-[-100%] scale-x-[3] text-black-shade-12 ${
                    clientSide ? "left-[27px]" : "right-[35px]"
                  }`
                )}
              >
                &#9650;
              </span>
              {emojis.map((e, i) => (
                <div
                  className="flex w-full items-center justify-between gap-5"
                  key={i}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={getUser(e.sender).profile_image}
                      alt="profile image"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <h4 className="text-10px word-break max-w-[140px] truncate break-words text-white">
                      {getUser(e.sender).display_name}
                    </h4>
                  </div>
                  <Image
                    src={emojiMapper[e.code as Emojies]}
                    alt={e.code}
                    width={20}
                    height={20}
                    sizes="20px"
                    className={`h-5 w-5 cursor-pointer`}
                    onClick={() => {
                      setEmojiPlaceholder(e.code as Emojies);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EmojiSenderList;
