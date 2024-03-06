import React from "react";
import { useShallow } from "zustand/react/shallow";
import cn from "@/utils/cn";
import { usePostEditorStore } from "@/store/post-editor-store";
import Button from "@/components/button";
import { LoaderSpinner } from "@/assets/svgs";
import { LoggedInUser } from "@/models/user";
import { ActionButtons } from "../shared/ui/action-buttons";
import { PostTextCounter } from "./post-text-counter";

interface Props {
  user: LoggedInUser;
  handleScroll: () => void;
}

export const ModalFooter: React.FC<Props> = ({ user, handleScroll }) => {
  const {
    lastActivePost,
    modalType,
    isSubmitting,
    NON_CITIZEN_POST_TEXT_LENGTH,
  } = usePostEditorStore(
    useShallow((state) => ({
      lastActivePost: state.actions.getLastActivePost(),
      modalType: state.modalType,
      isSubmitting: state.isSubmitting,
      NON_CITIZEN_POST_TEXT_LENGTH: state.NON_CITIZEN_POST_TEXT_LENGTH,
    }))
  );
  const {
    addNewPost,
    createPosts,
    // editPost,
    isCitizenshipRequiredByAnyPost,
    isAnyPostEmpty,
    isPostEmpty,
  } = usePostEditorStore(useShallow((state) => state.actions));

  if (!lastActivePost) return null;

  const isLastActivePostEmpty = isPostEmpty(lastActivePost.uuid);

  return (
    <div
      className={cn(
        `grid grid-rows-[auto_auto] items-center border-t-2 border-gray-shade-3 border-opacity-40 px-3 py-3 fsm:grid-cols-[1fr_auto_auto_auto] fsm:grid-rows-1 fsm:px-6`,
        {
          "grid-cols-[1fr_auto]": modalType !== "edit",
          "grid-cols-[auto_1fr]": modalType === "edit",
        }
      )}
    >
      {modalType !== "edit" ? (
        <ActionButtons placement={"in-modal"} />
      ) : (
        <div className="hidden fsm:block" />
      )}
      <div className="flex items-center">
        {user.membership.status !== "citizen" && (
          <>
            <div
              className={cn("size-7", {
                "ml-2 fsm:ml-0": modalType !== "edit",
                "mr-2 fsm:mr-0": modalType === "edit",
              })}
            >
              <PostTextCounter
                currentLength={lastActivePost.text_content_length}
                maxLength={NON_CITIZEN_POST_TEXT_LENGTH}
              />
            </div>

            <div
              className={cn(`mx-2 block h-4 w-0.5 rounded-xl bg-gray-shade-3`, {
                "hidden fsm:block": isLastActivePostEmpty,
              })}
            />
          </>
        )}

        {modalType === "new-post" && !isLastActivePostEmpty && (
          <button
            onClick={() => {
              addNewPost();
              handleScroll();
            }}
            className="textGradient flex size-7 items-center justify-center rounded-lg border-[1.5px] border-gray-shade-3 text-lg fsm:mr-2 fsm:size-9 fsm:rounded-xl fsm:text-2xl"
          >
            +
          </button>
        )}
      </div>
      <Button
        loaderIcon={
          isSubmitting && (
            <LoaderSpinner className="inline-block h-4 w-4 animate-spin" />
          )
        }
        title={modalType === "edit" ? "Save" : "Post"}
        onClick={() => {
          // Check if any of the post is empty or invalid or isSubmitting
          if (
            isAnyPostEmpty() ||
            isCitizenshipRequiredByAnyPost(user) ||
            isSubmitting
          ) {
            return;
          }

          if (modalType === "edit") {
            console.log("TODO: Submit Edit Post");
            // editPost();
            return;
          } else {
            createPosts(user);
            return;
          }
        }}
        variant={"primary"}
        disabled={
          isAnyPostEmpty() ||
          isCitizenshipRequiredByAnyPost(user) ||
          isSubmitting
        }
        className={cn(
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
