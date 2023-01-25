import { safeNameType } from "./safe.file.wrapper.interface";

export interface IUploader<T = any, K = any> {
  upload: (input: T) => Promise<K>;
  makePath: (nameWrapper: safeNameType, extention?: string) => string;
}
