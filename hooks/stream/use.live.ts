import { useRef, useState } from "react";
import { Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { Transport } from "mediasoup-client/lib/Transport";
import { TState } from "@/stream/types/interfaces";
import { SocketClientService } from "@/stream/clients/socket-client";
import { CreateBroadcastDto } from "@/stream/types/Broadcast";

export interface LiveStreamType {
  toast: string;
  createRoom: (input: CreateBroadcastDto, userId: string) => Promise<any>;
  joinRoom: (id: string, userId: string) => Promise<any>;
}

export interface LiveHookParams {}

export type LiveHook = (params: LiveHookParams) => LiveStreamType;

export const useLive: LiveHook = () => {
  const globalSocket = useRef<Socket | null>(null);
  const globalSocketClient = useRef<SocketClientService | null>(
    new SocketClientService()
  );
  const globalBroadcastId = useRef<string | null>(null);
  const globalRtpCapabilities = useRef<any>(null);
  const globalDevice = useRef<mediasoupClient.Device | null>(null);

  const globalConsumersAudioStream = useRef<Map<string, MediaStream>>(
    new Map()
  );
  const globalConsumersVideoStream = useRef<Map<string, MediaStream>>(
    new Map()
  );
  const globalConsumersAudio = useRef<Map<string, Consumer>>(new Map());
  const globalConsumersVideo = useRef<Map<string, Consumer>>(new Map());
  const globalAudioProducer = useRef<Producer | null>(null);
  const globalUserId = useRef<string | null>(null);
  const globalIsOwner = useRef<boolean>(false);
  const globalHasTalkRequest = useRef<boolean>(false);
  const globalProducerTransport = useRef<Transport | null>(null);
  const globalConsumerTransport = useRef<Transport | null>(null);
  const globalLocalAudio = useRef<MediaStream | null>(null);

  const globalReceiveStreamLoader = useRef<
    "connecting" | "connected" | "failed" | "none"
  >("none");

  const globalSendStreamLoader = useRef<
    | "connecting"
    | "connected"
    | "failed"
    | "trackEnded"
    | "producerClosed"
    | "none"
  >("none");

  const [toast, setToast] = useState<string>("");

  const createRoom = async (input: CreateBroadcastDto) => {
    if (!globalSocket.current) {
      await initSocketClient();
    }

    globalSocket.current!.emit("create-room", input, async (data: any) => {
      if (!data) {
        return;
      }
      globalBroadcastId.current = data.id;
      globalRtpCapabilities.current = data.rtpCapabilities.rtpCapabilities;

      if (!globalDevice.current!.loaded) {
        try {
          await globalDevice.current!.load({
            routerRtpCapabilities: globalRtpCapabilities.current,
          });
        } catch (error) {
          leave();
          return;
        }
      }

      try {
        await createProducerTransport();
        await createConsumerTransport();
        await connectSendTransport();
        globalIsOwner.current = true;
      } catch (error) {
        leave();

        return;
      }

      globalSocket.current!.on("broadcast-finished", async () => {
        close();
      });

      globalSocket.current!.on("user-disconnected", async (data) => {
        // this.emitterService.emit(
        //   EmitterEnum.ON_USER_DISCONNECTED_FROM_TALK,
        //   data
        // );
      });
    });
  };

  const joinRoom = (id: string) => {
    return new Promise((res, rej) => {
      globalSocket.current!.emit(
        "join-room",
        { broadcastId: id, device: "" },
        async (data: { rtpCapabilities: any }) => {
          if (!data) {
            rej();

            return;
          }

          globalBroadcastId.current = id;
          globalRtpCapabilities.current = data.rtpCapabilities;
          if (!globalDevice.current!.loaded) {
            try {
              await globalDevice.current!.load({
                routerRtpCapabilities: globalRtpCapabilities.current,
              });
            } catch (error) {
              leave();
              rej(error);
            }
          }

          try {
            await createConsumerTransport();
          } catch (error) {
            leave();

            rej(error);
          }

          globalSocket.current!.emit(
            "media",
            {
              broadcastId: globalBroadcastId.current,
              msg: { event: "get-producers", data: null },
            },
            (data: any[]) => {
              data.forEach((producer: any) => {
                newProducerJoined(producer, "video");
                newProducerJoined(producer, "audio");
              });
            }
          );

          globalSocket.current!.on("consumer-closed", async (data) => {
            closeConsumer(data.user_id);
          });

          globalSocket.current!.on("broadcast-finished", async () => {
            close();
          });

          globalSocket.current!.on("user-kicked", async () => {
            close();
          });

          globalSocket.current!.on("user-disconnected", async (data) => {
            closeConsumer(data.id);
          });

          res(true);
        }
      );
    });
  };

  const newProducerJoined = (producerId: string, kind: string) => {
    try {
      const { rtpCapabilities } = globalDevice.current!;
      if (kind === "video") {
        globalSocket.current!.emit(
          "media",
          {
            broadcastId: globalBroadcastId.current,

            msg: {
              event: "consume",
              data: { rtpCapabilities, user_id: producerId, kind: "video" },
            },
          },
          async (
            consumeData: mediasoupClient.types.ConsumerOptions<mediasoupClient.types.AppData>
          ) => {
            const consumer = await globalConsumerTransport.current!.consume(
              consumeData
            );

            // 'trackended' | 'transportclose'
            consumer.on("transportclose", () => {
              console.log("remote producer closed");
              globalConsumersVideo.current.delete(producerId);
              globalConsumersVideo.current.delete(producerId);
            });

            globalConsumersVideo.current.set(producerId, consumer);
            const stream = new MediaStream();
            stream.addTrack(consumer.track);
            globalConsumersVideoStream.current.set(producerId, stream);
            // this.emitterService.emit(EmitterEnum.ON_UPDATE_VIDEO_STREAM)
          }
        );
      }

      if (kind === "audio") {
        globalSocket.current!.emit(
          "media",
          {
            broadcastId: globalBroadcastId.current,
            msg: {
              event: "consume",
              data: { rtpCapabilities, user_id: producerId, kind: "audio" },
            },
          },
          async (
            consumeData: mediasoupClient.types.ConsumerOptions<mediasoupClient.types.AppData>
          ) => {
            const consumer = await globalConsumerTransport.current!.consume(
              consumeData
            );

            // 'trackended' | 'transportclose'
            consumer.on("transportclose", () => {
              console.log("remote producer closed");
              globalConsumersAudioStream.current.delete(producerId);
              globalConsumersAudio.current.delete(producerId);
            });

            globalConsumersAudio.current.set(producerId, consumer);
            const stream = new MediaStream();
            stream.addTrack(consumer.track);
            globalConsumersAudioStream.current.set(producerId, stream);
            // this.emitterService.emit(EmitterEnum.ON_UPDATE_VIDEO_STREAM)
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const invite = (users: string[]): void => {
    if (globalIsOwner.current) {
      globalSocket.current!.emit("invite-members", {
        users,
      });
    } else throw new Error("forbidden");
  };

  const initSocketClient = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        globalSocket.current = await SocketClientService.build();

        globalSocket.current.on("connection-accepted", () => {
          resolve();
        });

        globalSocket.current.on("error", (err: any) => {
          // this.emitterService.emit(EmitterEnum.ON_NEED_STREAM_ACCESS, err);
          console.log("socket error: ", err);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const createProducerTransport = (): Promise<void> => {
    return new Promise(async (res, rej) => {
      try {
        if (!globalSocket.current) {
          rej();
          return;
        }
        globalSocket.current!.emit(
          "media",
          {
            broadcastId: globalBroadcastId,
            msg: {
              event: "createWebRtcTransport",
              data: { type: "producer" },
            },
          },
          (data: {
            params: mediasoupClient.types.TransportOptions<mediasoupClient.types.AppData>;
          }) => {
            globalProducerTransport.current =
              globalDevice.current!.createSendTransport(data.params);

            // 'connect' | 'produce' | 'producedata' | 'connectionstatechange'
            globalProducerTransport.current.on(
              "connect",
              async (
                { dtlsParameters }: any,
                callback: () => void,
                errback: (arg0: any) => void
              ) => {
                try {
                  globalSocket.current!.emit("media", {
                    broadcastId: globalBroadcastId.current,
                    msg: {
                      event: "connectWebRtcTransport",
                      data: { dtlsParameters, type: "producer" },
                    },
                  });
                  console.log("connectWebRtcTransport");
                  callback();
                } catch (error: any) {
                  errback(error);
                }
              }
            );

            globalProducerTransport.current.on(
              "produce",
              async (
                parameters: { kind: any; rtpParameters: any; appData: any },
                callback: (arg0: { id: any }) => void,
                errback: (arg0: any) => void
              ) => {
                try {
                  globalSocket.current!.emit(
                    "media",
                    {
                      broadcastId: globalBroadcastId.current,
                      msg: {
                        event: "produce",
                        data: {
                          kind: parameters.kind,
                          rtpParameters: parameters.rtpParameters,
                          appData: parameters.appData,
                        },
                      },
                    },
                    ({ id }: any) => {
                      console.log("on produce");
                      callback({ id });
                    }
                  );
                } catch (error: any) {
                  errback(error);
                }
              }
            );

            globalProducerTransport.current.on(
              "connectionstatechange",
              async (state: TState) => {
                switch (state) {
                  case "connecting":
                    console.log("transport connecting");
                    globalSendStreamLoader.current = "connecting";
                    break;
                  case "connected":
                    console.log("transport connected");
                    globalSendStreamLoader.current = "connected";
                    break;
                  case "failed":
                    console.log("transport failed");
                    globalSendStreamLoader.current = "failed";
                    globalProducerTransport.current!.close();
                    leave();
                    rej();
                    break;
                  default:
                    break;
                }
              }
            );

            res();
          }
        );
      } catch (error) {
        rej(error);
      }
    });
  };

  const createConsumerTransport = (): Promise<void> => {
    return new Promise(async (res, rej) => {
      try {
        globalSocket.current!.emit(
          "media",
          {
            broadcastId: globalBroadcastId.current,
            msg: {
              event: "createWebRtcTransport",
              data: { type: "consumer" },
            },
          },
          (data: {
            params: mediasoupClient.types.TransportOptions<mediasoupClient.types.AppData>;
          }) => {
            globalConsumerTransport.current! =
              globalDevice.current!.createRecvTransport(data.params);

            // 'connect' | 'connectionstatechange'
            globalConsumerTransport.current!.on(
              "connect",
              async (
                { dtlsParameters }: any,
                callback: () => void,
                errback: (arg0: any) => void
              ) => {
                try {
                  globalSocket.current!.emit(
                    "media",
                    {
                      broadcastId: globalBroadcastId.current,
                      msg: {
                        event: "connectWebRtcTransport",
                        data: { dtlsParameters, type: "consumer" },
                      },
                    },
                    () => {
                      callback();
                    }
                  );
                } catch (error: any) {
                  errback(error);
                }
              }
            );

            globalConsumerTransport.current!.on(
              "connectionstatechange",
              async (state: TState) => {
                switch (state) {
                  case "connecting":
                    console.log("consumer connecting");
                    globalReceiveStreamLoader.current = "connecting";
                    break;
                  case "connected":
                    console.log("consumer connected");
                    globalReceiveStreamLoader.current = "connected";
                    break;
                  case "failed":
                    console.log("consumer failed");
                    globalReceiveStreamLoader.current = "failed";
                    globalConsumerTransport.current!.close();
                    leave();
                    rej();
                    break;
                  default:
                    break;
                }
              }
            );

            res();
          }
        );
      } catch (error) {
        console.log(error);
        rej(error);
      }
    });
  };

  const connectSendTransport = async (): Promise<void> => {
    try {
      if (globalDevice.current!.canProduce("audio")) {
        if (!hasGetUserMedia()) {
          throw new Error(
            "Your browser does not support video chat. Please update your browser or use a different one."
          );
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        const localAudio = stream.getAudioTracks()[0];
        if (localAudio) {
          if (
            globalProducerTransport.current &&
            !globalProducerTransport.current.closed
          ) {
            globalAudioProducer.current =
              await globalProducerTransport.current.produce({
                track: localAudio,
              });
            globalLocalAudio.current = new MediaStream([localAudio]);
            globalAudioProducer.current.on("trackended", () => {
              console.log("track ended");
              globalSendStreamLoader.current = "trackEnded";
              // close audio track
            });

            globalAudioProducer.current.on("transportclose", () => {
              console.log("producer closed");
              globalSendStreamLoader.current = "producerClosed";
              // close audio track
            });
            console.log("track sent.");
          } else {
            throw new Error("producer is closed");
          }
        } else {
          throw new Error("invalid stream");
        }
      } else {
        throw new Error("cannot use audio");
      }
    } catch (error) {
      throw error;
    }
  };

  const hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const leave = () => {
    if (globalSocket.current) {
      globalSocket.current.emit("leave-room", {
        broadcastId: globalBroadcastId.current,
      });
    }
  };

  const closeConsumer = (producerId: string) => {
    const videoConsumer = globalConsumersVideo.current.get(producerId);
    const audioConsumer = globalConsumersAudio.current.get(producerId);

    if (videoConsumer && audioConsumer) {
      videoConsumer.close();
      audioConsumer.close();
      globalConsumersVideo.current.delete(producerId);
      globalConsumersAudio.current.delete(producerId);
      globalConsumersVideoStream.current.delete(producerId);
      globalConsumersVideoStream.current.delete(producerId);
    }
  };

  return {
    toast,
    createRoom,
    joinRoom,
  };
};
