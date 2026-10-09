import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusIconBtn } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import Button from "../button";

export interface AdminHeaderProps {
  title: string;
  url?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = (props) => {
  return (
    <div>
      <div
        className={`flex h-[60px] w-full items-center border-b-[1.5px] border-gray-shade-border-color bg-background-shade-1 px-5`}
      >
        <div className={`w-72`}>
          <Link
            href={AppRoutes.home}
            className="flex items-center gap-4 sm:min-w-[22px] md:min-w-[166px]"
          >
            <Image
              src="/images/centher.logo.png"
              alt="Centher Logo"
              width={160}
              height={64}
              className="h-auto w-40"
              priority
            />
          </Link>
        </div>
        <div
          className={`flex w-[calc(100%-288px)] items-center justify-between`}
        >
          <div className={`flex items-center gap-6`}>
            <div>
              <p className={`font-semibold text-white`}>{props.title}</p>
            </div>
          </div>

          {props.url && (
            <Link
              href={props.url}
              className={`group flex cursor-pointer items-center`}
            >
              <Button
                title={"Create New"}
                variant="primary"
                className="px-3 py-2 text-sm font-semibold"
                Icon={
                  <PlusIconBtn
                    className={`stroke-black group-hover:stroke-brand-primary`}
                  />
                }
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminHeader;
