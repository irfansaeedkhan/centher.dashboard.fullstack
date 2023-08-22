export interface IUploader<T = any, K = any> {
  upload: (
    input: T,
    statusController?: (progress: number) => void
  ) => Promise<K>;
  makePath: (extention?: string) => string;
  generateName: () => string;
}
