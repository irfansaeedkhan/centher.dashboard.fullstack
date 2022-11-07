import React, { useState } from "react";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import moment from "moment";
import clsx from "clsx";
import toast from "react-hot-toast";

import { CompletedPost } from "@/models/post";
import { ArchiveIcon, DotsIcon, EditIcon, TrashIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";

import { useCurrentPageRoute } from "./use.current.page.route";
import { archivePost } from "./post.helpers";

interface Post3DotsMenuProps {
  post: CompletedPost;
  onClickDelete?: () => void;
  onArchive?: (postId: string) => void;
  onClickEdit?: () => void;
}

const Post3DotsMenu: React.FC<Post3DotsMenuProps> = ({
  post,
  onClickDelete = () => {},
  onArchive = () => {},
  onClickEdit = () => {},
}) => {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const currentPageRoute = useCurrentPageRoute();

  const menuRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setIsMenuVisible(false));

  // toggle function to show/hide edit/delete popup
  const toggleMenu = async () => {
    setIsMenuVisible((prev) => !prev);
  };

  const handleArchivePost = async (postId: string) => {
    try {
      await archivePost(postId);

      if (currentPageRoute.isSinglePostPage) {
        router.replace(AppRoutes.feed.index);
        return;
      }

      onArchive(postId);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message_description || "Something went wrong"
      );
    }
  };

  // Timer to check 15 min difference
  const timeNow = moment();
  const timeAfter15Minutes = moment(post.createdAt).add(15, "minutes");

  return (
    <div ref={menuRef} className={`relative w-6 h-6`}>
      <button onClick={toggleMenu}>
        <DotsIcon />
      </button>

      <div
        className={clsx(
          `absolute right-0 top-6 rounded-10px bg-black-shade-12 shadow-sm overflow-hidden w-[170px]`,
          isMenuVisible ? "block z-40" : "hidden"
        )}
      >
        {timeNow >= timeAfter15Minutes ? (
          <button
            className={menuButton}
            onClick={() => {
              handleArchivePost(post._id);
            }}
          >
            <ArchiveIcon className={icon} /> Archive
          </button>
        ) : (
          <>
            <button className={menuButton} onClick={onClickEdit}>
              <EditIcon className={icon} /> Edit
            </button>
            <button
              className={menuButton}
              onClick={() => {
                handleArchivePost(post._id);
              }}
            >
              <ArchiveIcon className={icon} /> Archive
            </button>

            <button
              className={menuButton}
              onClick={() => {
                toggleMenu();
                onClickDelete();
              }}
            >
              <TrashIcon className={icon} /> Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Post3DotsMenu;

const menuButton = `w-full text-14px font-semibold text-white  flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]`;

const icon = `w-[18px] h-[18px]`;
