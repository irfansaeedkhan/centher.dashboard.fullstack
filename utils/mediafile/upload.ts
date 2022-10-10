import { FileChunksDetails } from "./filechunks";

let texthello = "";

export const CompleteFileUpload = async () => {
  //console.log(texthello)
};

export const UploadFileChunks = async () => {
  //console.log(texthello)
  CompleteFileUpload();
};

export const UploadFiles = async (
  filesListArray: FileList[],
  fileChunks: FileChunksDetails[]
) => {
  UploadFileChunks();
  //texthello = 'hello'
};
