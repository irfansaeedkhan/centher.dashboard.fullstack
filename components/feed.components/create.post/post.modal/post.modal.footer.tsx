import React from "react";
import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";

import { useNewPostStore } from "@/store/new.post.store";

import { PostModalActionButtons } from "../shared/ui/post.modal.action.buttons";
import { PostTextCounter } from "./post.text.counter";

const PostModalFooter: React.FC = () => {
  const {
    isPostModalLoading,
    postText,
    postTextMaxLength,
    createPost,
    modalType,
    editPost,
  } = useNewPostStore();

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

      <div
        className={clsx("h-7 w-7", {
          "ml-4 fsm:ml-0": modalType !== "edit",
          "mr-4 fsm:mr-0": modalType === "edit",
        })}
      >
        <PostTextCounter
          currentLength={postText.length}
          maxLength={postTextMaxLength}
        />
      </div>

      <div
        className={`mx-2 hidden h-4 w-0.5 rounded-xl bg-gray-shade-3 fsm:block`}
      ></div>

      <button
        className={clsx(
          `text-14px block select-none rounded-xl bg-brand-primary py-2 px-12 text-center font-bold text-black-shade-3 fsm:col-span-1`,
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
