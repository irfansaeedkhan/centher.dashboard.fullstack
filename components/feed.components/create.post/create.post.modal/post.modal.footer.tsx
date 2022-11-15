import React from "react";
import { CgSpinner } from "react-icons/cg";

import { useNewPostStore } from "@/store/new.post.store";

import { PostModalActionButtons } from "../shared/ui/post.modal.action.buttons";
import { PostTextCounter } from "./post.text.counter";

const PostModalFooter: React.FC = () => {
  const { isPostCreateLoading, postText, postTextMaxLength, createPost } =
    useNewPostStore();

  return (
    <div className={`flex items-center px-6 py-3`}>
      <div className="flex-grow">
        <PostModalActionButtons placement={"in-modal"} />
      </div>

      <div className={`flex items-center gap-2`}>
        <div className="w-7 h-7">
          <PostTextCounter
            currentLength={postText.length}
            maxLength={postTextMaxLength}
          />
        </div>

        <div className={`w-[1.5px] h-4 bg-gray-shade-3 rounded-xl`}></div>

        <button
          className={`block text-14px font-bold py-2 px-12 rounded-xl bg-brand-primary text-black-shade-3 select-none`}
          onClick={createPost}
        >
          {isPostCreateLoading ? (
            <CgSpinner className="animate-spin w-5 h-5" />
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default PostModalFooter;
