import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineCameraswitch } from "react-icons/md";
import Image from "next/image";
import Webcam from "react-webcam";
import { CameraCustomModal } from "@/components/modal/camera-modal";
import { useNewPostStore } from "@/store/new.post.store";
import FinalButton from "@/components/button/final.button";

interface Props {
  onClose: () => void;
}

const CameraModal = ({ onClose }: Props) => {
  const { addSelectedFiles, closeModal } = useNewPostStore();
  const [cameraSource, setCameraSource] = useState<"user" | "environment">(
    "user"
  );
  const [isRecording, setIsRecording] = useState(false);
  const [picture, setPicture] = useState<string | null>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [startnStop, setStartnStop] = useState<MediaRecorder | null>(null);
  const [hasBackCamera, setHasBackCamera] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);

  useEffect(() => {
    const checkBackCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraSource },
        });
        const track = stream.getVideoTracks()[0];
        setHasBackCamera(!!track);
        track.stop();
      } catch (error) {
        setHasBackCamera(false);
      }
    };

    checkBackCamera();
  }, [cameraSource]);

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
        clearInterval(timerId);
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
          type: "new",
          original: file,
        },
      ]);
      handleResetClick();
      onClose();
    },
    [addSelectedFiles, onClose, handleResetClick]
  );

  const switchCamera = () => {
    setCameraSource(cameraSource === "user" ? "environment" : "user");
  };

  const videoConstraints = {
    width: 540,
    height: 480,
    facingMode: cameraSource,
  };

  return (
    <CameraCustomModal
      onClose={() => {
        onClose();
      }}
      title="Camera"
    >
      <div className="relative flex w-full justify-center">
        {picture === null && videoUrl === null ? (
          <>
            {isRecording && (
              <div className="absolute text-white">{recordingTime}</div>
            )}
            {hasBackCamera && (
              <button
                onClick={switchCamera}
                className="absolute right-4 top-4 z-[100] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg bg-black/5 backdrop-filter"
              >
                <MdOutlineCameraswitch className="h-5 w-5 text-white" />
              </button>
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
          <FinalButton
            title={"Save and continue"}
            onClick={() => saveSelectedFile(fileData)}
            disabled={!fileData ? true : false}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px] hover:scale-90"
            borderRounded="14px"
          />
        ) : (
          !isRecording && (
            <FinalButton
              title={"Capture"}
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
              variant="primary"
              className="flex h-11 w-full items-center justify-center text-[14px] hover:scale-90"
              borderRounded="14px"
            />
          )
        )}
        {videoUrl ? (
          <FinalButton
            title={"Record Again"}
            onClick={(e) => {
              e.preventDefault();
              handleResetClick();
            }}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px] hover:scale-90"
            borderRounded="14px"
          />
        ) : picture ? (
          <FinalButton
            title={"Retake"}
            onClick={(e) => {
              e.preventDefault();
              handleResetClick();
            }}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px] hover:scale-90"
            borderRounded="14px"
          />
        ) : isRecording ? (
          <FinalButton
            title={"Stop Video"}
            onClick={() => startnStop?.stop()}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px] hover:scale-90"
            borderRounded="14px"
          />
        ) : (
          <FinalButton
            title={"Record Video"}
            onClick={handleRecordClick}
            variant="primary"
            className="flex h-11 w-full items-center justify-center text-[14px] hover:scale-90"
            borderRounded="14px"
          />
        )}
      </div>
    </CameraCustomModal>
  );
};
export default CameraModal;
