// React, Next, NPM Packages
import { useState, useRef } from "react";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/future/image";
import { Carousel } from "react-responsive-carousel";

// App imports
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";
import {
  PhotoIcon,
  VideoIcon,
  EmojiIcon,
  AnimateTrashIcon,
} from "@/assets/svgs";

import {
  defaultBufferSize,
  awsMinBufferSize,
  calculateFileChunksSizes,
} from "@/utils/mediafile/filechunks";

import {
  checkValidImageFile,
  checkValidVideoFile,
  checkFileAlreadyAddedInSelectedFile,
  post_file_details,
  FileChunksChunksCalculations,
} from "@/utils/mediafile/valid.media.files";
import {
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_IMAGE_TYPES,
} from "@/constants/supported.media.type";

type PreviewSelectedFile = {
  fileListIndex: string | string;
  fileIndex: number | string;
  fileType: string;
  fileBlobURL: string;
};
import { axiosNodeApi } from "@/utils/axios";

export const PostCard = () => {
  //It will store list of files selected by the user
  const [userSelectedFileListArray, setuserSelectedFileListArray] = useState(
    Array<FileList>
  );

  //
  const [previewFilesUI, setpreviewFilesUI] = useState([]);

  //
  const [deletedFileIndexs, setDeletedFileIndex] = useState([]);

  //
  const [selectedFileDetail, setselectedFileDetail] = useState(
    Array<FileChunksChunksCalculations>
  );

  //
  let currentPostID = "";

  let previewFileList = [];
  // states
  const [showModal, setShowModal] = useState<boolean>(false);

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
    }
  };
  const CompleteMultipartUpload = async (file_index) => {
    try {
      await axiosNodeApi.post("/api/socials/posts-media/complete", {
        post_id: currentPostID,
        file_index: file_index,
      });

      UploadFiles(file_index + 1);
    } catch (error) {
      console.log("Failed to complete upload : ", error);
    }
  };

  const UploadChunks = async (
    filesChunksDetails,
    uploading_file_index,
    chunk_index
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
      fileReader.onloadend = async function (event) {
        try {
          if (event.target.readyState !== FileReader.DONE) {
            console.log("File reading complete");
            return;
          }

          //Storing data
          let dataRead = event?.target.result;

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
              if (file_details.chunks_range.length - 1 == chunk_index) {
                console.log("File upload complete");
                //All chunks are uploaded now need to upload new file
                CompleteMultipartUpload(uploading_file_index);
              } else {
                console.log("Uploading new file");
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

  const UploadFiles = async (filesChunksDetails, uploading_file_index) => {
    try {
      console.log("File chunks details : ", filesChunksDetails);
      if (uploading_file_index > filesChunksDetails.length) {
        //Checking if file list
        console.log("File Upload complete show message ");
        return;
      }

      await UploadChunks(filesChunksDetails, uploading_file_index, 0);
    } catch (error) {
      console.log("Failed to delete post");
    }
  };

  const deleteFileIndexs = async (fileListIndex, fileIndex, previewIndex) => {
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
            if (index == fileListIndex) {
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
        let deleted_file_index = deletedFileIndexs;
        //If more than one file exists in the fileArray Object then cannot delete single file because it is not allowed
        //so storing this details in different array while creating chunks we will skip this file
        if (deleted_file_index.indexOf(fileListIndex + "," + fileIndex) == -1) {
          //Doesn't exits in the database
          await setDeletedFileIndex(
            deleted_file_index.push(fileListIndex + "," + fileIndex)
          );
          console.log(deleted_file_index);
        }
      }

      //Remove Selected file
      let updateFile = await previewFileList.filter((value, index) => {
        if (index == previewIndex) {
          return false;
        }
        return true;
      });
      await createSelectedFileUI(updateFile);
      return;
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const createPost = async (event: Event) => {
    try {
      let post_text = "";

      //TO DO : Get text
      let filesChunksDetails = await post_file_details(
        userSelectedFileListArray
      );

      //Setting details in filesChunksDetails
      setselectedFileDetail(filesChunksDetails);

      let { data } = await axiosNodeApi.post(`/api/socials/posts/insert`, {
        post_files_detail: filesChunksDetails,
        post_text: post_text,
      });

      //If no file data that means only text was avaible in post
      if (filesChunksDetails.length == 0) {
        //To DO : Show message post is created
        setShowModal(false);
        return;
      }

      currentPostID = data.post_id;

      //
      await UploadFiles(filesChunksDetails, 0).catch((error) => {
        console.log("Error ", error);
      });
    } catch (error) {
      console.log("Failed to create post ", error);
    }
  };
  //
  const createSelectedFileUI = (previewUrlList) => {
    try {
      let displaySelectedFile = [];
      for (let fileDetails in previewUrlList) {
        console.log("File preview : ", previewUrlList[fileDetails]);
        if (
          SUPPORTED_VIDEO_TYPES.includes(previewUrlList[fileDetails].fileType)
        ) {
          displaySelectedFile.push(
            <div>
              <video width={452} height={312} className="w-full" controls>
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
              >
                Delete
              </button>
            </div>
          );
        } else if (
          SUPPORTED_IMAGE_TYPES.includes(previewUrlList[fileDetails].fileType)
        ) {
          displaySelectedFile.push(
            <div className="h-[38vh] relative">
              <img
                src={previewUrlList[fileDetails].fileBlobURL}
                width={452}
                height={312}
                alt="post media"
                className="w-full h-full object-cover rounded-xl"
              />
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
                x
              </button>
            </div>
          );
        }
      }
      {
        /* aaaaaa */
      }
      console.log("Preview created for : ", displaySelectedFile);
      setpreviewFilesUI(displaySelectedFile);
    } catch (error) {
      console.log("Failed to create selected ", error);
    }
  };

  //
  const addSelectedFiles = (selected_files: FileList) => {
    try {
      //TO DO : Remove Selected filed
      let alreadyAddedFileList: Array<FileList> = userSelectedFileListArray;

      let fileExits = checkFileAlreadyAddedInSelectedFile(
        alreadyAddedFileList,
        selected_files
      );
      if (fileExits) {
        console.log("Select file list : ", fileExits);
        //TO DO : Show error message that file already exits in the selected file
        return;
      }
      //
      alreadyAddedFileList.push(selected_files);
      setuserSelectedFileListArray(alreadyAddedFileList);
      let previewUrlList: Array<PreviewSelectedFile> = [];
      //

      for (let filelist_index in alreadyAddedFileList) {
        //Running loop for creating file
        for (
          let file_index = 0;
          file_index < alreadyAddedFileList[filelist_index].length;
          file_index++
        ) {
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
      console.log("Creating Selected UI ", previewUrlList);
      previewFileList = previewUrlList;
      createSelectedFileUI(previewUrlList);
    } catch (error) {
      console.log("Failed to add file ", error);
    }
  };

  const handleSelectFile = (event: Event, file_type: string) => {
    try {
      //Checking if file is selected or not
      if (!event.target.files) {
        return;
      }

      //No file selected returning from the array
      if (event.target.files.length < 1) {
        return;
      }

      let validFileType: boolean = false;
      //
      for (
        let file_index = 0;
        file_index < event.target.files.length;
        file_index++
      ) {
        if (file_type == "images") {
          //
          validFileType = checkValidImageFile(event.target.files[file_index]);
        } else if (file_type == "videos") {
          //
          validFileType = checkValidVideoFile(event.target.files[file_index]);
        }

        if (!validFileType) {
          break;
        }
      }

      //
      if (!validFileType) {
        console.log("imvalid file type ");
        //TO DO : Add alert of something to display error message
        return;
      }

      console.log("Valid file type : ", validFileType);
      //Add selected file
      addSelectedFiles(event.target.files);

      //Showing modals
      setShowModal(true);
    } catch (error) {
      console.log("Failed to handle file ", error);
    }
  };

  console.log("previewFilesUI", previewFilesUI);
  return (
    <div className={postCardContainer}>
      <div className={topCard}>
        <Image
          src={"/images/feedprofilepic.png"}
          width={48}
          height={48}
          className="rounded-full"
          alt={"icon"}
        />
        <button
          className={postBtn}
          onClick={() => {
            setShowModal(true);
          }}
        >
          Start a post
        </button>
      </div>
      <div className={uploadBtnContainer}>
        <label className={`${uploadBtn} text-yellow-theme`}>
          <PhotoIcon />
          Photo
          <input
            type="file"
            id="files-photo"
            name="photos-file"
            accept=".gif,.jpg,.jpeg,.jfif,.pjpeg,.pjp,.png,.svg"
            style={{ display: "none" }}
            multiple
            onChange={(e) => {
              handleSelectFile(e, "images");
            }}
          />
        </label>

        <label className={`${uploadBtn} text-[#157AFB]`}>
          <VideoIcon />
          Video
          <input
            type="file"
            id="files-videos"
            name="videos-file"
            accept=".webm,.mp4,.mpg,.avi,.m4v"
            style={{ display: "none" }}
            multiple
            onChange={(e) => {
              handleSelectFile(e, "videos");
            }}
          />
        </label>
        <label
          onClick={() => {
            setShowModal(true);
          }}
          className={`${uploadBtn} text-[#00BF96]`}
        >
          <EmojiIcon />
          Emoji
        </label>
      </div>
      {showModal && (
        <CustomModal
          onClose={() => {
            //TO DO : Convert to function
            setShowModal(false);
            setuserSelectedFileListArray([]);
            setpreviewFilesUI([]);
            setDeletedFileIndex([]);
            setselectedFileDetail([]);
            previewFileList = "";
          }}
          title={"Create post"}
        >
          <div className={modalBodyWrapper}>
            <div className={contactDetail}>
              <Image
                src={"/images/robertProfilepic.png"}
                width={44}
                height={44}
                alt={"image"}
              />
              <h5 className={cdName}>uixamjad</h5>
            </div>
            {/* aaaaaa */}
            <div className={maincontentContainer}>
              <div
                className={`${mediaContainer} 
                // ${previewFilesUI.length === 1 && "grid-cols-1"} 
                // ${previewFilesUI.length === 2 && "grid-cols-2"} 
                // ${previewFilesUI.length > 2 && "grid-cols-3"} 
                `}
              >
                <Carousel
                  showStatus={false}
                  showThumbs={false}
                  showIndicators={false}
                  showArrows={previewFilesUI.length === 1 ? false : true}
                >
                  {previewFilesUI}
                </Carousel>
                {/* <img
                  src="/images/postimage.png"
                  width={452}
                  height={312}
                  alt="post media"
                  className="w-full"
                /> */}
                {/* {previewFilesUI} */}
              </div>
              <div className={inputTextContainer}>
                <textarea
                  className={textContainerContent}
                  name=""
                  id="posttext"
                  cols={12}
                  rows={4}
                  placeholder="Type Here"
                  maxLength={200}
                  onChange={handleTextLength}
                ></textarea>
              </div>
            </div>
            <div className={modalFooter}>
              <div className={leftActionBtns}>
                <label className={`${uploadBtn} text-yellow-theme`}>
                  <PhotoIcon />
                  Photo
                  <input
                    type="file"
                    id="files-photo"
                    name="photos-file"
                    accept=".gif,.jpg,.jpeg,.jfif,.pjpeg,.pjp,.png,.svg"
                    style={{ display: "none" }}
                    multiple
                    onChange={(e) => {
                      handleSelectFile(e, "images");
                    }}
                  />
                </label>
                <label className={`${uploadBtn} text-[#157AFB]`}>
                  <VideoIcon />
                  Video
                  <input
                    type="file"
                    id="files-videos"
                    name="videos-file"
                    accept=".webm,.mp4,.mpg,.avi,.m4v"
                    style={{ display: "none" }}
                    multiple
                    onChange={(e) => {
                      handleSelectFile(e, "videos");
                    }}
                  />
                </label>
                <button className={`${uploadBtn} text-[#00BF96]`}>
                  <EmojiIcon />
                  Emoji
                </button>
              </div>
              <div className={RightActionBtns}>
                <AnimateTrashIcon />
                <div className={divider}></div>
                <button className={clearBtn}>+</button>
                <Button
                  title={"Post"}
                  variant="v1"
                  className="max-w-[140px]"
                  onClick={createPost}
                />
              </div>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

// styling
const postCardContainer = ctl(`
  w-full p-4 rounded-10px bg-background-shade-3 flex flex-col gap-4
`);
const topCard = ctl(`
top w-full flex items-center gap-2 mb-2 
`);
const postBtn = ctl(`
w-full text-14px bg-transparent rounded-10px overflow-hidden h-[48px] border-2 border-gray-shade-3 px-6 text-gray-shade-7 font-medium text-left
`);
const uploadBtnContainer = ctl(`
  flex items-items justify-between
`);
const uploadBtn = ctl(`
flex items-center gap-3 text-14px font-medium 
`);

// create post modal styling
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 pt-4 
`);
const contactDetail = ctl(`
  flex items-center  gap-3 px-6
`);
const cdName = ctl(`
  text-14px font-semibold text-white
`);
const maincontentContainer = ctl(`
px-6
`);
const mediaContainer = ctl(`
 "w-full grid" gap-3"
`);
const mediaItem = ctl(`  

`);
const inputTextContainer = ctl(`
pt-4 pb-2 w-full
`);
const textContainerContent = ctl(`
text-14px rounded-10px w-full leading-6  text-white font-medium bg-background-shade-3
`);
const modalFooter = ctl(`
flex items-center justify-between border-t-2 border-gray-shade-3 pt-6 px-6
`);
const leftActionBtns = ctl(`
w-[100%] lg:w-[48%] flex items-center justify-between
`);
const RightActionBtns = ctl(`
w-[100%] lg:w-[40%] flex items-center gap-2
`);
const divider = ctl(`
w-[2px] h-[10px] bg-[#333333]  rounded-xl
`);
const clearBtn = ctl(`
plus text-brand-primary text-[28px] leading-[28px] border-2 border-gray-shade-3 rounded-10px w-[50px] h-[40.08px]
`);
const imageDelBtn = ctl(`
absolute top-2 right-2 ml-auto border-0 text-gray-shade-3 opacity-100 outline-none leading-none font-semibold focus:outline-none transition bg-white/70  rounded-full hover:scale-110 z-30 w-[24px] h-[24px] flex items-center justify-center leading-0 text-2xl
`);
