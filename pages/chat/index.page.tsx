import React from "react";
import Image from "next/image";
import { NextPageWithLayout } from "@/pages/_app.page";
import { ChatPagesWrapper } from "@/components/all.pages.wrapper/chat.pages.wrapper";
import { IconMessage } from "@/assets/svgs";
import ChatSidebar from "./_components/chat.sidebar";

type ChatPageProps = {
  children: React.ReactNode;
};

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

const ChatPage: React.FC<ChatPageProps> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  // Simulate loading delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ChatPagesWrapper pageTitle="Chat">
      {loading ? (
        <div className="flex h-[calc(100vh-60px)] w-full items-center justify-center">
          <Image
            src="/images/preloader.png"
            alt="Preloader"
            width={64}
            height={64}
            className="h-16 w-16 flex-shrink-0 object-cover"
          />
        </div>
      ) : (
        <div className="flex">
          <ChatSidebar />
          {children}
        </div>
      )}
    </ChatPagesWrapper>
  );
};

Chat.getLayout = (page) => <ChatPage>{page}</ChatPage>;

export default Chat;
