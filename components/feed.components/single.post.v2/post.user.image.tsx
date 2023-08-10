import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PostUser } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";

interface Props {
  postUser: PostUser;
}

export const PostUserImage: React.FC<Props> = ({ postUser }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Image with link to user profile */}
      <Link
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="h-12 w-12"
        href={{
          pathname: AppRoutes.profile.user_id,
          query: { user_id: postUser._id },
        }}
      >
        <Image
          src={postUser.profile_image}
          alt={postUser.display_name}
          width={48}
          height={48}
          sizes="48px"
          className="h-full w-full rounded-full object-cover"
        />
      </Link>
    </div>
  );
};
