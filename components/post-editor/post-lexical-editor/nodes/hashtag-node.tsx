import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
} from "lexical";
import { $applyNodeReplacement, TextNode } from "lexical";
import { addClassNamesToElement } from "@lexical/utils";

function convertHashtagElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createHashtagNode(textContent);
    return {
      node,
    };
  }

  return null;
}

export class HashtagNode extends TextNode {
  static getType(): string {
    return "hashtag";
  }

  static clone(node: HashtagNode): HashtagNode {
    return new HashtagNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.hashtag);
    element.setAttribute("data-lexical-hashtag", "true");
    return element;
  }

  static importJSON(serializedNode: SerializedTextNode): HashtagNode {
    const node = $createHashtagNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: "hashtag",
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-hashtag", "true");
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-hashtag")) {
          return null;
        }
        return {
          conversion: convertHashtagElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }
}

/**
 * Generates a HashtagNode, which is a string following the format of a # followed by some text, eg. #lexical.
 * @param text - The text used inside the HashtagNode.
 * @returns - The HashtagNode with the embedded text.
 */
export function $createHashtagNode(text = ""): HashtagNode {
  return $applyNodeReplacement(new HashtagNode(text));
}

/**
 * Determines if node is a HashtagNode.
 * @param node - The node to be checked.
 * @returns true if node is a HashtagNode, false otherwise.
 */
export function $isHashtagNode(
  node: LexicalNode | null | undefined
): node is HashtagNode {
  return node instanceof HashtagNode;
}
