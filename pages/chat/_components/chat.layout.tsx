import React from "react";
import { ChatPagesWrapper } from "@/components/all.pages.wrapper/chat.pages.wrapper";
import { usePresenceHeartbeat } from "@/hooks/chat/useChat";
import ChatSidebar from "./chat.sidebar";

type ChatLayoutProps = {
  children: React.ReactNode;
};

/**
 * Shared layout for all chat pages — keeps the conversation sidebar
 * visible whether you're on the chat list or inside a thread.
 */
export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  // Q24 presence: heartbeat for as long as any chat page is open.
  usePresenceHeartbeat();
  // Portfolio-library fix (2026-10-29): the old 1s fake preloader kept the
  // thread unmounted after navigation, so the first open showed a blank
  // right pane and only started fetching once the timer fired (a second
  // navigation reused the mounted layout and looked instant). Render the
  // sidebar + thread immediately so the thread fetch starts on first open;
  // each pane shows its own loading state instead of a global gate.
  return (
    <ChatPagesWrapper pageTitle="Chat">
      <div className="flex">
        <ChatSidebar />
        {children}
      </div>
    </ChatPagesWrapper>
  );
};
