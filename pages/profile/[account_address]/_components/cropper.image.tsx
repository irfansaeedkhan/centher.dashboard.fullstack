import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { ModalWrapper } from "@/components/modal";

import { CoverImageWithFile } from "./profile.header";

interface CropperProps {
  coverImage: CoverImageWithFile;
  setCoverImage: React.Dispatch<React.SetStateAction<CoverImageWithFile>>;
}

const CropperImage: React.FC<CropperProps> = ({
  coverImage,
  setCoverImage,
}) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;

    const file: File = await dataUrlToFile(
      cropper.getCroppedCanvas().toDataURL(),
      coverImage.blob?.name || "cropped-image.png"
    );

    setCoverImage((prev) => ({
      ...prev,
      path: cropper.getCroppedCanvas().toDataURL(),
      blob: file,
      object_name: "cropped-image.png",
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
        <div className="h-full text-center">
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
            initialAspectRatio={840 / 180}
            aspectRatio={840 / 180}
            cropBoxResizable={false}
            minContainerHeight={180}
            minCropBoxHeight={180}
            background={false}
            guides={false}
            ref={cropperRef}
          />
        </div>
        <div className="mt-3 flex w-full justify-center text-center">
          <button
            className="flex w-fit items-center rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-black-shade-2 hover:bg-brand-primary-dark"
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

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: "image/png" });
}
