import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import clsx from "clsx";
import { HiOutlineArchive } from "react-icons/hi";
import { useInView } from "react-intersection-observer";

import { useNewPostStore } from "@/store/new.post.store";
import useUser from "@/hooks/use.user";
import { ArchivedPost, CompletedPost } from "@/models/post";
import { customLog } from "@/utils/custom.log";

import { PostModal } from "../create.post/post.modal";
import { PostHeader } from "./post.header";
import { PostMedia } from "./post.media";
import { PostTextContent } from "./post.text.content";
import { PostFooter } from "./post.footer";
import { ShowThread } from "./show.thread";
import { PostUserImage } from "./post.user.image";
import { LoggedInModal } from "./logged.in.modal";

export type PostType = "main" | "reply" | "reply-w-parent-header" | "archived";
export type Placement =
  | "feed-page"
  | "single-post-page"
  | "profile-posts-page"
  | "profile-replies-page"
  | "profile-archived-page";

interface Props {
  post: CompletedPost | ArchivedPost;
  postType: PostType;
  placement: Placement;
  shouldShowThread?: boolean;
  className?: string;
  onPostInViewport?: () => Promise<void>;
  onClickReply?: () => void;
  onClickEdit?: () => void;
  onClickLike?: () => Promise<void>;
  onClickArchive?: () => Promise<void>;
  onClickRestore?: () => Promise<void>;
  onClickDelete?: () => Promise<void>;
}

export const SinglePostV2: React.FC<Props> = ({
  post,
  postType,
  placement,
  shouldShowThread = false,
  className,
  onPostInViewport = async () => {},
  onClickReply = () => {},
  onClickLike = async () => {},
  onClickArchive = async () => {},
  onClickRestore = async () => {},
  onClickDelete = async () => {},
}) => {
  const { user: loggedInUser } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openPostModal = useNewPostStore((state) => state.openModal);
  const [loggedInPostModal, setLoggedInPostModal] = useState({
    isOpen: false,
    onClose: () => {
      setLoggedInPostModal((prevState) => ({
        ...prevState,
        isOpen: false,
      }));
    },
  });

  const [currentPostRef, _currentPostInView, currentPostEntry] = useInView({
    threshold: 0.8,
  });

  // When post is in viewport, call onPostInViewport
  useEffect(() => {
    (async () => {
      if (
        !!loggedInUser &&
        currentPostEntry &&
        currentPostEntry.intersectionRatio > 0.8 &&
        !post.viewed_by_loggedin_user
      ) {
        try {
          await onPostInViewport();
        } catch (error: any) {
          customLog(error, ["development"]);
        }
      }
    })();
  }, [
    post._id,
    post.viewed_by_loggedin_user,
    currentPostEntry,
    onPostInViewport,
    loggedInUser,
  ]);

  return (
    <div
      ref={currentPostRef}
      className={clsx(
        `w-full max-w-[544px] bg-elevation-1 p-4 rounded-10px cursor-pointer`,
        placement === "single-post-page" &&
          (postType === "main" || postType === "reply-w-parent-header") &&
          post.replies_count > 0 &&
          "rounded-b-none",
        placement === "single-post-page" &&
          postType === "reply" &&
          "rounded-t-none rounded-b-none last:rounded-b-10px border-t border-t-gray-shade-3",
        className
      )}
    >
      {postType === "archived" && (
        <div className="mb-2 flex text-white gap-x-2.5">
          <HiOutlineArchive className="w-[18px] h-[18px]" />
          <span className="text-sm">Archived</span>
        </div>
      )}

      <div className="grid grid-cols-[auto_1fr] gap-x-3">
        {postType === "reply-w-parent-header" &&
          post.status !== "archived" &&
          post.parent_post && (
            <>
              <PostUserImage
                postUser={post.parent_post.user}
                shouldShowConnectLines={true}
              />
              <div
                className={clsx(
                  `flex-grow pb-5 mb-5 border-b-2 border-b-gray-shade-3`
                )}
              >
                <PostHeader
                  post={post}
                  postUser={post.parent_post?.user!}
                  postType={postType}
                  loggedInUser={undefined}
                  onClickArchive={undefined}
                  onClickRestore={undefined}
                  onClickDelete={undefined}
                  onClickEdit={undefined}
                />
              </div>
            </>
          )}

        <PostUserImage
          postUser={post.user}
          shouldShowConnectLines={shouldShowThread}
        />

        <div
          className={clsx(`overflow-hidden`, {
            "mb-2": shouldShowThread,
          })}
        >
          <PostHeader
            post={post}
            postUser={post.user}
            postType={postType === "reply-w-parent-header" ? "main" : postType}
            loggedInUser={loggedInUser}
            onClickArchive={onClickArchive}
            onClickRestore={onClickRestore}
            onClickDelete={onClickDelete}
            onClickEdit={() => {
              setIsEditModalOpen(true);
              openPostModal({
                modalType: "edit",
                postId: post._id,
                postText: post.text_content,
                editPostFiles: post.media?.map((m) => ({
                  original: m,
                  id: nanoid(),
                  isDeleted: false,
                })),
                onCloseModal: () => setIsEditModalOpen(false),
              });
            }}
          />

          {post.media && !!post.media.length && (
            <PostMedia post={post} postType={postType} placement={placement} />
          )}

          {post.text_content && (
            <PostTextContent
              post={post}
              postType={postType}
              placement={placement}
            />
          )}

          <PostFooter
            post={post}
            postType={postType}
            placement={placement}
            onClickLike={async () => {
              if (!loggedInUser) {
                setLoggedInPostModal((prevState) => ({
                  ...prevState,
                  isOpen: true,
                }));
                return;
              }
              onClickLike();
            }}
            onClickReply={async () => {
              if (!loggedInUser) {
                setLoggedInPostModal((prevState) => ({
                  ...prevState,
                  isOpen: true,
                }));
                return;
              }
              onClickReply();
            }}
          />
        </div>
      </div>

      {shouldShowThread && <ShowThread post={post} />}

      {isEditModalOpen && <PostModal modalTitle="Edit Post" />}

      <LoggedInModal
        isOpen={loggedInPostModal.isOpen}
        onClose={loggedInPostModal.onClose}
      />
    </div>
  );
};
