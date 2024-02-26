import type {
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
} from "lexical";
import { $applyNodeReplacement, TextNode } from "lexical";
import { addClassNamesToElement } from "@lexical/utils";

export type SerializedLinkNode = Spread<
  {
    url: string;
  },
  SerializedTextNode
>;

export class LinkNode extends TextNode {
  __url: string;

  static getType(): string {
    return "link";
  }

  static clone(node: LinkNode): LinkNode {
    return new LinkNode(node.__url, node.__text, node.__key);
  }

  constructor(url: string, text?: string, key?: NodeKey) {
    super(text ?? url, key);
    this.__url = this.formatURL(url);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.link);
    element.setAttribute("data-lexical-link", "true");
    element.setAttribute("data-lexical-url", this.__url);
    return element;
  }

  updateDOM(
    prevNode: TextNode,
    dom: HTMLElement,
    config: EditorConfig
  ): boolean {
    const didUpdate = super.updateDOM(prevNode, dom, config);
    this.setURL(this.getLatest().__text);
    dom.setAttribute("data-lexical-url", this.getLatest().__url);
    return didUpdate;
  }

  static importJSON(serializedNode: SerializedLinkNode): LinkNode {
    const node = $createLinkNode(serializedNode.url, serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedLinkNode {
    return {
      ...super.exportJSON(),
      type: "link",
      url: this.__url,
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("a");
    element.textContent = this.__text;
    element.setAttribute("href", this.__url);
    element.setAttribute("data-lexical-link", "true");
    element.setAttribute("data-lexical-url", this.__url);
    return { element };
  }

  private formatURL(url: string): string {
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `http://${url}`;
  }

  private setURL(url: string): void {
    this.getWritable().__url = this.formatURL(url);
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }
}

export function $createLinkNode(url: string, text?: string): LinkNode {
  return $applyNodeReplacement(new LinkNode(url, text));
}

export function $isLinkNode(
  node: LexicalNode | null | undefined
): node is LinkNode {
  return node instanceof LinkNode;
}
