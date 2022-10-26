import React from "react";
import Link from "next/link";

import { Post } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

export const BackButton: React.FC<{ post?: Post }> = ({ post }) => {
  return post?.parent_post ? (
    <Link
      href={{
        pathname: AppRoutes.feed.single_post,
        query: {
          account_address: post.parent_post.user.account_address,
          post_id: post.parent_post._id,
        },
      }}
      className={backBtnClasses}
    >
      Back
    </Link>
  ) : (
    <Link
      href={{
        pathname: AppRoutes.feed.index,
      }}
      className={backBtnClasses}
    >
      Back
    </Link>
  );
};

const backBtnClasses = `text-brand-primary text-[11px] px-4 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium w-fit`;
