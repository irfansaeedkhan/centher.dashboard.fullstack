import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import useUser from "@/hooks/use.user";
import { useNewPostStore } from "@/store/new.post.store";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { PostModalContainer } from "./post.modal.container";
import { FilesPreview } from "./files.preview";
import PostPreview from "./post.preview";

interface Props {
  modalTitle: string;
}

export const PostModal: React.FC<Props> = ({ modalTitle }) => {
  const { user } = useUser();
  const scrollRef = useRef<HTMLTextAreaElement>(null);
  const {
    closeModal,
    isModalOpen,
    setPostText,
    postTextMaxLength,
    posts,
    removePost,
  } = useNewPostStore();

  const lastPost = useMemo(() => {
    return posts.at(-1);
  }, [posts]);

  const hasMedia = useMemo(() => {
    return (
      lastPost &&
      (!!lastPost.media.length ||
        !!lastPost.media.filter((f) => f.type === "edit" && !f.isDeleted)
          .length)
    );
  }, [lastPost]);

  useEffect(() => {
    if (hasMedia) {
      setTimeout(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 500);
    }
  }, [hasMedia]);

  if (!user) {
    return null;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <PostModalContainer
        isOpen={isModalOpen}
        onClickClose={closeModal}
        title={modalTitle}
      >
        <div
          className={`flex w-full flex-col gap-4 border-b-2 border-gray-shade-3 border-opacity-40 px-3 py-4 fsm:px-6`}
        >
          <div className={`flex items-center gap-3`}>
            <Image
              src={user.profile_image}
              width={44}
              height={44}
              className="h-[44px] w-[44px] rounded-full object-cover"
              alt={user.display_name ?? "profile image"}
              sizes={"256px"}
            />
            <h5
              className={clsx(
                `text-sm font-semibold text-white`,
                user.display_name.includes(" ")
                  ? "line-clamp-1 text-ellipsis"
                  : "block w-full max-w-full overflow-hidden truncate"
              )}
              title={user.display_name}
            >
              {user && sliceDisplayName(user.display_name)}
            </h5>
          </div>

          <div>
            {posts.slice(0, -1).map((post) => (
              <PostPreview
                key={post.uuid}
                post={post}
                removePost={removePost}
              />
            ))}

            {lastPost && (
              <div>
                <FilesPreview media={lastPost.media} />

                <div className={clsx(`w-full`, hasMedia && "mt-4")}>
                  <textarea
                    ref={scrollRef}
                    autoFocus
                    className={`scrollSet block w-full resize-none overflow-y-auto break-words rounded-10px border-none bg-background-shade-3 px-4 py-3.5 text-xs font-medium leading-6 text-white outline-none focus:ring-0 fsm:text-sm`}
                    cols={12}
                    rows={3}
                    maxLength={postTextMaxLength}
                    placeholder="Type here"
                    value={lastPost.post_text}
                    onChange={(e) => setPostText(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        </div>
      </PostModalContainer>
    </div>
  );
};
