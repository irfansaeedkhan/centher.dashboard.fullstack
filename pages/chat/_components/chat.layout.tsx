import React from "react";
import Image from "next/image";
import { ChatPagesWrapper } from "@/components/all.pages.wrapper/chat.pages.wrapper";
import ChatSidebar from "./chat.sidebar";

type ChatLayoutProps = {
  children: React.ReactNode;
};

/**
 * Shared layout for all chat pages — keeps the conversation sidebar
 * visible whether you're on the chat list or inside a thread.
 */
export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
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
