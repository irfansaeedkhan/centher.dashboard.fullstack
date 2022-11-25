import React, { useCallback, useMemo, useRef, useState } from "react";
import { CoverImageWithFile } from "./profile.header";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface CropperProps {
  coverImage: CoverImageWithFile;
}

const CropperComp: React.FC<CropperProps> = ({ coverImage }) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    // console.log(cropper.getCroppedCanvas().toDataURL());
  };

  const previewUrl = useMemo(() => {
    if (coverImage.blob) {
      return URL.createObjectURL(coverImage.blob);
    }
  }, [coverImage.blob]);

  return (
    <div className="max-h-[600px] overflow-y-scroll">
      <Cropper
        src={previewUrl}
        style={{ width: "100%", objectFit: "cover" }}
        aspectRatio={840 / 180}
        minCropBoxHeight={180}
        cropBoxResizable={false}
        guides={false}
        crop={onCrop}
        movable={false}
        zoomable={false}
        zoomOnWheel={false}
        zoomOnTouch={false}
        viewMode={3}
        wheelZoomRatio={0}
        modal={false}
        ref={cropperRef}
      />
    </div>
  );
};

export default CropperComp;
