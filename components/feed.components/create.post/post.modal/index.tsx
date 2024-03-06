import React, { useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import createEmojiPlugin from "@draft-js-plugins/emoji";
import createHashtagPlugin from "@draft-js-plugins/hashtag";
import createMentionPlugin from "@draft-js-plugins/mention";
import "@draft-js-plugins/emoji/lib/plugin.css";
import useUser from "@/hooks/use.user";
import { useNewPostStore } from "@/store/new.post.store";
import { PostModalContainer } from "./post.modal.container";
import { PostEditor } from "./post.editor/post.editor";
import mentionsStyles from "./postmodal.module.css";

interface Props {
  modalTitle: string;
}

export const PostModal: React.FC<Props> = ({ modalTitle }) => {
  const { user } = useUser();
  const scrollRef = useRef<HTMLTextAreaElement>(null);
  const { isModalOpen, posts } = useNewPostStore(
    useShallow((state) => ({
      isModalOpen: state.isModalOpen,
      posts: state.posts,
    }))
  );
  const { closeModal } = useNewPostStore(useShallow((state) => state.actions));

  const lastPost = useMemo(() => {
    return posts.at(-1);
  }, [posts]);

  const emojiPlugin = createEmojiPlugin();

  const hasMedia = useMemo(() => {
    return (
      lastPost &&
      (!!lastPost.media.length ||
        !!lastPost.media.filter((f) => f.type === "edit" && !f.isDeleted)
          .length)
    );
  }, [lastPost]);

  const { EmojiSuggestions, EmojiSelect } = useMemo(() => {
    const hashtagPlugin = createHashtagPlugin();
    const mentionPlugin = createMentionPlugin({
      entityMutability: "IMMUTABLE",
      theme: mentionsStyles,
      mentionPrefix: "@",
      supportWhitespace: true,
    });
    const { MentionSuggestions } = mentionPlugin;
    const emojiPlugin = createEmojiPlugin();
    const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
    const plugins = [hashtagPlugin, mentionPlugin, emojiPlugin];
    return {
      plugins,
      MentionSuggestions,
      hashtagPlugin,
      EmojiSuggestions,
      EmojiSelect,
    };
  }, []);

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
        emojiPlugin={emojiPlugin}
        EmojiSuggestions={EmojiSuggestions}
        EmojiSelect={EmojiSelect}
      >
        <PostEditor />
      </PostModalContainer>
    </div>
  );
};
