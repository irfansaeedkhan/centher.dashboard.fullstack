export interface IModalHandler {
  visibility: boolean;
  title?: string;
  content?: any;
  [key: string]: any;
}

export type TemplateCollection = { [key: string]: IModalHandler };
