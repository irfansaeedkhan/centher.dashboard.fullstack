// React, Next, NPM Packages
import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// App imports
import useUser from "@/hooks/use.user";
import { ModalWrapper } from "@/components/modal";

interface SelfieModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelfieModal: React.FC<SelfieModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [isModal, setIsModal] = useState(true);
  const [capture, setCapture] = useState(false);
  const [previewPicture, setPreviewPicture] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const aspectRatio = useMemo(() => 16 / 9, []);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const webRef = useRef<Webcam | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  let img = "httpsL;';'";
  const showImage = async () => {
    if (webRef && webRef.current) {
      img = webRef.current.getScreenshot() as string;
    }
    setPreviewPicture(img);
    setCapture(true);
    setIsModal(false);
  };

  return (
    <div>
      <ModalWrapper isOpen={isOpen} onClose={onClose} title={"Selfie"}>
        <div className="flex w-full items-center justify-center">
          <Webcam
            ref={webRef}
            className="borderselfiall mb-4 h-60 w-60 object-cover"
          />
        </div>
        <button
          className="bg-yellow-theme flex  w-full cursor-pointer items-center justify-center rounded-lg py-3 px-2 text-sm font-semibold tracking-wide text-black shadow-lg transition-all duration-150 ease-linear"
          onClick={showImage}
        >
          Capture
        </button>
      </ModalWrapper>

      <ModalWrapper
        isOpen={capture}
        onClose={() => setCapture(false)}
        title={"Selfie"}
      >
        <div>
          {Boolean(completedCrop) && (
            <canvas
              ref={previewCanvasRef}
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: completedCrop?.width,
                height: completedCrop?.height,
              }}
            />
          )}
        </div>
        <div className="mb-4 flex w-full flex-col items-center justify-center gap-4">
          <canvas
            ref={previewCanvasRef}
            className="h-16 w-16 rounded-full object-cover"
          />
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
          >
            <Image
              alt="image"
              width={300}
              height={300}
              src={previewPicture}
              onLoadingComplete={(img) => {
                imgRef.current = img;
              }}
            />
          </ReactCrop>
        </div>
        <span className="flex w-full items-center gap-4">
          <button
            className="bg-yellow-theme flex  w-full cursor-pointer items-center justify-center rounded-lg py-3 px-2 text-sm font-semibold tracking-wide text-black shadow-lg transition-all duration-150 ease-linear"
            onClick={() => {
              setCapture(false);
              setPreviewPicture("");
              setIsModal(true);
            }}
          >
            Retake
          </button>
          <button
            className="bg-yellow-theme flex  w-full cursor-pointer items-center justify-center rounded-lg py-3 px-2 text-sm font-semibold tracking-wide text-black shadow-lg transition-all duration-150 ease-linear"
            onClick={async () => {
              const res = await fetch(
                previewCanvasRef.current?.toDataURL("image/webp") ?? ""
              );
              const blob = await res.blob();
              const file = new File(
                [blob],
                user?.account_address + "-" + Date.now(),
                {
                  type: "image/webp",
                }
              );
              const previewUrl = URL.createObjectURL(file);

              // setCustomProfileImage(file);
              setCapture(false);
            }}
            // onClick={}
          >
            submit
          </button>
        </span>
      </ModalWrapper>
    </div>
  );
};

export default SelfieModal;
