import React, { useState } from "react";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import moment from "moment";
import clsx from "clsx";

import { useFeedStore } from "@/store/feed.store";
import { useSinglePostStore } from "@/store/single.post.store";
import { useMyPostStore } from "@/store/my.post.store";
import { useMyRepliesStore } from "@/store/my.replies.store";
import { CompletedPost } from "@/models/post";
import { ArchiveIcon, DotsIcon, EditIcon, TrashIcon } from "@/assets/svgs";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";

import { useCurrentPageRoute } from "./use.current.page.route";
import { archivePost } from "./post.helpers";

interface Post3DotsMenuProps {
  post: CompletedPost;
  onClickDelete?: () => void;
  onClickEdit?: () => void;
}

const Post3DotsMenu: React.FC<Post3DotsMenuProps> = ({
  post,
  onClickDelete = () => {},
  onClickEdit = () => {},
}) => {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const currentPageRoute = useCurrentPageRoute();
  const { removePost: removePostFeed } = useFeedStore();
  const { removeReply: removeReplySinglePost } = useSinglePostStore();
  const { removePost: removePostMyPost } = useMyPostStore();
  const { removePost: removePostMyReplies } = useMyRepliesStore();

  const menuRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setIsMenuVisible(false));

  // toggle function to show/hide edit/delete popup
  const toggleMenu = async () => {
    setIsMenuVisible((prev) => !prev);
  };

  const handleArchivePost = async (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    const button = e.target as HTMLButtonElement;
    button.disabled = true;
    try {
      await archivePost(postId);

      removePostFeed(postId);
      removePostMyPost(postId);
      removePostMyReplies(postId);
      removeReplySinglePost(postId);

      if (currentPageRoute.isSinglePostPage) {
        router.replace(AppRoutes.feed.index);
        return;
      }
    } catch (error: any) {
      button.disabled = false;
      customLog(error, ["development"]);
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
            onClick={(e) => {
              handleArchivePost(e, post._id);
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
              onClick={(e) => {
                handleArchivePost(e, post._id);
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
