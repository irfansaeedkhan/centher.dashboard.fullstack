import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { HiOutlineArchive } from "react-icons/hi";
import { useInView } from "react-intersection-observer";
import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import useUser from "@/hooks/use.user";
import { ArchivedPost, CompletedPost, ParentPost } from "@/models/post";
import { customLog } from "@/utils/custom.log";
import { ModalPortal } from "@/components/modal/modal.portal";
import { extractTextFromEditorState } from "@/lib/feed/editor-state";
import { useFeedStore } from "@/store/feed.store";
import { useMyPostStore } from "@/store/my.post.store";
import { useSinglePostStore } from "@/store/single.post.store";
import { PostHeader } from "./post.header";
import { apiErrorMessage, editPostRich, editReplyRich } from "./post.helpers";
import { RichTextInlineEditor } from "./rich.text.editor";
import { PostMedia } from "./post.media";
import { PostTextContent } from "./post.text.content";
import { PostFooter } from "./post.footer";
import { ShowThread } from "./show.thread";
import { PostUserImage } from "./post.user.image";
import { LoggedInModal } from "./logged.in.modal";
import { FullscreenMediaPreview } from "./fullscreen.media.preview";

export type PostType =
  | "main"
  | "thread-post"
  | "thread-post-w-parent-header"
  | "reply"
  | "reply-w-parent-header"
  | "archived";

export type Placement =
  | "feed-page"
  | "single-post-page"
  | "profile-posts-page"
  | "profile-replies-page"
  | "profile-archived-page";

interface Props {
  post: CompletedPost | ArchivedPost;
  parentPost: ParentPost | undefined;
  postType: PostType;
  placement: Placement;
  borderRadius: {
    top?: boolean;
    bottom?: boolean;
  };
  shouldShowThread?: boolean;
  className?: string;
  onPostInViewport?: () => Promise<void>;
  onClickReply?: () => void;
  onClickEdit?: () => void;
  /**
   * Feed product call Q13: when wired (post detail view, profile
   * replies page), a reply's Edit action switches to inline editing
   * (like chat's) and the saved reply is handed back here so the
   * parent can swap it into its store.
   */
  onReplyUpdated?: (post: CompletedPost) => void;
  onClickLike?: () => Promise<void>;
  onClickArchive?: () => Promise<void>;
  onClickRestore?: () => Promise<void>;
  onClickDelete?: () => Promise<void>;
}

