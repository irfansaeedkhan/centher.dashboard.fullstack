import { useGetSubscribes } from "@/hooks/stream";
import { BroadcastPreviewDto } from "@/hooks/stream/dto/broadcast-preview.dto";
import { useCoreStream } from "@/hooks/stream/use.core";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";

const StreamPage: NextPage = () => {
  const { useGetSubscribes } = useCoreStream();
  const streamPromise = useGetSubscribes();
  const [streamData, setStreamData] = useState<BroadcastPreviewDto[]>([]);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const data = await streamPromise;
        setStreamData(data.data.broadcast);
        console.log("ddddd", data.data.broadcast);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStream();
  }, [streamPromise]);

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      Test Stream
      <div className="felx w-full flex-row ">
        <p>broudcasts</p>
        {streamData?.map((stream) => {
          return (
            <div key={stream.id}>
              <Image
                src={stream.image}
                alt="Picture of the author"
                width={50}
                height={50}
              />
              <p>{stream.id}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreamPage;
