export type safeNameType<T = string> = {
  name: T;
  [key: string]: any;
};
