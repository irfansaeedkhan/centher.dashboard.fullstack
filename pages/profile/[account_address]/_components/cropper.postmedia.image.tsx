import React, { useCallback, useRef } from "react";
import { CropperRef, Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

import { PostImageCropperData } from "@/components/feed.components/create.post/post.modal/files.preview";
import { FileWithID } from "@/store/new.post.store";
import { PostCropModalContainer } from "@/components/feed.components/create.post/post.modal/post.crop.modal";

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
  const cropperRef = useRef<CropperRef>(null);

  const cropImageFunc = useCallback(async () => {
    if (cropperRef.current) {
      const file: File = await dataUrlToFile(
        cropperRef.current.getCanvas()?.toDataURL() as string,
        "cropped-image.png"
      );
      onCrop({
        id: cropImageSrc.fileID,
        original: file,
      });
      onClose();
    }
  }, [cropperRef, cropImageSrc, onClose]);
  return cropImageSrc.preview ? (
    <PostCropModalContainer
      title="Crop"
      onClickClose={onClose}
      isOpen={cropImageSrc.preview ? true : false}
    >
      <div>
        <div className=" bg-black-shade-12 text-center">
          <Cropper
            src={cropImageSrc.preview}
            className={"cropper"}
            // stencilProps={{
            //   movable: true,
            //   resizable: true,
            // aspectRatio: 9/6,
            // }}
            ref={cropperRef}
          />
        </div>
        <div className="bottom-0 mt-3 flex w-full justify-center text-center [@media(max-width:600px)]:absolute">
          <button
            className="mb-3 flex w-fit items-center rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-black-shade-2 hover:bg-brand-primary-dark"
            onClick={cropImageFunc}
          >
            Crop
          </button>
        </div>
      </div>
    </PostCropModalContainer>
  ) : null;
};

export default CropperPostMediaImage;

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: "image/png" });
}
