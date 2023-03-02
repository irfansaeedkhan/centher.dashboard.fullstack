import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { ModalWrapper } from "@/components/modal";

import { PostImageCropperData } from "@/components/feed.components/create.post/post.modal/files.preview";
import { FileWithID } from "@/store/new.post.store";

interface CropperProps {
  cropImageSrc: PostImageCropperData;
  onClose: () => void;
  onCrop: (croppedFile: FileWithID) => void;
}

const CropperPostMediaImage: React.FC<CropperProps> = ({
  cropImageSrc,
  onClose,
  onCrop,
}) => {
  const cropperRef = useRef<HTMLImageElement>(null);

  const handleCrop = useCallback(async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;

    const croppedCanvas = cropper.getCroppedCanvas();

    const file: File = await dataUrlToFile(
      croppedCanvas.toDataURL(),
      "cropped-image.png"
    );
    onCrop({
      id: cropImageSrc.fileID,
      original: file,
    });
    onClose();
  }, [cropperRef, cropImageSrc, onClose, onCrop]);

  return cropImageSrc.preview ? (
    <ModalWrapper
      title="Crop"
      onClose={onClose}
      isOpen={cropImageSrc.preview ? true : false}
    >
      <div>
        <div className="h-full bg-black-shade-12 text-center">
          <Cropper
            src={cropImageSrc.preview}
            style={{
              height: 500,
              width: "100%",
              objectFit: "cover",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#0d0d0d",
            }}
            viewMode={1}
            movable={false}
            zoomable={false}
            scalable={false}
            initialAspectRatio={4 / 3}
            aspectRatio={4 / 3}
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
            className="flex w-fit items-center rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-black-shade-2 hover:bg-brand-primary-dark "
            onClick={handleCrop}
          >
            Crop
          </button>
        </div>
      </div>
    </ModalWrapper>
  ) : null;
};

export default CropperPostMediaImage;

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: "image/png" });
}
