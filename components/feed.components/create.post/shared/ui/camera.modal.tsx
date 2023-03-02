import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { nanoid } from "nanoid";

import Button from "@/components/button";
import { CameraCustomModal } from "@/components/modal/camera-modal";
import { useNewPostStore } from "@/store/new.post.store";

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
  const [picture, setPicture] = useState<string | null>(null);
  const [picturefile, setPictureFile] = useState<any>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const pictureSrc: any = webcamRef.current.getScreenshot();
      const response = await fetch(pictureSrc);
      const blob = await response.blob();
      const file = new File([blob], "filename.jpg", { type: "image/jpeg" });
      setPicture(pictureSrc);
      setPictureFile(file);
    }
  }, [webcamRef]);

  const saveSelectedFile = useCallback(() => {
    addSelectedFiles([
      {
        id: nanoid(),
        original: picturefile,
      },
    ]);
    onClose();
  }, [addSelectedFiles, onClose, picturefile]);

  return (
    <CameraCustomModal
      onClose={() => {
        onClose();
        closeModal();
      }}
      title="Capture Image"
    >
      <div className="flex w-full justify-center">
        {picture === null ? (
          <Webcam
            audio={false}
            height={480}
            ref={webcamRef}
            width={540}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          picture && <Image src={picture} alt="" width={540} height={480} />
        )}
      </div>
      <div className="mt-10 flex w-full flex-col justify-center gap-5 px-4 fmd:flex-row">
        {picture !== null ? (
          <Button
            title={"Retake"}
            variant="v7"
            className="max-w-[256px] py-4"
            onClick={(e) => {
              e.preventDefault();
              setPicture(null);
              setPictureFile(null);
            }}
          />
        ) : (
          <Button
            title={"Capture"}
            variant="v1"
            className="max-w-full py-4"
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
          />
        )}
        <Button
          title={"Save and continue"}
          variant={!picturefile ? "v2" : "v1"}
          disabled={!picturefile ? true : false}
          className="max-w-full py-4"
          onClick={saveSelectedFile}
        />
      </div>
    </CameraCustomModal>
  );
};
export default CameraModal;
