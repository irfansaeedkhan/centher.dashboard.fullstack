// React, Next, NPM Packages
import { useState, useRef, useEffect } from "react";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";

// App imports
import { useProfileCardStore } from "@/store/profile.card.store";
import { axiosNodeApi } from "@/utils/axios";
import {
  checkValidImageFile,
  checkValidVideoFile,
  checkFileAlreadyAddedInSelectedFile,
  post_file_details,
  FileChunksChunksCalculations,
  fileAlreadySelected,
  checkIfSelectedFileExitsInDeletedFile,
} from "@/utils/mediafile/valid.media.filesv1";
import { Post } from "@/models/post";
import {
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_IMAGE_TYPES,
  MAX_IMAGE_USER_UPLOAD,
  MAX_VIDEO_USER_UPLOAD,
} from "@/constants/supported.media.type";
import { CrossIcon } from "@/assets/svgs";
import { number, string } from "joi";
import { indexOf } from "lodash";

type PreviewSelectedFile = {
  fileIndex: number;
  fileType: string;
  fileBlobURL: string;
};

interface PostUploadOptions {
  onPostCreated?: (post: Post) => void;
  reply?: boolean;
  reply_address?: string;
  reply_post_id?: string;
  replyCount?: number;
}

export function usePostUpload({
  reply = false,
  reply_address = "",
  reply_post_id = "",
  replyCount = 0,
  onPostCreated,
}: PostUploadOptions) {
  const incrementPostsCount = useProfileCardStore(
    (state) => state.incrementPostsCount
  );

  //Show create pop modal
  const [showModal, setShowModal] = useState<boolean>(false);

  //Index
  const [lastItem, setLastItem] = useState<number>();

  // Loader status
  const [loadingState, setLoadingState] = useState(false);

  // Show error occured during creating post
  const [postError, setPostError] = useState("");

  // Total reply counts
  const [totalReplyCount, setTotalReplyCount] = useState<number>(replyCount);

  //Files selected by user
  const [userSelectedFiles, setUserSelectedFilesList] = useState<File[]>([]);

  //User_Selected_Files
  //let detailsOfUserSelected: string[] = [];
  const [detailsOfUserSelected, setdetailsOfUserSelected] = useState<string[]>(
    []
  );

  //Tweet set by user
  const [tweetText, setweetText] = useState<string>("");

  // Images that will be displayed after it is selected
  const [displaySelectedFiles, setdisplaySelectedFiles] = useState(
    Array<JSX.Element>
  );

  //
  const [file, setFile] = useState<string>("");

  //
  const [uploadingFileStatus, setUploadingFileStatus] = useState<number>();

  let currentPostID: string = "";

  const closePostModal = () => {
    try {
      // Hiding popup
      setShowModal(false);
      // Hiding loader
      setLoadingState(false);
      // Reseting error message on hiding popup
      setPostError("");
      // reseting user selected file list
      setUserSelectedFilesList([]);
      //
      setdisplaySelectedFiles([]);
      //
      setweetText("");
    } catch (error) {
      console.log("Failed to close post modal ", error);
      setPostError("Failed to close");
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

  const deleteText = () => {
    try {
      setweetText("");
    } catch (error) {
      toast.error("Failed to delete text from post");
    }
  };
  // TODO: mubashir kindly fix any types
  // emoji toggle functions
  const refe: any = useRef(null);

  const onEmojiClick = (emojiObject: any, event: any) => {
    const cursor = refe?.current?.selectionStart;
    const text =
      tweetText.slice(0, cursor) + emojiObject?.emoji + tweetText.slice(cursor);
    // setweetText((prev) => prev + text);
    setweetText(text);
    // setTotalPostLikes((prev) => prev + 1);
    // setShowModal(true);
    //Codes added for the new cursor
    const newCursor = cursor + emojiObject?.emoji?.length;
    setTimeout(() => refe.current.setSelectionRange(newCursor, newCursor), 10);
  };

  // TODO: fix any types please
  // delete parent Element while deleting image
  const handleDeleteItemStyling = (e: any) => {
    try {
      console.log("Deleted file styling called ");
      // dom elements
      let topParent: any = document.querySelector(
        ".slider-wrapper.axis-horizontal"
      );
      let listParent: any = document.querySelector(".slider.animated");
      let ListItem = e.target?.parentElement?.parentElement?.parentElement;
      // adding transform when last element is deleted

      if (
        ListItem.classList.contains("slide") &&
        listParent.lastElementChild == ListItem
      ) {
        if (listParent?.childElementCount === 2) {
          topParent.classList.add("transformChild");
          return;
        }
        let listCount = listParent?.childElementCount - 2;
        listParent.style.transform = `translate3d(-${listCount}00%, 0px, 0px)`;
        console.log("Listcount : ", listCount);
        setLastItem(listCount);
        //console.log("last Item", lastItem);

        // ListItem?.previousSibling?.classList.replace("previous", "selected");
        // ListItem?.previousSibling?.previousSibling?.classList.add("previous");
      }
    } catch (error) {
      console.log("Delted file : ", error);
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
      // Increment the post count
      incrementPostsCount();
    } catch {
      toast.error("Failed to get new post");
    }
  };

  const deleteFile = (
    fileDetails: File,
    fileList: File[],
    deleteSelectedFile: string[]
  ) => {
    try {
      //
      let file_details =
        fileDetails.name + fileDetails.size + fileDetails.lastModified;
      let selectedFiles: File[] = fileList;
      let selectedFileDetails: string[] = deleteSelectedFile;
      let fileIndexToDelete = selectedFileDetails.indexOf(file_details);

      if (fileIndexToDelete == -1) {
        //
        toast.error("No file to delete");
        return;
      }

      //selectedFileDetails = selectedFileDetails.slice(fileIndexToDelete - 1, 1);
      selectedFileDetails = selectedFileDetails.filter((value, index) => {
        if (index == fileIndexToDelete) {
          return false;
        }
        return true;
      });
      selectedFiles = selectedFiles.filter((value, index) => {
        if (index == fileIndexToDelete) {
          return false;
        }
        return true;
      });
      setdetailsOfUserSelected(selectedFileDetails);
      setUserSelectedFilesList(selectedFiles);

      let filesPreview: PreviewSelectedFile[] = selectedFiles.map(
        (file, index) => {
          return {
            fileIndex: index,
            fileType: file.type,
            fileBlobURL: URL.createObjectURL(file),
          };
        }
      );
      //userSelectedFilesv1 = selectedFiles;

      createObjectURLOfFiles(filesPreview, selectedFiles, selectedFileDetails);

      toast.success(`${fileDetails.name} deleted`);
    } catch (error) {
      console.log("Failed to delete file");
      toast.error(`${fileDetails.name} fail to delete`);
    }
  };
  const createObjectURLOfFiles = (
    filesPreview: Array<PreviewSelectedFile>,
    filesList: File[],
    filesDetails: string[]
  ) => {
    try {
      //setdisplaySelectedFiles(filesPreview);

      let displaySelectedFile: JSX.Element[] = [];

      for (let index = 0; index < filesPreview.length; index++) {
        if (SUPPORTED_VIDEO_TYPES.includes(filesPreview[index].fileType)) {
          displaySelectedFile.push(
            <div className={ImageStyleContainer}>
              <video
                width={452}
                height={312}
                controls
                className={createPostImageStyling}
              >
                <source
                  src={filesPreview[index].fileBlobURL}
                  type={filesPreview[index].fileType}
                />
              </video>
              <button
                onClick={(e: any) => {
                  if (
                    e.target?.parentElement?.parentElement?.parentElement.classList.contains(
                      "slide"
                    )
                  ) {
                    deleteFile(filesList[index], filesList, filesDetails);
                    handleDeleteItemStyling(e);
                  }
                }}
                className={imageDelBtn}
              >
                <CrossIcon />
              </button>
            </div>
          );
        } else if (
          SUPPORTED_IMAGE_TYPES.includes(filesPreview[index].fileType)
        ) {
          // Checking if supported image type
          displaySelectedFile.push(
            <div className={ImageStyleContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filesPreview[index].fileBlobURL}
                width={452}
                height={312}
                alt="post media"
                className={createPostImageStyling}
              />
              <button
                onClick={(e: any) => {
                  if (
                    e.target?.parentElement?.parentElement?.parentElement.classList.contains(
                      "slide"
                    )
                  ) {
                    deleteFile(filesList[index], filesList, filesDetails);
                    handleDeleteItemStyling(e);
                  }
                }}
                className={imageDelBtn}
              >
                <CrossIcon className="z-0" />
              </button>
            </div>
          );
        } else {
        }
      }
      setdisplaySelectedFiles((prev) => displaySelectedFile);
      //setdisplaySelectedFiles(displaySelectedFile);
      //setLastItem(0);
    } catch (error) {
      console.log("Failed to create ", error);
      toast.error("Failed to display image");
    }
  };
  //selected_files list will contain all the files selected by user
  //
  const addSelectedFiles = (selected_files: FileList): boolean => {
    try {
      let alreadySelectedFiles: File[] = userSelectedFiles;
      let newFilesToAdd: Array<File> = [];
      let already_added: string[] = detailsOfUserSelected;

      if (alreadySelectedFiles.length >= 5) {
        toast.error("Maximum 5 files is allowed in post");
      }
      //
      for (let index = 0; index < selected_files.length; index++) {
        let file_details =
          selected_files[index].name +
          selected_files[index].size +
          selected_files[index].lastModified;

        if (alreadySelectedFiles.length >= 5) {
          toast.error("Maximum 5 files is allowed in post");
          break;
        }
        if (!detailsOfUserSelected.includes(file_details)) {
          setdetailsOfUserSelected((prev) => [...prev, file_details]);
          already_added.push(file_details);
          newFilesToAdd.push(selected_files[index]);
          alreadySelectedFiles.push(selected_files[index]);
        } else {
          toast.error(`${selected_files[index].name} already selected`);
        }
      }
      setUserSelectedFilesList(alreadySelectedFiles);

      //console.log("Creating Object URL Off : ", filesList);
      let filesPreview: PreviewSelectedFile[] = alreadySelectedFiles.map(
        (file, index) => {
          return {
            fileIndex: index,
            fileType: file.type,
            fileBlobURL: URL.createObjectURL(file),
          };
        }
      );

      //userSelectedFilesv1 = alreadySelectedFiles;
      createObjectURLOfFiles(filesPreview, alreadySelectedFiles, already_added);
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Failed to select file");
      return false;
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
      if (FileListDetails.length > file_index + 1) {
        setFile(FileListDetails[file_index + 1].file_name);
        setUploadingFileStatus(0);
      }
      await UploadFiles(FileListDetails, file_index + 1);
    } catch (error) {
      toast.error("Failed to created post");
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

      let fileIndex = file_details.index_of_file;

      let blob = userSelectedFiles[fileIndex].slice(starting, ending);

      //Onload
      fileReader.onloadend = async function (event: any) {
        try {
          if (event?.target?.readyState !== FileReader.DONE) {
            console.log("File reading complete");
            return;
          }

          //Storing data
          let dataRead = event?.target?.result;

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
            .then(() => {
              setFile(file_details.file_name);
              setUploadingFileStatus(
                (100 / file_details.chunks_range.length) * (chunk_index + 1)
              );
              //Checking all chunks are uploaded
              if (file_details.chunks_range.length - 1 == chunk_index) {
                //All chunks are uploaded now need to upload new file
                CompleteMultipartUpload(
                  filesChunksDetails,
                  uploading_file_index
                );
              } else {
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
          setLoadingState(false);
          toast.error("Failed to create post");
        }
      };

      //
      fileReader.readAsArrayBuffer(blob);
    } catch (error) {
      toast.error("Failed to created post");
      console.log("Error ", error);
    }
  };

  const UploadFiles = async (
    filesChunksDetails: Array<FileChunksChunksCalculations>,
    uploading_file_index: number
  ) => {
    try {
      if (uploading_file_index >= filesChunksDetails.length) {
        // TODO: Checking if file list
        await getNewPostAndUpdateState();
        setFile("");
        // Close Post Modal on successful upload
        toast.success("Post created");
        closePostModal();
        return;
      }
      await UploadChunks(filesChunksDetails, uploading_file_index, 0);
    } catch (error) {
      toast.error("Failed to created post");
    }
  };

  //
  const createPost = async (event: any): Promise<any> => {
    try {
      if (tweetText === "" && displaySelectedFiles.length < 1) {
        toast.error("Empty Post Not Allowed");
        return;
      }

      if (tweetText.trim().length == 0 && displaySelectedFiles.length < 1) {
        toast.error("White Spaces are Not Allowed");
        return;
      }

      if (displaySelectedFiles.length > 5) {
        setPostError("Maximum 5 files is allowed");
        return;
      }
      setLoadingState(true);
      setPostError("");

      let filesChunksDetails: Array<FileChunksChunksCalculations> =
        await post_file_details(userSelectedFiles);

      setUploadingFileStatus(0);
      setFile(filesChunksDetails[0]?.file_name);

      let { data } = await axiosNodeApi.post(`/api/socials/posts/insert`, {
        post_files_detail: filesChunksDetails,
        post_text: tweetText,
        reply: reply,
        reply_address: reply_address,
        reply_post_id: reply_post_id,
      });

      if (reply && data.message_description == "Post created successfully") {
        setTotalReplyCount((prev) => Number(prev) + 1);
      }

      currentPostID = data.post_id;

      // If no file media that means only text was avaible in post
      if (filesChunksDetails.length == 0) {
        //setUploadingFileStatus(100);
        await getNewPostAndUpdateState();
        closePostModal();
        setLoadingState(false);
        return;
      }

      // Starting uploading of task
      await UploadFiles(filesChunksDetails, 0).catch((error) => {
        console.log("Error ", error);
      });
    } catch (error) {
      console.log("Failed to create post : ", error);
    }
  };

  // Function will be called when user click on photo or video icon on create post
  const handleSelectFile = (event: any, file_type: string) => {
    try {
      // Checking if file is selected or not
      if (!event?.target?.files) {
        event.target.value = "";
        return;
      }

      // No file selected returning
      if (event.target.files.length < 1) {
        event.target.value = "";
        toast.error("No file selected");
        return;
      }

      let validFileType: string = "";

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
        if (validFileType !== "") {
          break;
        }
      }

      //
      if (validFileType !== "") {
        event.target.value = "";
        toast.error(validFileType);
        return;
      }

      // Function will do following things
      // Check if file is already selected by user earlier
      // Create blob of file to display it at frontend
      let showPopUp = addSelectedFiles(event.target.files);

      // Showing modals
      if (showPopUp) {
        setShowModal(true);
        //setLastItem(0);
        setPostError("");
      }
      event.target.value = "";
    } catch (error) {
      event.target.value = "";
      toast.error("Failed to select file");
    }
  };
  return {
    showModal,
    setShowModal,
    displaySelectedFiles,
    totalReplyCount,
    handleTextLength,
    createPost,
    closePostModal,
    handleSelectFile,
    loadingState,
    lastItem,
    postError,
    file,
    refe,
    onEmojiClick,
    uploadingFileStatus,
    tweetText,
    deleteText,
    //userSelectedFiles,
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
