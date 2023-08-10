import React from "react";

export const ChatMessageSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex w-full flex-col items-end">
        <div className="flex w-1/2 flex-col items-end gap-2">
          <div className="h-9 w-2/5 animate-pulse rounded-[10px] bg-background-shade-3"></div>
          <div className="h-9 w-3/5 animate-pulse rounded-[10px] bg-background-shade-3"></div>
          <div className="h-9 w-full animate-pulse rounded-[10px] bg-background-shade-3"></div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start">
        <div className="flex w-1/2 flex-col items-start gap-2">
          <div className="flex items-center gap-3">
            <div className="min-h-[28px] min-w-[28px] animate-pulse rounded-full bg-background-shade-3"></div>
            <div className="h-9 w-[90px] animate-pulse rounded-[10px] bg-background-shade-3"></div>
          </div>
          <div className="ml-[40px] h-9 w-[140px] animate-pulse rounded-[10px] bg-background-shade-3"></div>
        </div>
      </div>
      <div className="flex w-full flex-col items-end">
        <div className="flex w-1/2 flex-col items-end gap-2">
          <div className="h-9 w-2/5 animate-pulse rounded-[10px] bg-background-shade-3"></div>
          <div className="h-9 w-3/5 animate-pulse rounded-[10px] bg-background-shade-3"></div>
          <div className="h-9 w-full animate-pulse rounded-[10px] bg-background-shade-3"></div>
        </div>
      </div>
    </div>
  );
};

export const ChatFriendListSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex w-full items-center gap-3">
        <div className="min-h-[48px] min-w-[48px] animate-pulse rounded-full bg-background-shade-3"></div>
        <div className="flex w-full flex-col gap-2">
          <div className="h-3 w-[40%] animate-pulse rounded-[10px] bg-background-shade-3"></div>
          <div className="h-3 w-[100%] animate-pulse rounded-[10px] bg-background-shade-3"></div>
        </div>
      </div>
      <div className="flex w-full items-center gap-3">
        <div className="min-h-[48px] min-w-[48px] animate-pulse rounded-full bg-background-shade-3"></div>
        <div className="flex w-full flex-col gap-2">
          <div className="h-3 w-[40%] animate-pulse rounded-[10px] bg-background-shade-3"></div>
          <div className="h-3 w-[100%] animate-pulse rounded-[10px] bg-background-shade-3"></div>
        </div>
      </div>
      <div className="flex w-full items-center gap-3">
        <div className="min-h-[48px] min-w-[48px] animate-pulse rounded-full bg-background-shade-3"></div>
        <div className="flex w-full flex-col gap-2">
          <div className="h-3 w-[40%] animate-pulse rounded-[10px] bg-background-shade-3"></div>
          <div className="h-3 w-[100%] animate-pulse rounded-[10px] bg-background-shade-3"></div>
        </div>
      </div>
      <div className="flex w-full items-center gap-3">
        <div className="min-h-[48px] min-w-[48px] animate-pulse rounded-full bg-background-shade-3"></div>
        <div className="flex w-full flex-col gap-2">
          <div className="h-3 w-[40%] animate-pulse rounded-[10px] bg-background-shade-3"></div>
          <div className="h-3 w-[100%] animate-pulse rounded-[10px] bg-background-shade-3"></div>
        </div>
      </div>
    </div>
  );
};
export const ChatMainLoader = () => {
  return (
    <div className="flex min-h-[calc(100vh-60px-64px)] w-full items-center justify-center">
      <div className="flex min-h-screen items-center justify-center">
        <div className="chat-loader flex space-x-3 rounded-full bg-white p-5">
          <div className="h-5 w-5 animate-bounce rounded-full bg-gray-800"></div>
          <div className="h-5 w-5 animate-bounce rounded-full bg-gray-800"></div>
          <div className="h-5 w-5 animate-bounce rounded-full bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
};
