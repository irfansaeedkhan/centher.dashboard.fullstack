"use client";
import React, { useCallback } from "react";
import { $getRoot, LexicalEditor } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useShallow } from "zustand/react/shallow";
import { usePostEditorStore } from "@/store/post-editor-store";
import cn from "@/utils/cn";
import { EditorRefPlugin } from "./plugins/editor-ref-plugin";
import { CommandsPlugin } from "./plugins/commands-plugin";
import { MentionsPlugin } from "./plugins/mention-plugin";
import { HashtagPlugin } from "./plugins/hashtag-plugin";
import { LinkPlugin } from "./plugins/link-plugin";
import { MentionNode } from "./nodes/mention-node";
import { HashtagNode } from "./nodes/hashtag-node";
import { LinkNode } from "./nodes/link-node";

interface BaseProps {
  postUUID: string;
  className?: string;
}

type Props = BaseProps;

export const PostLexicalEditor: React.FC<Props> = React.memo(
  ({ postUUID, className }) => {
    const lastActivePostUUID = usePostEditorStore(
      useShallow((state) => state.lastActivePostUUID)
    );

    const { setTextContentLength, setEditorRef } = usePostEditorStore(
      useShallow((state) => state.actions)
    );

    const editorRef = useCallback(
      (editor: LexicalEditor) => {
        setEditorRef(postUUID, editor);
      },
      [postUUID, setEditorRef]
    );

    return (
      <div className={cn(className)}>
        <LexicalComposer
          initialConfig={{
            namespace: postUUID,
            theme: {
              hashtag: "text-gradient",
              text: {
                underline: "underline",
                bold: "font-bold",
                italic: "italic",
              },
              mention: "text-gradient",
              link: "text-gradient break-all",
            },
            onError: (error: any) => {
              console.error(error);
            },
            nodes: [MentionNode, HashtagNode, LinkNode],
          }}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="fsm:text-14px min-h-24 text-xs font-medium text-white focus:outline-none" />
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            ignoreSelectionChange={true}
            ignoreHistoryMergeTagChange={true}
            onChange={(editorState) => {
              editorState.read(() => {
                const rootNode = $getRoot();
                setTextContentLength(
                  postUUID,
                  rootNode.getTextContent().trim().length === 0
                    ? 0
                    : rootNode.getTextContent().length
                );
              });
            }}
          />
          {lastActivePostUUID === postUUID ? <AutoFocusPlugin /> : <></>}
          <HistoryPlugin />
          <EditorRefPlugin editorRef={editorRef} />
          <CommandsPlugin />
          <MentionsPlugin />
          <HashtagPlugin />
          <LinkPlugin />
        </LexicalComposer>
      </div>
    );
  }
);

PostLexicalEditor.displayName = "PostLexicalEditor";
