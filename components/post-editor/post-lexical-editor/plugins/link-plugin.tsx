import { TextNode } from "lexical";
import { useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalTextEntity } from "@lexical/react/useLexicalTextEntity";
import isURL from "validator/lib/isURL";
import { $createLinkNode, LinkNode } from "../nodes/link-node";

const REGEX = /(^|\s)(?:https?:\/\/)?[^\s]+\.[^\s]+/;

export function LinkPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([LinkNode])) {
      throw new Error("LinkPlugin: LinkNode not registered on editor");
    }
  }, [editor]);

  const createLinkNode = useCallback((textNode: TextNode): LinkNode => {
    const linkNode = $createLinkNode(
      textNode.getTextContent(),
      textNode.getTextContent()
    );
    return linkNode;
  }, []);

  const getLinkMatch = useCallback((text: string) => {
    const matchArr = REGEX.exec(text);

    if (matchArr === null) {
      return null;
    }

    const possibleUrl = matchArr[0].trim();
    const possibleWhitespace = matchArr[1];

    if (!isURL(possibleUrl)) {
      return null;
    }

    const linkLength = matchArr[0].length - possibleWhitespace.length;
    const startOffset = matchArr.index + possibleWhitespace.length;
    const endOffset = startOffset + linkLength;

    return {
      end: endOffset,
      start: startOffset,
    };
  }, []);

  useLexicalTextEntity<LinkNode>(getLinkMatch, LinkNode, createLinkNode);

  return null;
}
