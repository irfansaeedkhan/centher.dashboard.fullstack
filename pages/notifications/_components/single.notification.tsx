// React, Next, NPM Packages
import React from "react";
import Link from "next/link";
import Image from "next/future/image";
import moment from "moment";

// App imports
import type { Notification } from "@/store/notifications.store";

export const SingleNotification: React.FC<Notification> = (props) => {
  return (
    <div
      className={
        `w-full max-w-[1005px] h-[104px] p-6 flex justify-between rounded-xl ` +
        (props.status === "unread"
          ? "bg-background-shade-2"
          : "bg-background-shade-3")
      }
    >
      <div className="flex items-center gap-2">
        <Link href={`/profile/${props.by.account_address}`}>
          <a className="dpImagePreview">
            <Image
              src={props.by?.profile_image?.path}
              alt="dp"
              width={56}
              height={56}
              className="rounded-full"
            />
          </a>
        </Link>
        <Link
          href={`/feed/${props.post.user.account_address}/post/${props.post._id}`}
        >
          <a className="text-sm text-white hover:text-brand-primary">
            {props.by.display_name}{" "}
            {props.type === "post_like"
              ? "liked "
              : props.type === "post_reply" && "replied to"}{" "}
            your post.
          </a>
        </Link>
      </div>
      <p className="text-sm text-gray-shade-2 ">
        {moment(props.createdAt).format("LT")}
      </p>
    </div>
  );
};
