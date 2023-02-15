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
      <div className="flex flex-col items-center justify-center rounded-2xl bg-background-shade-3 p-6 text-white">
        <Music3DIcon className={clsx(playing && "animate-pulse")} />
        <div className="my-7 flex flex-col">
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
        <div className="flex w-full gap-2">
          <button
            onClick={() => setPlaying(!playing)}
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-shade-3 p-4"
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
            <div className="h-14 w-full rounded-xl bg-[#1F212B]"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
