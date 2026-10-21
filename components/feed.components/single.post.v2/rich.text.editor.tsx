"use client";
import React, { useId } from "react";
import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { MentionNode } from "@/components/post-editor/post-lexical-editor/nodes/mention-node";
import { HashtagNode } from "@/components/post-editor/post-lexical-editor/nodes/hashtag-node";
import { LinkNode } from "@/components/post-editor/post-lexical-editor/nodes/link-node";
import { MentionsPlugin } from "@/components/post-editor/post-lexical-editor/plugins/mention-plugin";
import { HashtagPlugin } from "@/components/post-editor/post-lexical-editor/plugins/hashtag-plugin";
import { LinkPlugin } from "@/components/post-editor/post-lexical-editor/plugins/link-plugin";
import cn from "@/utils/cn";

interface Props {
  /** The STORED editor state the edit starts from — never plain text. */
  initialState: SerializedEditorState<SerializedLexicalNode>;
  onChange: (state: SerializedEditorState<SerializedLexicalNode>) => void;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Post-grill Q10/Q11: a standalone rich editor for EDIT flows, seeded
 * from the stored Lexical state (same nodes/theme/plugins as the
 * create composer). The old edit paths seeded from `text_content` and
 * saved `{ text }`, so a single typo fix irreversibly flattened
 * mentions, links, and formatting into one plain paragraph. Editing
 * the real state means an edit changes only what the user changed.
 */
export const RichTextInlineEditor: React.FC<Props> = ({
  initialState,
  onChange,
  autoFocus = true,
  className,
}) => {
  const namespace = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <div className={cn(className)}>
      <LexicalComposer
        initialConfig={{
          namespace: `edit-${namespace}`,
          editorState: JSON.stringify(initialState),
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
            onChange(
              editorState.toJSON() as SerializedEditorState<SerializedLexicalNode>
            );
          }}
        />
        {autoFocus && <AutoFocusPlugin />}
        <HistoryPlugin />
        <MentionsPlugin />
        <HashtagPlugin />
        <LinkPlugin />
      </LexicalComposer>
    </div>
  );
};
