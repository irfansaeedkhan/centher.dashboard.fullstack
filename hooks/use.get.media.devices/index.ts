import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { useState } from "react";

export interface MediaDeviceLists {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
}

const useMediaDevices = () => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Portfolio-library fix (2026-10-29): previously this returned nothing,
  // so callers read the hook's state right after awaiting it and got the
  // STALE (initially empty) device list — the create-room step concluded
  // "no microphone found" even when a mic existed. Now it returns the
  // freshly enumerated lists so callers decide from current data.
  const updateDevices = async (): Promise<MediaDeviceLists> => {
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
      return { cameras: camerasList, microphones: microphonesList };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return { cameras: [], microphones: [] };
    }
  };

  // Returns true when the browser granted access, false otherwise
  // (previously the outcome was swallowed, so callers could not tell a
  // denial apart from a device that simply was not there yet).
  const getMediaPermissions = async (
    type: BroadcastTypeEnum
  ): Promise<boolean> => {
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
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
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
