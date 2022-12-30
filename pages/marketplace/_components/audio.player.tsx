import { Music3DIcon, PauseIcon, PlayIcon } from "@/assets/svgs";
import useAudioPlayer from "@/hooks/use.audio";
import clsx from "clsx";
import moment from "moment";
import React from "react";
import Bar from "./audio.bar";

interface AudioPlayerProps {
  srcObject?: any;
  src: any;
}

const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  const { curTime, duration, playing, setPlaying, setClickedTime } =
    useAudioPlayer();

  return (
    <div className="player">
      <audio id="audio">
        <source src={props.src} />
      </audio>
      <div className="text-white p-6 bg-background-shade-3 rounded-3xl flex flex-col justify-center items-center">
        <Music3DIcon className={clsx(playing && "animate-pulse")} />
        <div className="flex flex-col my-7">
          <div className="text-lg font-semibold text-brand-primary">
            {props?.srcObject?.name}
          </div>
          {curTime === 0 ? (
            <div className="text-sm font-medium text-white">
              {moment
                .utc(moment.duration(duration, "seconds").asMilliseconds())
                .format("mm:ss")}
            </div>
          ) : (
            <div className="text-sm font-medium text-white">
              {moment
                .utc(moment.duration(curTime, "seconds").asMilliseconds())
                .format("mm:ss")}
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full">
          <button
            onClick={() => setPlaying(!playing)}
            className="h-14 w-14 bg-gray-shade-3 rounded-xl flex items-center justify-center p-4"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          {curTime && duration ? (
            <Bar
              curTime={curTime}
              duration={duration}
              onTimeUpdate={(time: number) => setClickedTime(time)}
            />
          ) : (
            <div className="h-14 bg-[#1F212B] rounded-xl w-full"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
