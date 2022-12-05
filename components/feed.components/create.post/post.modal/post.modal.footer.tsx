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
        `grid grid-rows-[auto_auto] fsm:grid-rows-1 fsm:grid-cols-[1fr_auto_auto_auto] items-center px-3 fsm:px-6 py-3`,
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
        className={clsx("w-7 h-7", {
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
        className={`w-0.5 h-4 bg-gray-shade-3 rounded-xl hidden fsm:block mx-2`}
      ></div>

      <button
        className={clsx(
          `block text-center text-14px font-bold py-2 px-12 rounded-xl bg-brand-primary text-black-shade-3 select-none fsm:col-span-1`,
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
          <CgSpinner className="animate-spin w-4 h-4 inline-block" />
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
