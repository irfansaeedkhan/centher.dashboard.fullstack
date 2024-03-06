import React from "react";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import { IoClose } from "react-icons/io5";
import { LoggedInUser } from "@/models/user";
import { usePostEditorStore } from "@/store/post-editor-store";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import cn from "@/utils/cn";
import { PostLexicalEditor } from "../post-lexical-editor";
import { FilesPreview } from "./files-preview";
import { NonCitizenWarningBanner } from "./non-citizen-warning-banner";

interface Props {
  user: LoggedInUser;
  openBuyCitizenshipModal: () => void;
}

export const EditorContainer: React.FC<Props> = ({
  user,
  openBuyCitizenshipModal,
}) => {
  const { posts, lastActivePostUUID } = usePostEditorStore(
    useShallow((state) => ({
      posts: state.posts,
      lastActivePostUUID: state.lastActivePostUUID,
    }))
  );

  const { isPostEmpty, removePost, setLastActivePost } = usePostEditorStore(
    useShallow((state) => state.actions)
  );

  return (
    <div className={`flex w-full flex-col gap-4 px-3 py-4 fsm:px-6`}>
      <div className={`flex items-center gap-3`}>
        <Image
          src={user.profile_image}
          width={256}
          height={256}
          className="size-11 rounded-full object-cover"
          alt={user.display_name}
        />
        <span
          className={cn(
            `text-sm font-semibold text-white`,
            user.display_name.includes(" ")
              ? "line-clamp-1 text-ellipsis"
              : "block w-full max-w-full overflow-hidden truncate"
          )}
          title={user.display_name}
        >
          {sliceDisplayName(user.display_name)}
        </span>
      </div>

      {posts.map((post) => {
        return (
          <div
            key={post.uuid}
            className={cn(
              "relative rounded-10px bg-background-shade-3",
              post.uuid !== lastActivePostUUID && "opacity-30",
              !!post.media.length && "px-3 py-3.5"
            )}
            onClick={() => {
              if (post.uuid === lastActivePostUUID) return;
              setLastActivePost(post.uuid);
            }}
          >
            {isPostEmpty(post.uuid) &&
              post.uuid === lastActivePostUUID &&
              posts.length > 1 && (
                <div className="absolute right-0 top-0">
                  <button
                    className="p-1.5"
                    onClick={() => removePost(post.uuid)}
                  >
                    <IoClose className="text-white" />
                  </button>
                </div>
              )}
            {!!post.media.length && (
              <FilesPreview postUUID={post.uuid} media={post.media} />
            )}
            <PostLexicalEditor
              postUUID={post.uuid}
              className={cn(!post.media.length && "px-3 py-3.5")}
            />
            <NonCitizenWarningBanner
              user={user}
              post={post}
              openBuyCitizenshipModal={openBuyCitizenshipModal}
            />
          </div>
        );
      })}
    </div>
  );
};
