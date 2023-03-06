import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { nanoid } from "nanoid";

import NewButton from "@/components/button/new.button";
import { CameraCustomModal } from "@/components/modal/camera-modal";
import { useNewPostStore } from "@/store/new.post.store";
import { toast } from "react-hot-toast";

const videoConstraints = {
  width: 540,
  height: 480,
  facingMode: "user",
};

interface Props {
  onClose: () => void;
}

const CameraModal = ({ onClose }: Props) => {
  const { addSelectedFiles, closeModal } = useNewPostStore();
  const [isRecording, setIsRecording] = useState(false);
  const [picture, setPicture] = useState<string | null>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [startnStop, setStartnStop] = useState<MediaRecorder | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const handleResetClick = useCallback(() => {
    setVideoUrl(null);
    setFileData(null);
    setRecordingTime(0);
    setPicture(null);
    setIsRecording(false);
  }, []);

  const capture = useCallback(async () => {
    try {
      if (webcamRef.current) {
        const pictureSrc: any = webcamRef.current.getScreenshot();
        const response = await fetch(pictureSrc);
        if (!response.ok) {
          throw new Error("Error fetching image data.");
        }
        const blob = await response.blob();
        const file = new File([blob], "filename.jpg", { type: "image/jpeg" });
        setPicture(pictureSrc);
        setFileData(file);
      } else {
        throw new Error("Webcam reference not found.");
      }
    } catch (err: any) {
      toast.error(
        "Error accessing the camera. Please allow access to the camera and try again."
      );
    }
  }, [webcamRef]);

  const handleRecordClick = useCallback(() => {
    try {
      let mediaRecorder: MediaRecorder | null = null;
      if (webcamRef.current?.stream) {
        mediaRecorder = new MediaRecorder(webcamRef.current?.stream);
        setStartnStop(mediaRecorder);
      }

      if (!mediaRecorder) {
        throw new Error("MediaRecorder is not supported by this browser");
      }
      setIsRecording(true);

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: "video/mp4" });
        const file = new File([videoBlob], "my-video.mp4", {
          type: "video/mp4",
        });
        const videoUrl = URL.createObjectURL(videoBlob);
        setFileData(file);
        setVideoUrl(videoUrl);
        setIsRecording(false);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      const startTime = Date.now();
      const timerId = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      setTimeout(() => {
        if (mediaRecorder?.state === "recording") {
          mediaRecorder?.stop();
          clearInterval(timerId);
        }
      }, 60000);
    } catch (err) {
      toast.error(
        "Error accessing the camera. Please allow access to the camera and try again."
      );
    }
  }, [webcamRef]);

  const saveSelectedFile = useCallback(
    (file: File) => {
      addSelectedFiles([
        {
          id: nanoid(),
          original: file,
        },
      ]);
      handleResetClick();
      onClose();
    },
    [addSelectedFiles, onClose, handleResetClick]
  );

  return (
    <CameraCustomModal
      onClose={() => {
        onClose();
        closeModal();
      }}
      title="Camera"
    >
      <div className="relative flex w-full justify-center">
        {picture === null && videoUrl === null ? (
          <>
            {isRecording && (
              <div className="absolute text-white">{recordingTime}</div>
            )}
            <Webcam
              audio={false}
              height={480}
              ref={webcamRef}
              width={540}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </>
        ) : videoUrl ? (
          <div className="video-preview">
            <video src={videoUrl} controls autoPlay />
          </div>
        ) : (
          picture && <Image src={picture} alt="" width={540} height={480} />
        )}
      </div>
      <div className="mt-10 space-y-2 px-6">
        {videoUrl || picture ? (
          <NewButton
            title={"Save and continue"}
            variant={"v1"}
            disabled={!fileData ? true : false}
            className="mt-3 max-w-full"
            onClick={() => saveSelectedFile(fileData)}
          />
        ) : (
          <NewButton
            title={"Capture"}
            variant="v1"
            className="max-w-full hover:bg-brand-primary-dark"
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
          />
        )}
        {videoUrl ? (
          <NewButton
            title={"Record Again"}
            variant="v9"
            className="max-w-full"
            onClick={(e) => {
              e.preventDefault();
              handleResetClick();
            }}
          />
        ) : picture ? (
          <NewButton
            title={"Retake"}
            variant="v9"
            className="max-w-full"
            onClick={(e) => {
              e.preventDefault();
              handleResetClick();
            }}
          />
        ) : isRecording ? (
          <NewButton
            title={"Stop Video"}
            variant={"v9"}
            className="max-w-full hover:bg-brand-primary hover:text-black-shade-3"
            onClick={() => startnStop?.stop()}
          />
        ) : (
          <NewButton
            title={"Record Video"}
            variant={"v9"}
            className="max-w-full hover:bg-brand-primary hover:text-black-shade-3"
            onClick={handleRecordClick}
          />
        )}
      </div>
    </CameraCustomModal>
  );
};
export default CameraModal;
