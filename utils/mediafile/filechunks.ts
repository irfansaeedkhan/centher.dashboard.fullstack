//Defining chunks to
export type FileChunks = {
  Part: number;
  Starting: number;
  Ending: number;
};

//Buffer file size
export type FileChunksDetails = {
  chunks_range: FileChunks[];
  no_of_chunks: number;
};

//Default buffer size that will be created
export const defaultBufferSize: number = 10 * 1024 * 1024 + 1000;

//Minimum buffer size that need to be created for multipart upload
export const awsMinBufferSize: number = 5242880;

//Function for calculating ChunkSizes
export const calculateFileChunksSizes = (
  file_size: number
): FileChunksDetails => {
  //
  let chunks_range: Array<FileChunks> = [];

  //Checking No of chunks that will be created
  let no_of_chunks = Math.ceil(file_size / defaultBufferSize);

  //
  if (no_of_chunks == 1 && file_size < defaultBufferSize) {
    //If file size is less than buffer size then only one upload
    chunks_range.push({
      Part: 1,
      Starting: 0,
      Ending: file_size,
    });
    return { chunks_range, no_of_chunks };
  }

  //Checking for remaing bytes
  let remaing_bytes_after_buffer: number = file_size % defaultBufferSize;

  let merge_last_bytes: boolean = false;

  //
  if (remaing_bytes_after_buffer <= awsMinBufferSize) {
    //Need to merge
    merge_last_bytes = true;
    no_of_chunks -= 1;
  }

  let bytes_uploaded: number = 0;
  for (let chunk = 0; chunk < no_of_chunks; chunk++) {
    //TO DO : Remove initialStartCaraible
    //let initialStart:number = chunk==0? 0:0
    let remaingBytes = file_size - bytes_uploaded;
    if (remaingBytes < defaultBufferSize) {
      chunks_range.push({
        Part: chunk + 1,
        Starting: bytes_uploaded,
        Ending: file_size,
      });
    } else {
      chunks_range.push({
        Part: chunk + 1,
        Starting: bytes_uploaded,
        Ending: bytes_uploaded + defaultBufferSize,
      });
    }

    bytes_uploaded += defaultBufferSize;
  }

  //If Need to merge last then merging
  if (merge_last_bytes) {
    //Need to merge
    chunks_range[chunks_range.length - 1].Ending = file_size;
  }

  return { chunks_range, no_of_chunks };
};
