import { LexicalEditor } from "lexical";
import { PostMedia } from "@/models/post";

export interface MediaFileNew {
  type: "new";
  uuid: string;
  post_uuid: string;
  original: File;
  index: number;
}

export interface MediaFileEdit {
  type: "edit";
  uuid: string;
  original: PostMedia;
  isDeleted: boolean;
}

export type MediaFile = MediaFileNew | MediaFileEdit;

export interface IEditorPost {
  uuid: string;
  text_content_length: number;
  media: MediaFile[];
  editorRef: LexicalEditor | null;
}

interface SelectedFileNew {
  type: "new";
  original: File;
}

interface SelectedFileEdit {
  type: "edit";
  original: PostMedia;
}

export type SelectedFile = SelectedFileNew | SelectedFileEdit;
