// React, Next, NPM Packages
import { useState } from "react";
import Image from "next/future/image";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import {
  checkValidImageFile,
  checkValidVideoFile,
  checkFileAlreadyAddedInSelectedFile,
  post_file_details,
  FileChunksChunksCalculations,
} from "@/utils/mediafile/valid.media.files";
import { Post } from "@/models/post";
import {
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_IMAGE_TYPES,
} from "@/constants/supported.media.type";

type PreviewSelectedFile = {
  fileListIndex: number;
  fileIndex: number;
  fileType: string;
  fileBlobURL: string;
};

interface PostUploadOptions {
  onPostCreated?: (post: Post) => void;
  reply?: boolean;
  reply_address?: string;
  reply_post_id?: string;
}

export function usePostUpload({
  reply = false,
  reply_address = "",
  reply_post_id = "",
  onPostCreated,
}: PostUploadOptions) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState(false);
  const [lastItem, setLastItem] = useState<number>();
  //It will store list of files selected by the user
  // const [userSelectedFileListArray, setuserSelectedFileListArray] = useState<
  //   FileList[]
  // >([]);

  const [userSelectedFileListArray, setuserSelectedFileListArray] = useState<
    FileList[]
  >([]);

  //TODO: Remove
  const [selectedFileDetail, setselectedFileDetail] = useState(
    Array<FileChunksChunksCalculations>
  );

  const [deletedFileIndexs, setDeletedFileIndex] = useState<string[]>([]);

  const [previewFilesUI, setpreviewFilesUI] = useState(Array<JSX.Element>);

  const [tweetText, setweetText] = useState<string>("");

  const [disablePostButton, setdisablePostButton] = useState<boolean>(false);

  let currentPostID: string = "";

  let previewFileList: Array<PreviewSelectedFile> = [];

  const closePostModel = () => {
    try {
      setShowModal(false);
      setuserSelectedFileListArray([]);
      setselectedFileDetail([]);
      setDeletedFileIndex([]);
      setweetText("");
      setpreviewFilesUI([]);
      currentPostID = "";
      previewFileList = [];
    } catch (error) {
      console.log("Failed to close");
    }
  };

  // function to set max value of text
  const handleTextLength = (e: any) => {
    var box: HTMLElement | null = document.getElementById("trashRect");
    if (box) {
      box.style.transform = `translateY(${
        -(e.target.value.length * 100) / 200 + 100
      }%)`;
      if ((e.target.value.length * 100) / 200 > 80) {
        box.style.fill = `#E03434`;
      } else {
        box.style.fill = `#FEBF32`;
      }
      setweetText(e.target.value);
    }
  };

  const CompleteMultipartUpload = async (
    FileListDetails: Array<FileChunksChunksCalculations>,
    file_index: number
  ) => {
    try {
      await axiosNodeApi.post("/api/socials/posts-media/complete", {
        post_id: currentPostID,
        file_index: file_index,
      });
      console.log("Uploading new file : ", file_index);
      await UploadFiles(FileListDetails, file_index + 1);
    } catch (error) {
      console.log("Failed to complete upload : ", error);
    }
  };

  const UploadChunks = async (
    filesChunksDetails: Array<FileChunksChunksCalculations>,
    uploading_file_index: number,
    chunk_index: number
  ) => {
    try {
      if (
        chunk_index >=
        filesChunksDetails[uploading_file_index].chunks_range.length
      ) {
        console.log("File upload complete ");
        return;
      }

      //Creating reader object for reading file
      let fileReader = new FileReader();

      let file_details = filesChunksDetails[uploading_file_index];

      let starting = file_details.chunks_range[chunk_index].Starting;

      let ending = file_details.chunks_range[chunk_index].Ending;

      let fileList_index = file_details.index_of_file_list;

      let fileIndex = file_details.index_of_file;

      let blob = userSelectedFileListArray[fileList_index][fileIndex].slice(
        starting,
        ending
      );

      //Onload
      fileReader.onloadend = async function (event: any) {
        try {
          if (event?.target?.readyState !== FileReader.DONE) {
            console.log("File reading complete");
            return;
          }

          //Storing data
          let dataRead = event?.target?.result;

          console.log("Data Read : ", dataRead);

          let header = {
            headers: {
              "Content-Type": "application/octet-stream",
              "post-details": JSON.stringify({
                chunk_no: chunk_index,
                post_id: currentPostID,
                file_index: uploading_file_index,
              }),
              "Content-Range":
                "bytes " +
                starting +
                "-" +
                ending +
                "/" +
                file_details.file_size,
            },
          };

          await axiosNodeApi
            .post("/api/socials/posts-media/upload", dataRead, header)
            .then((image_upload_result) => {
              console.log("Chunk uploaded success fully");
              //Checking all chunks are uploaded
              console.log(
                file_details,
                "\n ",
                file_details.chunks_range,
                file_details.chunks_range.length,
                chunk_index
              );
              if (file_details.chunks_range.length - 1 == chunk_index) {
                console.log("File upload complete");
                //All chunks are uploaded now need to upload new file
                CompleteMultipartUpload(
                  filesChunksDetails,
                  uploading_file_index
                );
              } else {
                console.log("Uploading chunks");
                //Upload Next Chunk
                UploadChunks(
                  filesChunksDetails,
                  uploading_file_index,
                  chunk_index + 1
                );
              }
            });
        } catch (error) {
          console.log("Failed to upload data to : ", error);
        }
      };

      //
      fileReader.readAsArrayBuffer(blob);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const UploadFiles = async (
    filesChunksDetails: Array<FileChunksChunksCalculations>,
    uploading_file_index: number
  ) => {
    try {
      console.log(
        "File chunks details : ",
        filesChunksDetails,
        filesChunksDetails.length,
        uploading_file_index
      );
      if (uploading_file_index >= filesChunksDetails.length) {
        // TODO: Checking if file list
        console.log("File Upload complete show message ");

        await getNewPostAndUpdateState();

        // Close Post Modal on successful upload
        closePostModel();
        return;
      }

      await UploadChunks(filesChunksDetails, uploading_file_index, 0);
    } catch (error) {
      console.log("Failed to delete post");
    }
  };

  //Function will remove the files created by the user
  const deleteFileIndexs = async (
    fileListIndex: number,
    fileIndex: number,
    previewIndex: string
  ) => {
    try {
      console.log(
        "Delete file index : ",
        fileIndex,
        fileIndex,
        previewIndex,
        "\n Preview : ",
        previewFileList
      );
      //Check if single file in fileList
      let singleFileInArray = false;

      //Checking if only single file
      if (userSelectedFileListArray[fileListIndex].length == 1) {
        singleFileInArray = true;
      }

      if (singleFileInArray) {
        //Removing fileList Object from array
        let updatedFileListArray = await userSelectedFileListArray.filter(
          (value, index) => {
            if (Number(index) == Number(fileListIndex)) {
              return false;
            }
            return true;
          }
        );
        console.log(
          "Removed value from array because no file : ",
          updatedFileListArray
        );

        setuserSelectedFileListArray(updatedFileListArray);
      } else {
        let deleted_file_index: string[] = deletedFileIndexs;
        //If more than one file exists in the fileArray Object then cannot delete single file because it is not allowed
        //so storing this details in different array while creating chunks we will skip this file
        if (
          deleted_file_index.indexOf(
            String(fileListIndex) + "," + String(fileIndex)
          ) == -1
        ) {
          deleted_file_index.push(
            String(fileListIndex) + "," + String(fileIndex)
          );

          //Doesn't exits in the database
          await setDeletedFileIndex(deleted_file_index);
          console.log(
            "Cannot remove file because their is more than one file so adding it "
          );
        }
      }

      //Remove Selected file
      console.log("Before removing file : ", previewFileList);
      let updateFile = await previewFileList.filter((value, index) => {
        console.log(value, "Index ", index, "Delte index ", previewIndex);
        if (Number(index) == Number(previewIndex)) {
          return false;
        }
        return true;
      });

      console.log("After removing file ", updateFile);
      previewFileList = updateFile;

      // If all files are deleted then clearning array
      if (previewFileList.length < 1) {
        //
        console.log("Updating it empty");
        setuserSelectedFileListArray([]);
      }

      await createSelectedFileUI(updateFile);
      return;
    } catch (error) {
      console.log("Error ", error);
    }
  };

  // Function will do the following
  // Calculate Chunks
  // Create entry in database
  // Start uploading it to server
  const createPost = async (event: any): Promise<any> => {
    setLoadingState(true);
    try {
      console.log("Create post function called : ", event);
      console.log("User Selected List array : ", userSelectedFileListArray);

      console.log("Deleted index : ", deletedFileIndexs);
      let filesChunksDetails: Array<FileChunksChunksCalculations> =
        await post_file_details(userSelectedFileListArray, deletedFileIndexs);

      console.log("Calculated chunks : ", filesChunksDetails);
      //Setting details in filesChunksDetails
      setselectedFileDetail(filesChunksDetails);

      console.log("Reply address : ", reply_address, reply_post_id);
      // No need to pass user address
      let { data } = await axiosNodeApi.post(`/api/socials/posts/insert`, {
        post_files_detail: filesChunksDetails,
        post_text: tweetText,
        reply: reply,
        reply_address: reply_address,
        reply_post_id: reply_post_id,
      });

      currentPostID = data.post_id;

      // If no file media that means only text was avaible in post
      if (filesChunksDetails.length == 0) {
        await getNewPostAndUpdateState();
        closePostModel();
        return;
      }

      currentPostID = data.post_id;

      // Starting uploading of task
      await UploadFiles(filesChunksDetails, 0).catch((error) => {
        console.log("Error ", error);
      });
    } catch (error) {
      toast.error("Failed to create post");
    }
  };

  /** Get Newly Created Post and Update State */
  const getNewPostAndUpdateState = async () => {
    try {
      // Get the new post and add it to the top of the post list
      const { data: newPostData } = await axiosNodeApi.get(
        `/api/socials/posts/${currentPostID}`
      );

      onPostCreated && onPostCreated(newPostData.post as Post);
    } catch {
      toast.error("Failed to get new post");
    }
  };

  // delete parent Element while deleting image
  const handleDeleteItemStyling = (e: any) => {
    // dom elements
    let topParent =
      e.target?.parentElement?.parentElement?.parentElement?.parentElement;
    let listParent = e.target?.parentElement?.parentElement?.parentElement;
    let ListItem = e.target?.parentElement?.parentElement;
    // adding transform when last element is deleted
    if (
      listParent.classList.contains("slider") &&
      listParent.lastElementChild == ListItem
    ) {
      if (listParent?.childElementCount == 2) {
        topParent.classList.add("transformChild");
        return;
      }
      let listCount = listParent?.childElementCount - 2;
      listParent.style.transform = `translate3d(-${listCount}00%, 0px, 0px)`;
      setLastItem(listCount);
      console.log("last Item", lastItem);

      // ListItem?.previousSibling?.classList.replace("previous", "selected");
      // ListItem?.previousSibling?.previousSibling?.classList.add("previous");
    }
  };
  // Function will display social media in pop up
  const createSelectedFileUI = (previewUrlList: Array<PreviewSelectedFile>) => {
    try {
      console.log("Preview list : ", previewUrlList);
      //
      let displaySelectedFile: JSX.Element[] = [];

      //let displaySelectedFile: JSX.Element[] = previewFilesUI;

      // Running loop to all the added files
      for (let fileDetails in previewUrlList) {
        // Checking if type is supported video type
        if (
          SUPPORTED_VIDEO_TYPES.includes(previewUrlList[fileDetails].fileType)
        ) {
          displaySelectedFile.push(
            <div className={ImageStyleContainer}>
              <video
                width={452}
                height={312}
                controls
                className={createPostImageStyling}
              >
                <source
                  src={previewUrlList[fileDetails].fileBlobURL}
                  type={previewUrlList[fileDetails].fileType}
                />
              </video>
              <button
                onClick={(e) => {
                  deleteFileIndexs(
                    previewUrlList[fileDetails].fileListIndex,
                    previewUrlList[fileDetails].fileIndex,
                    fileDetails
                  );
                }}
                className={imageDelBtn}
              >
                Delete
              </button>
            </div>
          );
        } else if (
          SUPPORTED_IMAGE_TYPES.includes(previewUrlList[fileDetails].fileType)
        ) {
          // Checking if supported image type
          displaySelectedFile.push(
            <div className={ImageStyleContainer}>
              <Image
                src={previewUrlList[fileDetails].fileBlobURL}
                width={452}
                height={312}
                alt="post media"
                className={createPostImageStyling}
              />
              <button
                onClick={(e) => {
                  deleteFileIndexs(
                    previewUrlList[fileDetails].fileListIndex,
                    previewUrlList[fileDetails].fileIndex,
                    fileDetails
                  );
                  handleDeleteItemStyling(e);
                }}
                className={imageDelBtn}
              >
                x
              </button>
            </div>
          );
        }
      }
      console.log("Display created for image : ", displaySelectedFile);
      // Displaying preview
      setpreviewFilesUI(displaySelectedFile);
    } catch (error) {
      console.log("Failed to create selected ", error);
    }
  };

  const addSelectedFiles = (selected_files: FileList): boolean => {
    try {
      console.log("Add selected file event called!!");
      //TO DO : Remove Selected filed
      let alreadyAddedFileList: Array<FileList> = userSelectedFileListArray;

      console.log("Currently Selected filelist is : ", alreadyAddedFileList);

      // Checking file already exits in selected file or not
      let fileExits: boolean = checkFileAlreadyAddedInSelectedFile(
        alreadyAddedFileList,
        selected_files
      );

      // If file exits
      if (fileExits) {
        console.log(
          "Selected file already exits in the database : ",
          fileExits
        );
        //TO DO : Show error message that file already exits in the selected file
        return false;
      }

      console.log("Already existing files are :  ", alreadyAddedFileList);
      console.log("Selected file : ", selected_files);
      // Pushing FileList to Array of FileList
      alreadyAddedFileList.push(selected_files);
      setuserSelectedFileListArray(alreadyAddedFileList);

      //
      let previewUrlList: Array<PreviewSelectedFile> = [];

      // Creating Blob for and storing in seperate
      // Running loop of FileList Array
      for (
        let filelist_index = 0;
        filelist_index < alreadyAddedFileList.length;
        filelist_index++
      ) {
        console.log("XXXX Checking fileList index : ", typeof filelist_index);
        // Running loop on each file
        for (
          let file_index = 0;
          file_index < alreadyAddedFileList[filelist_index].length;
          file_index++
        ) {
          console.log("XXX Type of : ", typeof file_index);
          console.log(
            "Creating blob for filr : ",
            alreadyAddedFileList[filelist_index][file_index]
          );
          // Check if file is not deleted by user
          // To Add FileListArray Index with FileList check if exists in file
          previewUrlList.push({
            fileListIndex: filelist_index,
            fileIndex: file_index,
            fileType: alreadyAddedFileList[filelist_index][file_index].type,
            fileBlobURL: URL.createObjectURL(
              alreadyAddedFileList[filelist_index][file_index]
            ),
          });
        }
      }

      previewFileList = previewUrlList;

      // Creating UI for displaying selected file
      createSelectedFileUI(previewUrlList);

      return true;
    } catch (error) {
      console.log("Failed to add file ", error);
      return false;
    }
  };

  // Function will be called when user click on photo or video icon on create post
  const handleSelectFile = (event: any, file_type: string) => {
    try {
      // Checking if file is selected or not
      if (!event?.target?.files) {
        return;
      }

      // No file selected returning
      if (event.target.files.length < 1) {
        return;
      }

      let validFileType: boolean = false;

      // Check if selected files have valid file extension or not
      for (
        let file_index = 0;
        file_index < event.target.files.length;
        file_index++
      ) {
        if (file_type == "images") {
          // Checking if valid image type
          validFileType = checkValidImageFile(event.target.files[file_index]);
        } else if (file_type == "videos") {
          // Checking if valid video type
          validFileType = checkValidVideoFile(event.target.files[file_index]);
        }

        // Show error message
        if (!validFileType) {
          break;
        }
      }

      //
      if (!validFileType) {
        console.log("Invalid file type");
        // TO DO : Add alert of something to display error message
        return;
      }

      // Function will do following things
      // Check if file is already selected by user earlier
      // Create blob of file to display it at frontend
      let showPopUp = addSelectedFiles(event.target.files);

      // Showing modals
      if (showPopUp) {
        setShowModal(true);
      }
    } catch (error) {
      console.log("Failed to handle file ", error);
    }
  };

  return {
    showModal,
    setShowModal,
    previewFilesUI,
    handleTextLength,
    createPost,
    closePostModel,
    handleSelectFile,
    loadingState,
    lastItem,
  };
}

const imageDelBtn = ctl(`
  absolute top-2 right-6 ml-auto border-0 text-gray-shade-3 opacity-100 outline-none leading-none font-semibold focus:outline-none transition bg-white/70  rounded-full hover:scale-110 z-30 w-[24px] h-[24px] flex items-center justify-center leading-0 text-2xl
  `);
const ImageStyleContainer = ctl(`
 h-full flex items-center justify-center relative
  `);
const createPostImageStyling = ctl(`
 object-contain object-center  w-full h-auto rounded-xl max-w-[25rem] max-h-[25rem] block
  `);
