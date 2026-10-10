import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { IconMessage } from "@/assets/svgs";
import { ChatLayout } from "./_components/chat.layout";

const Chat: NextPageWithLayout = () => {
  return (
    <div className="hidden h-auto flex-grow flex-col items-center justify-center gap-6 flg:flex">
      <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-elevation-2">
        <IconMessage />
      </div>
      <h3 className="text-xl font-semibold leading-[24.38px] text-white sm:text-2xl sm:leading-9">
        No Chat selected
      </h3>
    </div>
  );
};

Chat.getLayout = (page) => <ChatLayout>{page}</ChatLayout>;

export default Chat;
