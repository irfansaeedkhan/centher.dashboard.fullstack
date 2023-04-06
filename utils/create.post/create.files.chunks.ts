import { FileWithID } from "@/store/new.post.store";

export type FileChunk = {
  Part: number;
  Starting: number;
  Ending: number;
};

export type FileChunksData = {
  file_name: string;
  file_size: number;
  file_type: string;
  no_of_chunks: number;
  index_of_file: number;
  chunks_range: FileChunk[];
};

export const createFilesChunks = (files: FileWithID[]): FileChunksData[] => {
  // const filesChunksData: FileChunksData[] = [];

  // for (let i = 0; i < files.length; i++) {
  //   let { chunks_range, no_of_chunks } = calculateFileChunksSize(
  //     files[i].original.size
  //   );

  //   filesChunksData.push({
  //     file_name: files[i].original.name,
  //     file_size: files[i].original.size,
  //     file_type: files[i].original.type,
  //     no_of_chunks: no_of_chunks,
  //     index_of_file: i,
  //     chunks_range: chunks_range,
  //   });
  // }

  // return filesChunksData;
  return [];
};

// Default buffer size that will be created
export const defaultBufferSize = 10 * 1024 * 1024 + 1000; // 10MB + 1000 bytes

// Minimum buffer size that need to be created for multipart upload
export const awsMinBufferSize = 5242880; // 5MB

export const calculateFileChunksSize = (
  fileSize: number
): Pick<FileChunksData, "chunks_range" | "no_of_chunks"> => {
  // const chunks_range: FileChunk[] = [];

  // // Calculate number of chunks that will be created
  // let no_of_chunks = Math.ceil(fileSize / defaultBufferSize);

  // if (no_of_chunks == 1 && fileSize < defaultBufferSize) {
  //   // If file size is less than buffer size then there will be only one chunk to upload
  //   chunks_range.push({
  //     Part: 1,
  //     Starting: 0,
  //     Ending: fileSize,
  //   });
  //   return { chunks_range, no_of_chunks };
  // }

  // // Calculate remaining bytes
  // const remainingBytesAfterBuffer = fileSize % defaultBufferSize;

  // let mergeLastByte = false;

  // if (remainingBytesAfterBuffer <= awsMinBufferSize) {
  //   // Need to merge
  //   mergeLastByte = true;
  //   no_of_chunks -= 1;
  // }

  // let bytesUploaded: number = 0;
  // for (let chunk = 0; chunk < no_of_chunks; chunk++) {
  //   let remainingBytes = fileSize - bytesUploaded;
  //   if (remainingBytes < defaultBufferSize) {
  //     chunks_range.push({
  //       Part: chunk + 1,
  //       Starting: bytesUploaded,
  //       Ending: fileSize,
  //     });
  //   } else {
  //     chunks_range.push({
  //       Part: chunk + 1,
  //       Starting: bytesUploaded,
  //       Ending: bytesUploaded + defaultBufferSize,
  //     });
  //   }

  //   bytesUploaded += defaultBufferSize;
  // }

  // // If needed, merge the last bytes
  // if (mergeLastByte) {
  //   chunks_range[chunks_range.length - 1].Ending = fileSize;
  // }

  // return { chunks_range, no_of_chunks };

  return { chunks_range: [], no_of_chunks: 0 };
};
