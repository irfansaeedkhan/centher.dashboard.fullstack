import React from "react";
import { CgSpinner } from "react-icons/cg";

import { useNewPostStore } from "@/store/new.post.store";

import { PostModalActionButtons } from "../shared/ui/post.modal.action.buttons";
import { PostTextCounter } from "./post.text.counter";

const PostModalFooter: React.FC = () => {
  const { isPostCreateLoading, postText, postTextMaxLength, createPost } =
    useNewPostStore();

  return (
    <div
      className={`grid grid-rows-[auto_auto] fsm:grid-rows-1 grid-cols-[1fr_auto] fsm:grid-cols-[1fr_auto_auto_auto] items-center px-3 fsm:px-6 py-3`}
    >
      <PostModalActionButtons placement={"in-modal"} />

      <div className="w-7 h-7 ml-4 fsm:ml-0">
        <PostTextCounter
          currentLength={postText.length}
          maxLength={postTextMaxLength}
        />
      </div>

      <div
        className={`w-0.5 h-4 bg-gray-shade-3 rounded-xl hidden fsm:block mx-2`}
      ></div>

      <button
        className={`block text-center text-14px font-bold py-2 px-12 rounded-xl bg-brand-primary text-black-shade-3 select-none col-span-full fsm:col-span-1 mt-4 fsm:mt-0`}
        onClick={() => {
          if (isPostCreateLoading) return; // using this to prevent multiple clicks because button disabled method is not working
          createPost();
        }}
      >
        {isPostCreateLoading ? (
          <CgSpinner className="animate-spin w-4 h-4 inline-block" />
        ) : (
          "Post"
        )}
      </button>
    </div>
  );
};

export default PostModalFooter;
