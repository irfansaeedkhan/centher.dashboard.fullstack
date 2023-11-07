import React from "react";
import clsx from "clsx";
import type { EmojiPlugin } from "@draft-js-plugins/emoji";
import { useNewPostStore } from "@/store/new.post.store";
import Button from "@/components/button";
import { LoaderSpinner } from "@/assets/svgs";
import { PostTextCounter } from "./post.text.counter";
import { PostModalActionButtons } from "../shared/ui/post.modal.action.buttons";

interface Props {
  handleScroll: () => void;
  emojiPlugin: EmojiPlugin;
  EmojiSuggestions: React.ComponentType;
  EmojiSelect: React.ComponentType;
}

const PostModalFooter: React.FC<Props> = ({
  handleScroll,
  emojiPlugin,
  EmojiSuggestions,
  EmojiSelect,
}) => {
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
        <PostModalActionButtons
          placement={"in-modal"}
          emojiPlugin={emojiPlugin}
          EmojiSuggestions={EmojiSuggestions}
          EmojiSelect={EmojiSelect}
        />
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
            onClick={() => {
              addNewPost();
              handleScroll();
            }}
            className="textGradient flex h-7 w-7 items-center justify-center rounded-lg border-[1.5px] border-gray-shade-3 text-lg fsm:mr-2 fsm:h-10 fsm:w-10 fsm:rounded-xl fsm:text-2xl"
          >
            +
          </button>
        )}
      </div>
      <Button
        loaderIcon={
          isPostModalLoading &&
          ((
            <LoaderSpinner className="inline-block h-4 w-4 animate-spin" />
          ) as any)
        }
        title={modalType === "edit" ? "Save" : "Post"}
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
        variant="primary"
        className={clsx(
          `block select-none rounded-xl px-8 py-2 text-center text-sm fsm:col-span-1`,
          {
            "col-span-full mt-4 fsm:mt-0": modalType !== "edit",
          }
        )}
        borderRounded="14px"
      />
    </div>
  );
};

export default PostModalFooter;
