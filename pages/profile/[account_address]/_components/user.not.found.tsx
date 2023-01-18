import React from "react";
import Image from "next/image";
import Link from "next/link";

import { AppRoutes } from "@/constants/app.routes";

export const UserNotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-60px-64px)] h-auto flex items-center">
      <div className="flex flex-col-reverse md:flex-col  w-full justify-center items-center">
        <div className="w-full flex flex-col gap-3 items-center justify-center">
          <div className="text-white font-semibold md:!text-[34px] sm:!text-[30px]">
            User not found
          </div>
          <div className="md:max-w-[412px] sm:max-w-[300px] md:text-base sm:text-sm text-center text-gray-shade-7">
            Seems like the account address you searched for does not exist,
            Please try again.
          </div>
          <Link
            href={AppRoutes.feed.index}
            className="bg-brand-primary hover:bg-brand-primary-dark py-2 text-center w-[197px] rounded-lg text-black-shade-3 text-sm font-bold my-7"
          >
            Back to home
          </Link>
        </div>
        <Image
          src={"/images/404.png"}
          alt="404"
          width={967}
          height={340}
          className="!max-w-[967px] !max-h-[340px] md:!h-[340px] md:!w-[767px] !w-[80%] mb-10"
        />
      </div>
    </div>
  );
};
