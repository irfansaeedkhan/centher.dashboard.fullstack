import ctl from "@netlify/classnames-template-literals";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import { CoverImageWithFile } from "./profile.header";
import { ModalWrapper } from "@/components/modal";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface CropperProps {
  coverImage: CoverImageWithFile;
  setCoverImage: (coverImage: any) => void;
}

const CropperImage: React.FC<CropperProps> = ({
  coverImage,
  setCoverImage,
}) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    // console.log(cropper.getCroppedCanvas().toDataURL());
    setCoverImage((prev: any) => ({
      ...prev,
      path: cropper.getCroppedCanvas().toDataURL(),
      preview: "",
    }));
  };

  return coverImage.preview ? (
    <ModalWrapper
      title="Crop"
      onClose={() => {
        setCoverImage((prev: any) => ({
          ...prev,
          blob: null,
          preview: "",
        }));
      }}
      isOpen={coverImage.preview ? true : false}
    >
      <div>
        <div className="text-center h-full">
          <Cropper
            src={coverImage.preview}
            style={{
              height: 400,
              width: "100%",
              objectFit: "cover",
              display: "flex",
              justifyContent: "center",
            }}
            viewMode={1}
            movable={false}
            zoomable={false}
            scalable={false}
            initialAspectRatio={622 / 180}
            aspectRatio={622 / 180}
            cropBoxResizable={false}
            minContainerHeight={180}
            minCropBoxHeight={180}
            background={false}
            guides={false}
            ref={cropperRef}
          />
        </div>
        <div className="mt-3 text-center w-full flex justify-center">
          <button
            className="w-fit px-6 py-2 flex text-sm rounded-lg items-center font-semibold bg-brand-primary text-black-shade-2 hover:bg-brand-primary-dark"
            onClick={onCrop}
          >
            Crop
          </button>
        </div>
      </div>
    </ModalWrapper>
  ) : null;
};

export default CropperImage;
