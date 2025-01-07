import { useState, useEffect } from "react";

const useMediaDevices = () => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

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
      setError((err as Error).message);
    }
  };

  const getMediaPermissions = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      updateDevices();
      cameraStream.getTracks().forEach((track) => track.stop());

      setHasPermission(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotFoundError") {
        setError((err as Error).message);
      } else {
        setError((err as Error).message);
      }

      try {
        const microphoneStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        updateDevices();
        microphoneStream.getTracks().forEach((track) => track.stop());

        setHasPermission(true);
      } catch (err) {
        setError((err as Error).message);
        console.error(err);
        setHasPermission(false);
      }
    }
  };

  useEffect(() => {
    getMediaPermissions();
    navigator.mediaDevices.addEventListener("devicechange", updateDevices);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", updateDevices);
    };
  }, []);

  return { cameras, microphones, error, hasPermission, getMediaPermissions };
};

export default useMediaDevices;
