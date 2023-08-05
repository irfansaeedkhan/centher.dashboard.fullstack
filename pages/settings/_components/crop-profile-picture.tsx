import React, { Dispatch, SetStateAction, useRef } from "react";
import {
  FixedCropper,
  FixedCropperRef,
  ImageRestriction,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { ModalWrapper } from "@/components/modal";
import { LoggedInUser, UserImage } from "@/models/user";
import { CropFunctions } from "../crop-functions";
import FinalButton from "@/components/button/final.button";

interface CropperProps {
  isOpen: boolean;
  user: LoggedInUser;
  profileImageData: UserImage;
  setCropModal: Dispatch<SetStateAction<boolean>>;
  setProfileImage: Dispatch<SetStateAction<string>>;
  setProfileImageData: Dispatch<SetStateAction<UserImage>>;
  setUploadFile: Dispatch<SetStateAction<File | undefined>>;
}

const CropProfilePicture: React.FC<CropperProps> = ({
  user,
  isOpen,
  setCropModal,
  setUploadFile,
  setProfileImage,
  profileImageData,
  setProfileImageData,
}) => {
  const cropperRef = useRef<FixedCropperRef>(null);

  const onCrop = async () => {
    if (!cropperRef.current) return;
    const base64 = cropperRef.current.getCanvas()?.toDataURL(); // base64 string
    if (!base64) return;

    const file: File = await dataUrlToFile(base64 || "", "cropped-image.png");
    setUploadFile(file);
    setProfileImage(base64);
    setProfileImageData((prev) => ({
      ...prev,
      path: base64,
    }));
    setCropModal(false);
  };

  return (
    <ModalWrapper
      title="Crop"
      onClose={() => {
        setCropModal(false);
        setProfileImageData({
          path: "",
          object_name: "",
        });
        setProfileImage(user.profile_image);
      }}
      isOpen={isOpen}
    >
      <div>
        <div className="max-h-[600px] overflow-hidden rounded-lg text-center">
          <FixedCropper
            src={profileImageData.path}
            ref={cropperRef}
            stencilProps={{
              handlers: false,
              lines: false,
              movable: false,
              resizable: false,
            }}
            stencilSize={{
              width: 400,
              height: 400,
            }}
            imageRestriction={ImageRestriction.stencil}
          />
        </div>
        <div className="relative mt-5 flex w-full flex-col items-center justify-center">
          <CropFunctions cropperRef={cropperRef} />
          <div className="mt-2 flex w-[82.55px]  flex-shrink-0 justify-center text-center">
            <FinalButton
              title="Crop"
              variant="primary"
              className="h-10 w-[150px] text-[14px]"
              borderRounded="14px"
              onClick={onCrop}
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CropProfilePicture;

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: "image/png" });
}
