import React from "react";
import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";

import { useNewPostStore } from "@/store/new.post.store";

import { PostModalActionButtons } from "../shared/ui/post.modal.action.buttons";
import { PostTextCounter } from "./post.text.counter";

const PostModalFooter: React.FC = () => {
  const {
    isPostModalLoading,
    postTextMaxLength,
    createPost,
    addNewPost,
    modalType,
    editPost,
    getLastPost,
  } = useNewPostStore();

  const lastPost = getLastPost();

  if (!lastPost) return null;

  return (
    <div
      className={clsx(
        `grid grid-rows-[auto_auto] items-center px-3 py-3 fsm:grid-cols-[1fr_auto_auto_auto] fsm:grid-rows-1 fsm:px-6`,
        {
          "grid-cols-[1fr_auto]": modalType !== "edit",
          "grid-cols-[auto_1fr]": modalType === "edit",
        }
      )}
    >
      {modalType !== "edit" ? (
        <PostModalActionButtons placement={"in-modal"} />
      ) : (
        <div className="hidden fsm:block" />
      )}
      <div className="flex items-center">
        <div
          className={clsx("h-7 w-7", {
            "ml-2 fsm:ml-0": modalType !== "edit",
            "mr-2 fsm:mr-0": modalType === "edit",
          })}
        >
          <PostTextCounter
            currentLength={lastPost.post_text.length}
            maxLength={postTextMaxLength}
          />
        </div>

        <div
          className={`mx-2 block h-4 w-0.5 rounded-xl bg-gray-shade-3`}
        ></div>

        {modalType === "new-post" && (
          <button
            onClick={() => addNewPost()}
            className="flex h-7 w-7 items-center justify-center rounded-lg border-[1.5px] border-gray-shade-3 text-lg text-brand-primary fsm:mr-2 fsm:h-10 fsm:w-10 fsm:rounded-xl fsm:text-2xl"
          >
            +
          </button>
        )}
      </div>
      <button
        className={clsx(
          `text-14px block select-none rounded-xl bg-brand-primary py-2 px-8 text-center font-bold text-black-shade-3 fsm:col-span-1`,
          {
            "col-span-full mt-4 fsm:mt-0": modalType !== "edit",
          }
        )}
        onClick={() => {
          if (isPostModalLoading) return; // using this to prevent multiple clicks because button disabled method is not working
          if (modalType === "edit") {
            editPost();
            return;
          } else {
            createPost();
            return;
          }
        }}
      >
        {isPostModalLoading ? (
          <CgSpinner className="inline-block h-4 w-4 animate-spin" />
        ) : modalType === "edit" ? (
          "Save"
        ) : (
          "Post"
        )}
      </button>
    </div>
  );
};

export default PostModalFooter;
