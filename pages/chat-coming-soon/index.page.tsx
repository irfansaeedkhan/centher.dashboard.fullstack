import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import FinalButton from "@/components/button/final.button";

const ChatComingSoon: NextPageWithLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-60px-64px)] w-full items-center ">
      <div className="justify-cente relative flex h-full w-full items-center justify-center bg-[url('/images/comingsoon.png')] bg-top bg-no-repeat">
        <div className="flex flex-col items-center justify-center gap-4 pt-[13rem] fsm:mt-0 fsm:gap-7">
          <div>
            <Image
              src="/images/chat-bot.png"
              alt="chat"
              width={300}
              height={300}
              className="absolute inset-0 top-0 mx-auto"
            />
          </div>
          <div className="text-center text-[22px] font-medium text-white fsm:tracking-[1rem] sm:text-[30px] md:text-[34px] md:tracking-[1.4rem]">
            CHAT COMING SOON
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            Within a week Centhers users will be able to exchange chat messages,
            edit them, remove them, reply to specific messages ad chat with
            anyone in their network.
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            The chat service will bring premium features to{" "}
            <Link
              className="text-brand-primary hover:text-brand-primary-dark"
              href={AppRoutes.citizenship_coming_soon}
            >
              Centher Citizens
            </Link>
            , like advertisement via private message, bulk sending and much
            more.
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            Right now we are working to make mobile experience as fluid as other
            native apps are. Stay tuned for more updates and come back next week
            to check out the feature!
          </div>
          <Link href={AppRoutes.feed.index}>
            <FinalButton
              title="Back to feed"
              variant="primary"
              className="h-10 w-[150px] text-[14px]"
              borderRounded="14px"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

ChatComingSoon.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Chat Coming Soon">{page}</AllPagesWrapper>;
};

export default ChatComingSoon;
