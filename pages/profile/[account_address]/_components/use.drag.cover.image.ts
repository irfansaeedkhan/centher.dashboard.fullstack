import React, { useCallback, useState } from "react";

interface Params {
  initialY?: string;
}

export const useDragCoverImage = (params: Params = {}) => {
  const [imagePosition, setImagePosition] = useState({
    lastY: 0,
    y: params.initialY ?? "0px",
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setImagePosition((prev) => {
      const diff = e.clientY - prev.lastY;

      let prevY: number;

      try {
        prevY = parseInt(prev.y.replace("px", ""));
      } catch {
        prevY = 0;
      }

      return {
        ...prev,
        lastY: e.clientY,
        y: `${prevY + diff}px`,
      };
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "move";
      document.body.style.userSelect = "none";
      setImagePosition((prev) => ({
        ...prev,
        lastY: e.clientY,
      }));
    },
    [handleMouseMove, handleMouseUp]
  );

  const handleSetImagePosition = useCallback((y: string) => {
    setImagePosition((prev) => ({
      ...prev,
      y,
    }));
  }, []);

  return {
    imagePosition: imagePosition.y,
    setImagePosition: handleSetImagePosition,
    handleMouseDown,
  };
};
