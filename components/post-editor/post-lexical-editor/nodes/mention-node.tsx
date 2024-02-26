import type {
  Spread,
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

export type SerializedMentionNode = Spread<
  {
    user_id: string;
  },
  SerializedTextNode
>;

function convertMentionElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const userId = domNode.getAttribute("data-lexical-user-id");

  if (userId !== null && textContent !== null) {
    const node = $createMentionNode(userId, textContent);
    return {
      node,
    };
  }

  return null;
}

export class MentionNode extends TextNode {
  __user_id: string;

  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__user_id, node.__text, node.__key);
  }

  constructor(user_id: string, display_name: string, key?: NodeKey) {
    super(
      display_name.startsWith("@") ? display_name : `@${display_name}`,
      key
    );
    this.__user_id = user_id;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.mention);
    element.setAttribute("data-lexical-mention", "true");
    element.setAttribute("data-lexical-user-id", this.__user_id);
    return element;
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(
      serializedNode.user_id,
      serializedNode.text
    );
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      user_id: this.__user_id,
      type: this.getType(),
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-mention", "true");
    element.setAttribute("data-lexical-user-id", this.__user_id);
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (
          !domNode.hasAttribute("data-lexical-mention") ||
          !domNode.hasAttribute("data-lexical-user-id")
        ) {
          return null;
        }
        return {
          conversion: convertMentionElement,
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

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode(
  user_id: string,
  display_name: string
): MentionNode {
  const mentionNode = new MentionNode(user_id, display_name);
  mentionNode.setMode("segmented").toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode;
}
