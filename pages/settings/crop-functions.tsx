import React, { useState } from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";

interface Props {
  cropperRef: React.MutableRefObject<any>;
}

export const CropFunctions = ({ cropperRef }: Props) => {
  const [zoomCount, setZoomCount] = useState(0);
  const [zoomValue, setZoomValue] = useState(0);
  const zoomIn = () => {
    if (cropperRef.current && zoomCount < 6) {
      cropperRef.current.zoomImage(2); // zoom-in 2x
      setZoomCount(zoomCount + 1);
      setZoomValue(zoomValue + 1);
    }
  };

  const zoomOut = () => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage(0.5); // zoom-out 2x
      setZoomCount(zoomCount - 1);
    }
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setZoomValue(value);
    if (value === zoomValue) return;
    if (value > zoomValue) {
      zoomIn();
    }
    if (value < zoomValue) {
      zoomOut();
    }
  };

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <FiZoomOut className="text-xl text-white" />
      <div className="flex w-full max-w-[300px] flex-1 items-center justify-center">
        <input
          type="range"
          id="range"
          min="0"
          max="5"
          step="1"
          value={zoomValue}
          onChange={handleZoomChange}
          className="range range-warning range-xs w-full overflow-hidden"
        />
      </div>
      <FiZoomIn className="text-xl text-white" />
    </div>
  );
};

CropFunctions.displayName = "CropFunctions";
