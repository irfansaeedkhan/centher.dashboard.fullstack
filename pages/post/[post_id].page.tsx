import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";
import { useProfileCardStore } from "@/store/profile.card.store";
import { useFeedStore } from "@/store/feed.store";
import { usePostEditorStore } from "@/store/post-editor-store";
import { useSinglePostStore } from "@/store/single.post.store";
import { useMyPostStore } from "@/store/my.post.store";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import {
  FeedPagesWrapper,
  SinglePostV2,
  apiErrorMessage,
  archivePost,
  unArchivePost,
  deletePost,
  deleteReply,
  createPostView,
} from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import { PostEditorModal } from "@/components/post-editor/post-editor-modal";
import { Post } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";
import { BackButton } from "@/components/button/back-button";
import { NoPostMessage } from "./_components";

const SinglePostPage: NextPageWithLayout = () => {
  const { user: loggedInUser } = useUser();
  const router = useRouter();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const {
    postId: storePostId,
    posts,
    fetchPost,
    resetStore,
    postLoading,
    replies,
    repliesLoading,
    repliesOffset,
    repliesHasMore,
    fetchReplies,
    likePostAPI,
    updateRepliesOffset,
    updatePost,
    replaceEditedPost,
    createPostViewInStore,
  } = useSinglePostStore();

  const feedStore = useFeedStore((state) => ({
    removePost: state.removePost,
  }));
  const myPostStore = useMyPostStore((state) => ({
    removePost: state.removePost,
  }));

  // Post-grill Q8: normalize the id ONCE. The store is keyed by the
  // lowercased id; the old code compared the raw query value against
  // store ids, so a case-mangled link loaded fine from the server and
  // then "found" no post — parent vanished, orphaned replies rendered.
  const postIdParam = router.query.post_id?.toString().toLowerCase();

  const firstPost = useMemo(() => {
    if (!posts.length || !postIdParam) return null;
    const found = posts.find((p) => p._id === postIdParam);
    return (found as Post) ?? null;
  }, [posts, postIdParam]);

  const { openModal: openPostModal } = usePostEditorStore(
    useShallow((state) => state.actions)
  );

  const [lastReplyRef, _lastReplyInView, lastReplyEntry] = useInView();

  useEffect(() => {
    if (lastReplyEntry?.isIntersecting) {
      updateRepliesOffset();
    }
  }, [lastReplyRef, lastReplyEntry, updateRepliesOffset]);

  useEffect(() => {
    if (repliesOffset > 0) {
      fetchReplies();
    }
  }, [fetchReplies, repliesOffset]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Post-grill Q7: reset only when the POST changes. The old effect
  // depended on the session OBJECT (new identity on every SWR
  // revalidation) and its cleanup reset the store — tab away and back
  // and the page flashed to a skeleton and lost reply pagination.
  useEffect(() => {
    if (postIdParam) {
      resetStore(postIdParam, "loading");
    }
    return () => {
      resetStore("", "idle");
    };
  }, [postIdParam, resetStore]);

  // Fetch once per (post, auth-mode). When the session arrives, one
  // soft refetch upgrades to the with-auth variant (liked state)
  // WITHOUT a reset — content stays on screen (see the store). A
  // session revalidation with the same user id refetches nothing.
  const authUserId = loggedInUser?._id;
  const fetchedKeyRef = useRef("");
  useEffect(() => {
    if (!postIdParam) return;
    const key = `${postIdParam}|${authUserId ? "auth" : "anon"}`;
    if (fetchedKeyRef.current === key) return;
    fetchedKeyRef.current = key;
    fetchPost(!!authUserId);
  }, [postIdParam, authUserId, fetchPost]);

  // ------------------------------------------------------------------
  // Post-grill Q14: ONE readable error surface for every action on
  // this page. Delete/archive failures used to end in a console-only
  // customLog — a failed delete left the user believing the post was
  // gone. Archive also confirmed in place instead of ejecting the
  // author to the feed with no word about what happened.
  // ------------------------------------------------------------------
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleDeleteMainPost = async (postId: string) => {
    try {
      setActionError(null);
      await deletePost(postId);
      feedStore.removePost(postId);
      // Feed fix 2026-10-29 (count lag): the old handler removed
      // the post from the feed store only, so the profile list
      // (my-post store) kept the deleted post until its next fetch
      // returned it as a tombstone. Remove it there too.
      myPostStore.removePost(postId);
      // Decrement post count on profile card (owner-guarded in the
      // store; a no-op while the card has not loaded).
      useProfileCardStore
        .getState()
        .decrementPostsCount(firstPost?.user._id);
      router.replace(AppRoutes.feed.index);
    } catch (error: any) {
      setActionError(
        apiErrorMessage(error, "Could not delete this post. Please try again.")
      );
    }
  };

  const handleArchiveMainPost = async (postId: string) => {
    try {
      setActionError(null);
      await archivePost(postId);
      // Reflect it in place (Q15 rendering takes over: banner +
      // Restore) and confirm what happened — no silent ejection.
      updatePost(postId, () => ({ is_archived: true }));
      setActionNotice(
        "Post archived. It's hidden from everyone else — restore it any time from here or your archived posts."
      );
    } catch (error: any) {
      setActionError(
        apiErrorMessage(error, "Could not archive this post. Please try again.")
      );
    }
  };

  const handleRestoreMainPost = async (postId: string) => {
    try {
      setActionError(null);
      await unArchivePost(postId);
      updatePost(postId, () => ({ is_archived: false }));
      setActionNotice("Post restored — it's visible again.");
    } catch (error: any) {
      setActionError(
        apiErrorMessage(error, "Could not restore this post. Please try again.")
      );
    }
  };

  // Feed product calls Q12/Q13: reply delete is a soft delete — the
  // server returns the tombstone and it replaces the reply in place
  // (thread structure survives), instead of the old flow that removed
  // it from the list. Failures surface in the same banner as above.
  const handleDeleteReply = async (replyId: string) => {
    try {
      setActionError(null);
      const tombstone = await deleteReply(replyId);
      replaceEditedPost(tombstone);
    } catch (error: any) {
      setActionError(
        apiErrorMessage(error, "Could not delete your reply. Please try again.")
      );
    }
  };

  const handleCreatePostView = async (postId: string) => {
    try {
      await createPostView(postId);
      createPostViewInStore(postId);
    } catch {
      // View pings are best-effort metrics (Q16) — never surface.
    }
  };

  // ------------------------------------------------------------------
  // Post-grill Q12: reply deep-link anchor. Notification and share
  // links carry ?reply=<comment_id>; when the reply is loaded, scroll
  // to it and highlight it; when it sits deeper in keyset pagination,
  // page forward (bounded) until it lands.
  // ------------------------------------------------------------------
  const anchorReplyId =
    typeof router.query.reply === "string" ? router.query.reply : null;
  const [highlightedReplyId, setHighlightedReplyId] = useState<string | null>(
    null
  );
  const anchorAttemptsRef = useRef(0);

  useEffect(() => {
    anchorAttemptsRef.current = 0;
  }, [anchorReplyId]);

  useEffect(() => {
    if (!anchorReplyId || postLoading !== "loaded") return;

    const found = replies.some((reply) => reply._id === anchorReplyId);
    if (found) {
      const el = document.getElementById(`reply-${anchorReplyId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedReplyId(anchorReplyId);
        const timer = setTimeout(() => setHighlightedReplyId(null), 3000);
        return () => clearTimeout(timer);
      }
      return;
    }

    if (repliesHasMore && anchorAttemptsRef.current < 10) {
      anchorAttemptsRef.current += 1;
      fetchReplies();
    }
  }, [anchorReplyId, postLoading, replies, repliesHasMore, fetchReplies]);

  return (
    <>
      <BackButton />
      {actionError && (
        <div className="mb-3 flex items-center justify-between rounded-10px bg-elevation-1 p-3 text-sm font-medium text-danger">
          <span>{actionError}</span>
          <button
            aria-label="Dismiss"
            onClick={() => setActionError(null)}
            className="ml-3 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
      {actionNotice && (
        <div className="mb-3 flex items-center justify-between rounded-10px bg-elevation-1 p-3 text-sm font-medium text-white">
          <span>{actionNotice}</span>
          <button
            aria-label="Dismiss"
            onClick={() => setActionNotice(null)}
            className="ml-3 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
      {postLoading === "loaded" && (
        <>
          {firstPost?.status === "complete" && (
            <SinglePostV2
              key={firstPost._id}
              post={firstPost}
              parentPost={firstPost.parent_post}
              postType={
                // Post-grill Q15: an archived post renders AS archived
                // (banner + Restore, no redundant Archive) — it used
                // to render as a live post because the mapper never
                // surfaced the flag.
                firstPost.is_archived
                  ? "archived"
                  : firstPost.parent_post
                  ? "reply-w-parent-header"
                  : "main"
              }
              placement={"single-post-page"}
              borderRadius={{
                top: true,
                bottom: replies.length > 0 ? false : true,
              }}
              onClickLike={async () => {
                await likePostAPI(
                  firstPost._id,
                  firstPost.liked_by_loggedin_user ? "unlike" : "like",
                  "main"
                );
              }}
              onClickReply={() => {
                setIsReplyModalOpen(true);
                openPostModal({
                  modalType: "reply",
                  parentPostId: firstPost._id,
                  onCloseModal: () => setIsReplyModalOpen(false),
                  shouldAddNewPost: true,
                });
              }}
              onClickArchive={() => handleArchiveMainPost(firstPost._id)}
              onClickRestore={() => handleRestoreMainPost(firstPost._id)}
              onClickDelete={() => handleDeleteMainPost(firstPost._id)}
              onPostInViewport={() => handleCreatePostView(firstPost._id)}
            />
          )}

          {firstPost?.status === "deleted" && (
            <NoPostMessage
              message="The post was deleted by author."
              className={clsx(firstPost.replies_count > 0 && "rounded-b-none")}
            />
          )}

          {/* Post-grill Q18: the thread-post rendering block is gone.
              Threads were replaced by comments in Phase 2 —
              handleSinglePost returns exactly one post and mapPostRow
              hardcodes is_thread:false, so the block was unreachable
              dead code wired to live delete/archive handlers, with a
              parent-header fallback that pointed a post at itself. */}

          {replies.map((reply) => {
            return (
              <div
                key={reply._id}
                id={`reply-${reply._id}`}
                className={clsx(
                  highlightedReplyId === reply._id &&
                    "rounded-10px ring-2 ring-brand-primary"
                )}
                onClick={() => {
                  // Post-grill Q5: a reply's address is its PARENT post
                  // anchored to the reply — this used to push
                  // /post/<comment_id>, which renders "The post does
                  // not exist."
                  router.push({
                    pathname: AppRoutes.feed.single_post,
                    query: {
                      post_id: storePostId,
                      reply: reply._id,
                    },
                  });
                }}
              >
                <SinglePostV2
                  post={reply}
                  postType={"reply"}
                  placement={"single-post-page"}
                  parentPost={reply.parent_post}
                  borderRadius={{
                    top: false,
                    bottom:
                      // if it is last post in replies and there are no more replies to fetch
                      replies[replies.length - 1]._id === reply._id
                        ? true
                        : false,
                  }}
                  onClickLike={async () => {
                    await likePostAPI(
                      reply._id,
                      reply.liked_by_loggedin_user ? "unlike" : "like",
                      "reply"
                    );
                  }}
                  onClickReply={() => {
                    setIsReplyModalOpen(true);
                    openPostModal({
                      modalType: "reply-of-reply",
                      parentPostId: reply._id,
                      onCloseModal: () => setIsReplyModalOpen(false),
                      shouldAddNewPost: true,
                    });
                  }}
                  onClickDelete={() => handleDeleteReply(reply._id)}
                  onReplyUpdated={(updated) => replaceEditedPost(updated)}
                />
              </div>
            );
          })}

          {/* For fetch on scroll */}
          {!!replies.length && <div ref={lastReplyRef} />}

          {/* Post-grill Q9: a failed replies page is visible and
              retryable — it used to silently truncate the thread. */}
          {repliesLoading === "failed" && (
            <div className="mt-3 flex items-center justify-between rounded-10px bg-elevation-1 p-3 text-sm font-medium text-white">
              <span>Couldn’t load replies.</span>
              <button
                onClick={() => fetchReplies()}
                className="ml-3 font-semibold text-brand-primary hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {(!posts || !posts.length) && (
            <div>
              <NoPostMessage message="The post does not exist." />
              {/* Q19: give the visitor a way forward, not a dead end. */}
              <div className="mt-3 text-center">
                <Link
                  href={AppRoutes.feed.index}
                  className="text-sm font-semibold text-brand-primary hover:underline"
                >
                  Go to feed
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {(postLoading === "loading" || postLoading === "idle") && (
        <SinglePostCardSkeleton />
      )}

      {postLoading === "failed" && (
        <div>
          <NoPostMessage message="Something went wrong!" />
          {/* Q9: the failure state carries its own retry — the only
              escape used to be a manual reload the UI never suggested. */}
          <div className="mt-3 text-center">
            <button
              onClick={() => fetchPost(!!loggedInUser)}
              className="text-sm font-semibold text-brand-primary hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {isReplyModalOpen && loggedInUser && (
        <PostEditorModal modalTitle="Reply" user={loggedInUser} />
      )}
    </>
  );
};

SinglePostPage.getLayout = (page) => {
  return (
    <FeedPagesWrapper>
      <div className={`mx-auto w-full`}>{page}</div>
    </FeedPagesWrapper>
  );
};

export default SinglePostPage;