export const SinglePostV2: React.FC<Props> = ({
  post,
  parentPost,
  postType,
  placement,
  borderRadius = {
    top: true,
    bottom: true,
  },
  shouldShowThread = false,
  className,
  onPostInViewport = async () => {},
  onClickReply = () => {},
  onClickLike = async () => {},
  onClickArchive = async () => {},
  onClickRestore = async () => {},
  onClickDelete = async () => {},
  onReplyUpdated,
}) => {
  const { user: loggedInUser } = useUser();
  // Q13 + post-grill Q10: inline reply edit runs over the STORED
  // editor state — it used to be a textarea seeded from plain
  // `text_content` that saved `{ text }`, irreversibly flattening
  // mentions, links, and formatting on any save.
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [replyDraftState, setReplyDraftState] =
    useState<SerializedEditorState<SerializedLexicalNode> | null>(null);
  const [isSavingReply, setIsSavingReply] = useState(false);
  const [replyEditError, setReplyEditError] = useState<string | null>(null);
  // Post-grill Q11: post edits run through the same rich editor in a
  // modal — they used to go through the Draft.js modal seeded from
  // `text_content` (same flattening) with a console-only catch, so the
  // routine 15-minute-window expiry told the user nothing. Failures
  // now surface in the modal and the draft survives them.
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [postDraftState, setPostDraftState] =
    useState<SerializedEditorState<SerializedLexicalNode> | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [postEditError, setPostEditError] = useState<string | null>(null);
  const [loggedInPostModal, setLoggedInPostModal] = useState({
    isOpen: false,
    onClose: () => {
      setLoggedInPostModal((prevState) => ({
        ...prevState,
        isOpen: false,
      }));
    },
  });
  const [fullscreenPreview, setFullscreenPreview] = useState({
    isOpen: false,
    previewIndex: 0,
  });

  // Post-grill Q16: view counting. The old signal — 80% of the card
  // visible — is mathematically unreachable for a card taller than
  // ~1.25x the viewport, so the most substantial posts never counted
  // a view while short ones did; and replies fired a post-view ping
  // with a COMMENT id that 404'd on every card (and burned the shared
  // post-views rate limit). Now: any part of a POST card visible for
  // a 1-second dwell counts once; replies never ping.
  const isReplyCard =
    postType === "reply" || postType === "reply-w-parent-header";
  // Feed fix 2026-10-29 (owner views): the author's own scroll-past
  // must never count as audience growth. This is the single choke
  // point — every caller (feed, profile, post detail) fires its view
  // ping through onPostInViewport, so guarding here covers all of
  // them. The server enforces the same rule as defence in depth.
  const isOwnerCard =
    !!loggedInUser &&
    !!post.user?._id &&
    loggedInUser._id.toLowerCase() === post.user._id.toLowerCase();
  const [currentPostRef, _currentPostInView, currentPostEntry] = useInView({
    threshold: 0,
  });
  const currentPostInView = !!currentPostEntry?.isIntersecting;

  useEffect(() => {
    if (
      isReplyCard ||
      isOwnerCard ||
      !loggedInUser ||
      !currentPostInView ||
      post.viewed_by_loggedin_user
    ) {
      return;
    }
    const timer = setTimeout(() => {
      // onPostInViewport is intentionally not a dep: its identity
      // changes every render and would keep resetting the dwell.
      onPostInViewport().catch((error: any) => {
        customLog(["development"], error);
      });
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isReplyCard,
    isOwnerCard,
    loggedInUser,
    currentPostInView,
    post._id,
    post.viewed_by_loggedin_user,
  ]);

  const handleSaveReplyEdit = async () => {
    if (isSavingReply) return;
    setIsSavingReply(true);
    setReplyEditError(null);
    try {
      // Q10: save the full editor state, not flattened plain text.
      const updated = await editReplyRich(
        post._id,
        replyDraftState ?? post.post_editor_state
      );
      setIsEditingReply(false);
      onReplyUpdated?.(updated);
    } catch (error: any) {
      // Readable failure, editor stays open with the draft intact.
      setReplyEditError(
        apiErrorMessage(error, "Could not save your reply. Please try again.")
      );
    } finally {
      setIsSavingReply(false);
    }
  };

  const handleSavePostEdit = async () => {
    if (isSavingPost) return;
    const draft = postDraftState ?? post.post_editor_state;
    // Q11: the empty check considers the post's existing media. A
    // media-only post used to be uneditable — the old flow seeded an
    // empty media array and then refused to save it as "empty".
    if (
      extractTextFromEditorState(draft).trim().length === 0 &&
      (!post.media || post.media.length === 0)
    ) {
      setPostEditError("You can not make the post empty");
      return;
    }
    setIsSavingPost(true);
    setPostEditError(null);
    try {
      const updated = await editPostRich(post._id, draft);
      // Swap the saved post into every store that can hold it — the
      // same set the old refetch flow updated.
      useFeedStore.getState().replaceEditedPost(updated);
      useMyPostStore.getState().replaceEditedPost(updated);
      useSinglePostStore.getState().replaceEditedPost(updated);
      setIsEditingPost(false);
    } catch (error: any) {
      // Readable in-modal failure (incl. the 15-minute window
      // expiring mid-edit); the modal stays open, draft intact.
      setPostEditError(
        apiErrorMessage(error, "Could not save your post. Please try again.")
      );
    } finally {
      setIsSavingPost(false);
    }
  };

  // The edit modal obeys the standing rule: escapable at every step
  // (Escape here, backdrop click in the JSX) — except mid-save.
  useEffect(() => {
    if (!isEditingPost) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSavingPost) setIsEditingPost(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEditingPost, isSavingPost]);

  // Feed product call Q21: tombstone — a deleted post/reply renders as
  // a placeholder so thread structure survives (replies under a deleted
  // post stay reachable from the detail page). No body, media, or
  // actions are rendered for it.
  if ((post.status as string) === "deleted") {
    return (
      <div
        className={clsx(
          `w-full max-w-[544px] rounded-10px bg-elevation-1 p-4`,
          {
            "rounded-t-none": !borderRadius.top,
            "rounded-b-none": !borderRadius.bottom,
          },
          className
        )}
        data-post-id={post._id}
      >
        <p className="text-sm italic text-gray-shade-7">
          {postType === "reply" || postType === "reply-w-parent-header"
            ? "This reply was deleted"
            : "This post was deleted"}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={currentPostRef}
      className={clsx(
        `w-full max-w-[544px] cursor-pointer rounded-10px bg-elevation-1 p-4`,
        {
          "rounded-t-none": !borderRadius.top,
          "rounded-b-none": !borderRadius.bottom,
        },
        placement === "single-post-page" &&
          (postType === "reply" || postType === "thread-post") &&
          "border-t border-t-gray-shade-3",
        className
      )}
      data-post-id={post._id}
    >
      {postType === "archived" && (
        <div className="mb-2 flex gap-x-2.5 text-white">
          <HiOutlineArchive className="h-[18px] w-[18px]" />
          <span className="text-sm">Archived</span>
        </div>
      )}

      <div className="grid grid-cols-[auto_1fr] gap-x-3">
        {(postType === "reply-w-parent-header" ||
          postType === "thread-post-w-parent-header") &&
          post.status !== "archived" &&
          parentPost && (
            <>
              <PostUserImage postUser={parentPost.user} />
              <div
                className={clsx(
                  `word-break mb-5 flex-grow truncate border-b-2 border-b-gray-shade-3 pb-5`
                )}
              >
                <PostHeader
                  post={post}
                  parentPost={parentPost}
                  postUser={parentPost.user}
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

        <PostUserImage postUser={post.user} />

        <PostHeader
          post={post}
          postUser={post.user}
          parentPost={parentPost}
          postType={
            postType === "reply-w-parent-header" ||
            postType === "thread-post-w-parent-header"
              ? "main"
              : postType
          }
          loggedInUser={loggedInUser}
          onClickArchive={onClickArchive}
          onClickRestore={onClickRestore}
          onClickDelete={onClickDelete}
          onClickEdit={() => {
            // Q13: replies edit inline (like chat) when the parent wired
            // onReplyUpdated — the post modal would PATCH the post
            // endpoint with a comment id and silently fail. The profile
            // replies page renders comments as "reply-w-parent-header"
            // and wires onReplyUpdated too; the post detail page's
            // firstPost uses that type for a real post but never passes
            // onReplyUpdated, so it still edits through the post path.
            // Post-grill Q10/Q11: BOTH paths now seed from the stored
            // editor state — never from plain `text_content`.
            if (
              (postType === "reply" || postType === "reply-w-parent-header") &&
              onReplyUpdated
            ) {
              setReplyDraftState(post.post_editor_state);
              setReplyEditError(null);
              setIsEditingReply(true);
              return;
            }
            setPostDraftState(post.post_editor_state);
            setPostEditError(null);
            setIsEditingPost(true);
          }}
        />

        {/* Vertical Line */}
        {shouldShowThread && (
          <div
            className={clsx(
              "w-0.5 justify-self-center bg-gray-shade-3",
              postType === "reply-w-parent-header"
                ? "row-start-3 row-end-5"
                : "row-start-2 row-end-4"
            )}
          />
        )}

        <div
          className={clsx(
            `overflow-hidden`,
            placement === "single-post-page" &&
              (postType === "main" ||
                postType === "reply-w-parent-header" ||
                postType === "thread-post-w-parent-header")
              ? "col-span-full"
              : "col-span-1 col-start-2"
          )}
        >
          {post.media && !!post.media.length && (
            <PostMedia
              post={post}
              postType={postType}
              placement={placement}
              previewIndex={fullscreenPreview.previewIndex}
              onClickMedia={(mediaUrl) => {
                setFullscreenPreview((prev) => ({
                  ...prev,
                  isOpen: true,
                  previewIndex: post.media!.findIndex(
                    (m) => m.url === mediaUrl
                  ),
                }));
              }}
            />
          )}

          {isEditingReply ? (
            <div
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {/* Q10: the rich editor over the stored state — a plain
                  textarea here is what flattened every edited reply. */}
              <div className="rounded-10px bg-elevation-2 p-3">
                <RichTextInlineEditor
                  initialState={post.post_editor_state}
                  onChange={setReplyDraftState}
                />
              </div>
              {replyEditError && (
                <p className="mt-2 text-xs font-medium text-danger">
                  {replyEditError}
                </p>
              )}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditingReply(false);
                    setReplyEditError(null);
                  }}
                  disabled={isSavingReply}
                  className="rounded-10px bg-elevation-2 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReplyEdit}
                  disabled={
                    isSavingReply ||
                    !replyDraftState ||
                    extractTextFromEditorState(replyDraftState).trim()
                      .length === 0
                  }
                  className="rounded-10px bg-brand-primary px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isSavingReply ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ) : (
            post.post_editor_state && <PostTextContent post={post} />
          )}

          {/*  Fullscreen Lightbox */}
          {fullscreenPreview.isOpen && post.media && !!post.media.length && (
            <FullscreenMediaPreview
              media={post.media!}
              previewIndex={fullscreenPreview.previewIndex}
              onClose={(previewIndex) =>
                setFullscreenPreview((prev) => ({
                  ...prev,
                  isOpen: false,
                  previewIndex,
                }))
              }
            />
          )}
        </div>

        <div
          className={clsx(
            {
              "mb-2": shouldShowThread,
            },
            placement === "single-post-page" &&
              (postType === "main" ||
                postType === "reply-w-parent-header" ||
                postType === "thread-post-w-parent-header")
              ? "col-span-full"
              : "col-span-1 col-start-2"
          )}
        >
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

      <ShowThread post={post} shouldShowThread={shouldShowThread} />

      {/* Post-grill Q11: rich post-edit modal (replaces the Draft.js
          PostModal for edits). Seeded from the stored editor state;
          failures render inside the modal and the draft survives. */}
      {isEditingPost && (
        <ModalPortal wrapperId="post-edit-modal">
          <div
            className="fixed inset-0 z-[1050] flex items-center justify-center overflow-y-auto overflow-x-hidden font-monto backdrop-blur-lg backdrop-filter"
            onClick={() => {
              if (!isSavingPost) setIsEditingPost(false);
            }}
          >
            <div
              className="mx-2 w-full max-w-[656px] rounded-2xl bg-popup-0 p-4 fmd:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex items-center justify-between text-white">
                <h3 className="text-lg font-semibold">Edit Post</h3>
              </header>
              <div className="mt-4 rounded-10px bg-elevation-2 p-3">
                <RichTextInlineEditor
                  initialState={post.post_editor_state}
                  onChange={setPostDraftState}
                />
              </div>
              {postEditError && (
                <p className="mt-3 text-sm font-medium text-danger">
                  {postEditError}
                </p>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingPost(false)}
                  disabled={isSavingPost}
                  className="rounded-10px bg-elevation-2 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePostEdit}
                  disabled={isSavingPost}
                  className="rounded-10px bg-brand-primary px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isSavingPost ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      <LoggedInModal
        isOpen={loggedInPostModal.isOpen}
        onClose={loggedInPostModal.onClose}
      />
    </div>
  );
};
