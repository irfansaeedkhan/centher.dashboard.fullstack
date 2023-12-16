import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import clsx from "clsx";
import { EditorState } from "draft-js";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import Editor from "@draft-js-plugins/editor";
import { MentionData } from "@draft-js-plugins/mention";
import createHashtagPlugin from "@draft-js-plugins/hashtag";
import { EntryComponentProps } from "@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry";
import createEmojiPlugin from "@draft-js-plugins/emoji";
import "@draft-js-plugins/hashtag/lib/plugin.css";
import "@draft-js-plugins/emoji/lib/plugin.css";
import "draft-js/dist/Draft.css";
import useUser from "@/hooks/use.user";
import { useNewPostStore } from "@/store/new.post.store";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { axiosApiCenther } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import cn from "@/utils/cn";
import mentionsStyles from "./mentions-styles.module.css";
import PostPreview from "../post.preview";
import { FilesPreview } from "../files.preview";
import { GrEmoji } from "react-icons/gr";

export const PostEditor: React.FC = () => {
  const { user } = useUser();
  const scrollRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor>(null);
  const {
    posts,
    setPostText,
    removePost,
    nonCitizenUserPostText,
    editorState,
    setEditorState,
  } = useNewPostStore();

  const [mentions, setMentions] = useState<MentionData[]>([]);
  const ref = useRef<Editor>(null);

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);

  const { plugins, MentionSuggestions, EmojiSuggestions, EmojiSelect } =
    useMemo(() => {
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

  const handleSearchQueryInput = async (value: string) => {
    await axiosApiCenther
      .get(`/api/socials/posts/mention?q=${value}&limit=5&offset=0`, {})
      .then((res) => {
        setMentions(res?.data?.mention_users);
        let mentionData: MentionData[] = new Array();
        for (let i = 0; i < res?.data?.mention_users.length; i++) {
          mentionData.push({
            name: res?.data?.mention_users[i].display_name,
            avatar: res?.data?.mention_users[i].profile_image,
            id: res?.data?.mention_users[i]._id,
          });
        }
        setSuggestions(defaultSuggestionsFilter(value, mentionData));
        setMentions(mentionData);
      })
      .catch((e) => {
        customLog(["development", "staging"], e);
      });
  };

  const onChange = useCallback(
    (_editorState: EditorState) => {
      const textValue = _editorState.getCurrentContent().getPlainText("");
      setPostText(textValue);
      setEditorState(_editorState);
    },

    [setPostText, setEditorState]
  );

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(({ value }: { value: string }) => {
    handleSearchQueryInput(value);
  }, []);

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

  const handleBeforeInput = (value: string) => {
    const textLength = editorState.getCurrentContent().getPlainText().length;
    if (
      value &&
      user?.membership.status !== "citizen" &&
      textLength >= nonCitizenUserPostText
    ) {
      return "handled";
    }
    return "not-handled";
  };

  useEffect(() => {
    const editorElement = editorRef.current?.editor?.editor;
    if (editorElement) {
      const handlePaste = (e: any) => {
        const pastedText = e.clipboardData.getData("text");
        if (pastedText.startsWith("@")) {
          handleSearchQueryInput(pastedText);
        }
      };

      editorElement.addEventListener("paste", handlePaste);

      return () => {
        // Remove the event listener when the component unmounts
        editorElement.removeEventListener("paste", handlePaste);
      };
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
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
            `text-14px font-semibold text-white`,
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
          <PostPreview key={post.uuid} post={post} removePost={removePost} />
        ))}

        {lastPost && (
          <div>
            <FilesPreview media={lastPost.media} />

            <div
              className={`scrollSet fsm:text-14px rich-editor-placeholder word-break block min-h-[88px] w-full resize-none overflow-y-auto break-words rounded-10px border-none bg-background-shade-3 px-4 py-3.5 text-xs font-medium leading-6 text-white outline-none focus:ring-0`}
              onClick={() => {
                ref.current!.focus();
              }}
            >
              <Editor
                editorKey={"editor"}
                onChange={onChange}
                plugins={plugins}
                ref={ref}
                editorState={editorState}
                placeholder="Type here"
                spellCheck={true}
                handleBeforeInput={handleBeforeInput}
              />

              <MentionSuggestions
                open={open}
                onOpenChange={onOpenChange}
                suggestions={suggestions}
                onSearchChange={onSearchChange}
                entryComponent={Entry}
              />
            </div>
            <div
              className={cn(
                "absolute bottom-[60px] left-[154px] z-50 flex h-10 w-[62px] items-center justify-center rounded-full bg-white fsm:bottom-[12px] fsm:left-[335px]"
                // modalType === "edit" && "left-6"
              )}
              onClick={() => {
                ref.current!.focus();
              }}
            >
              <GrEmoji className="h-6 w-6" />
            </div>

            <div
              className={cn(
                "custom-emoji absolute bottom-[60px] left-[154px] z-[60] fsm:bottom-[14px] fsm:left-[335px]"
                // modalType === "edit" && "left-6"
              )}
              onClick={() => {
                ref.current!.focus();
              }}
            >
              <EmojiSuggestions />

              <EmojiSelect />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Entry(props: EntryComponentProps): ReactElement {
  const { mention, theme, searchValue, isFocused, ...parentProps } = props;

  return (
    <div {...parentProps}>
      <div className="flex w-full flex-row items-center gap-4 fsm:px-6">
        <div
          className="flex
         items-center gap-3"
        >
          <Image
            src={mention.avatar || ""}
            className="h-[36px] w-[36px] rounded-full object-cover fsm:h-[38px] fsm:w-[38px]"
            alt={mention.name}
            width={38}
            height={38}
            sizes="256px"
          />
        </div>

        <div className="text-12px font-semibold text-white">
          {mention.name.length > 12
            ? mention.name.slice(0, 6) +
              "..." +
              mention.name.slice(mention.name.length - 4, mention.name.length)
            : mention.name}
        </div>
      </div>
    </div>
  );
}
