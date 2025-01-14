import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { useState } from "react";

const useMediaDevices = () => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const updateDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const camerasList = deviceList.filter(
        (device) => device.kind === "videoinput"
      );
      const microphonesList = deviceList.filter(
        (device) => device.kind === "audioinput"
      );

      setCameras(camerasList);
      setMicrophones(microphonesList);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const getMediaPermissions = async (type: BroadcastTypeEnum) => {
    try {
      let devices;
      if (type == BroadcastTypeEnum.AMA) {
        devices = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      } else {
        devices = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
      }
      devices?.getTracks().forEach((track) => track.stop());
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  return {
    cameras,
    microphones,
    error,
    getMediaPermissions,
    updateDevices,
  };
};

export default useMediaDevices;
