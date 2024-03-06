import React, { useMemo } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { ArchivedPost, CompletedPost } from "@/models/post";
import cn from "@/utils/cn";

interface Props {
  post: CompletedPost | ArchivedPost;
}

export const PostTextContent: React.FC<Props> = ({ post }) => {
  const postContent = useMemo(() => {
    const post_content: PostContent = [];

    // Use a recursive function to add all the nodes to the post
    const addNodesToData = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.children) {
          addNodesToData(node.children);
        }
        // Add the node to the post
        switch (node.type) {
          case "text":
            post_content.push({
              id: uuidv4(),
              type: "text",
              format: node.format,
              version: node.version,
              text: node.text,
            });
            break;
          case "hashtag":
            post_content.push({
              id: uuidv4(),
              type: "hashtag",
              format: node.format,
              text: node.text,
              version: node.version,
            });
            break;
          case "mention":
            post_content.push({
              id: uuidv4(),
              type: "mention",
              format: node.format,
              user_id: node.user_id,
              text: node.text,
              version: node.version,
            });
            break;
          case "link":
            post_content.push({
              id: uuidv4(),
              type: "link",
              format: node.format,
              text: node.text,
              url: node.url,
              version: node.version,
            });
            break;
          case "paragraph":
          case "linebreak":
            post_content.push({
              id: uuidv4(),
              type: "linebreak",
              version: node.version,
            });
            break;
          case "tab":
            post_content.push({
              id: uuidv4(),
              type: "tab",
              version: node.version,
            });
            break;
        }
      });
    };

    addNodesToData(post.post_editor_state.root.children);

    return post_content;
  }, [post.post_editor_state]);

  return (
    <div
      className={cn(
        `select-none text-sm text-app-post-text`,
        post.media && post.media.length > 0 ? "mt-3" : "mt-2"
      )}
    >
      {postContent.map((node) => {
        switch (node.type) {
          case "linebreak":
            return <br key={node.id} />;
          case "tab":
            return (
              <span
                key={node.id}
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: "\t" }}
              />
            );
          case "text":
            return (
              <span
                key={node.id}
                className={cn(
                  "break-words",
                  isBold(node.format) && "font-bold",
                  isItalic(node.format) && "italic",
                  isUnderline(node.format) && "underline"
                )}
                data-lexical-text="true"
              >
                {node.text}
              </span>
            );
          case "link":
            const isSameOrigin =
              new URL(node.url).host === window.location.host;
            return (
              <Link
                key={node.id}
                href={node.url}
                className="text-gradient break-words"
                target={!isSameOrigin ? "_blank" : undefined}
                rel={!isSameOrigin ? "noopener noreferrer nofollow" : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span data-lexical-link="true" data-lexical-url={node.url}>
                  {node.text}
                </span>
              </Link>
            );
          case "hashtag":
            return (
              <span
                key={node.id}
                className="text-gradient break-words"
                data-lexical-hashtag="true"
              >
                {node.text}
              </span>
            );
          case "mention":
            return (
              <Link
                key={node.id}
                href={`/profile/${encodeURIComponent(node.user_id)}`}
                className="text-gradient break-words"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span
                  data-lexical-mention="true"
                  data-lexical-user-id={node.user_id}
                >
                  {node.text}
                </span>
              </Link>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

interface Node {
  id: string;
  version: number;
}

interface TextNode extends Node {
  type: "text";
  format: number;
  text: string;
}

interface HashtagNode extends Node {
  type: "hashtag";
  format: number;
  text: string;
}

interface MentionNode extends Node {
  type: "mention";
  format: number;
  user_id: string;
  text: string;
}

interface LinkNode extends Node {
  type: "link";
  format: number;
  url: string;
  text: string;
}

interface LineBreakNode extends Node {
  type: "linebreak";
}

interface TabNode extends Node {
  type: "tab";
}

export type PostContent = (
  | TextNode
  | HashtagNode
  | MentionNode
  | LinkNode
  | LineBreakNode
  | TabNode
)[];

const IS_BOLD = 1; // 1
const IS_ITALIC = 1 << 1; // 2
const IS_UNDERLINE = 1 << 3; // 8

// Check if format is bold, italic, or underline or a combination of them
const isBold = (format: number) => (format & IS_BOLD) === IS_BOLD;
const isItalic = (format: number) => (format & IS_ITALIC) === IS_ITALIC;
const isUnderline = (format: number) =>
  (format & IS_UNDERLINE) === IS_UNDERLINE;
