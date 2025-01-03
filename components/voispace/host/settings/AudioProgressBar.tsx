import React, { useState, useEffect } from "react";

const MicrophoneVolume = () => {
  const [volume, setVolume] = useState(0); // مقدار حجم صدا (0 تا 5)

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let dataArray: Uint8Array | null = null;

    const getMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 256; // دقت تحلیل
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        microphone.connect(analyser);

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray!);
          const avg =
            dataArray!.reduce((sum, value) => sum + value, 0) / bufferLength;
          const scaledVolume = Math.min(Math.floor(avg / 51), 5); // مقدار 0 تا 5
          setVolume(scaledVolume);
          requestAnimationFrame(updateVolume);
        };

        updateVolume();
      } catch (error) {
        console.error("Microphone access denied:", error);
      }
    };

    getMicrophoneAccess();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return (
    <div className="w-[150px]">
      <div className="flex space-x-[1px] rounded-[10px]">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-6 flex-1  ${
              index < volume ? "bg-green-500" : "bg-gray-700"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MicrophoneVolume;
