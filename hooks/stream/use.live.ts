import { useRef, useState } from "react";
import { Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { Transport } from "mediasoup-client/lib/Transport";
import { TState } from "@/stream/types/interfaces";
import { SocketClientService } from "@/stream/clients/socket-client";
import { CreateBroadcastDto } from "@/stream/types/Broadcast";
import { StreamEventEnum, StreamSubscriptionEnum } from "@/stream/model";
import { IStreamEvent } from "./interfaces";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";

export interface LiveStreamType {
  toast: string;
  event: IStreamEvent | null;
  consumersAudio: Map<string, Consumer>;
  consumersVideo: Map<string, Consumer>;
  audioProducer: Producer | null;
  videoProducer: Producer | null;
  globalIsOwner: boolean;
  createRoom: (input: CreateBroadcastDto, userId: string) => Promise<any>;
  joinRoom: (id: string, userId: string) => Promise<any>;
  getStatuses: () => { sendStreamLoader: string; receiveStreamLoader: string };
  invite: (users: string[]) => void;
  close: () => void;
  leave: () => void;
  kickUser: (userId: string) => void;
  toggleMute: () => void;
  toggleMessagePermission: (userId: string) => void;
  closeSubscription: (key: keyof typeof StreamSubscriptionEnum) => void;
}

export interface LiveHookParams {
  deviceInstance: mediasoupClient.Device;
}

export type LiveHook = (params: LiveHookParams) => LiveStreamType;

export const useLive: LiveHook = ({ deviceInstance }) => {
  const globalSocket = useRef<Socket | null>(null);

  const globalBroadcastId = useRef<string | null>(null);
  const globalRtpCapabilities = useRef<RtpCapabilities | null>(null);
  const globalDevice = useRef<mediasoupClient.Device>(deviceInstance);

  const globalConsumersAudioStream = useRef<Map<string, MediaStream>>(
    new Map()
  );
  const globalConsumersVideoStream = useRef<Map<string, MediaStream>>(
    new Map()
  );

  const globalConsumersAudio = useRef<Map<string, Consumer>>(new Map());
  const globalConsumersVideo = useRef<Map<string, Consumer>>(new Map());

  const globalAudioProducer = useRef<Producer | null>(null);
  const globalVideoProducer = useRef<Producer | null>(null);

  const globalIsOwner = useRef<boolean>(false);

  const globalProducerTransport = useRef<Transport | null>(null);
  const globalConsumerTransport = useRef<Transport | null>(null);

  const globalLocalAudio = useRef<MediaStream | null>(null);
  const globalLocalVideo = useRef<MediaStream | null>(null);
  const [subscriptionAgents, setSubscriptionAgents] = useState<
    Record<keyof typeof StreamSubscriptionEnum, any>
  >({
    [StreamSubscriptionEnum.SUBSCRIBE_ALL]: null,
    [StreamSubscriptionEnum.SUBSCRIBE_SPEAKERS]: null,
    [StreamSubscriptionEnum.SUBSCRIBE_MESSAGE]: null,
    [StreamSubscriptionEnum.SUBSCRIBE_CURRENT_USER]: null,
    [StreamSubscriptionEnum.SUBSCRIBE_HAS_TALK_REQUEST_USERS]: null,
    [StreamSubscriptionEnum.SUBSCRIBE_CURRENT_STREAM]: null,
  });
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
  const [event, setEvent] = useState<IStreamEvent | null>(null);

  const getStatuses = (): {
    sendStreamLoader: string;
    receiveStreamLoader: string;
  } => {
    return {
      sendStreamLoader: globalSendStreamLoader.current,
      receiveStreamLoader: globalReceiveStreamLoader.current,
    };
  };

  const createRoom = async (input: CreateBroadcastDto) => {
    if (!globalSocket.current) {
      await initSocketClient();
    }

    globalSocket.current!.emit(
      "create-room",
      input,
      async (data: {
        id: string;
        rtpCapabilities: { rtpCapabilities: any };
      }) => {
        if (!data) {
          return;
        }

        setEvent({
          data,
          type: StreamEventEnum.ON_CREATE_CENTALK,
        });

        globalBroadcastId.current = data.id;
        globalRtpCapabilities.current = data.rtpCapabilities.rtpCapabilities;

        if (!globalDevice.current!.loaded) {
          try {
            await globalDevice.current!.load({
              routerRtpCapabilities: globalRtpCapabilities.current!,
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
          console.log("broadcast-finished");
          close();
        });

        globalSocket.current!.on("user-disconnected", async (data) => {
          console.log("user-disconnected", data);
          setEvent({
            data,
            type: StreamEventEnum.ON_USER_DISCONNECTED_FROM_TALK,
          });
        });
      }
    );
  };

  const joinRoom = (id: string) => {
    return new Promise(async (res, rej) => {
      if (!globalSocket.current) {
        await initSocketClient();
      }

      globalSocket.current!.emit(
        "join-room",
        { broadcastId: id, device: "" },
        async (data: { rtpCapabilities: any }) => {
          if (!data) {
            rej();

            return;
          }

          setEvent({
            data,
            type: StreamEventEnum.ON_JOINED_TO_BROADCAST,
          });

          globalBroadcastId.current = id;
          globalRtpCapabilities.current = data.rtpCapabilities;
          if (!globalDevice.current!.loaded) {
            try {
              await globalDevice.current!.load({
                routerRtpCapabilities: globalRtpCapabilities.current!,
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
            setEvent({
              type: StreamEventEnum.ON_UPDATE_VIDEO_STREAM,
              data: null,
            });
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
            setEvent({
              type: StreamEventEnum.ON_UPDATE_VIDEO_STREAM,
              data: null,
            });
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
          setEvent({
            type: StreamEventEnum.ON_NEED_STREAM_ACCESS,
            data: err,
          });
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
            broadcastId: globalBroadcastId.current,
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
          video: {
            width: {
              min: 640,
              max: 1920,
            },
            height: {
              min: 400,
              max: 1080,
            },
          },
        });

        const localAudio = stream.getAudioTracks()[0];
        const localVideo = stream.getVideoTracks()[0];

        if (localAudio && localVideo) {
          if (
            globalProducerTransport &&
            !globalProducerTransport.current!.closed
          ) {
            globalAudioProducer.current =
              await globalProducerTransport.current!.produce({
                track: localAudio,
              });
            globalLocalAudio.current = new MediaStream([localAudio]);
            globalVideoProducer.current =
              await globalProducerTransport.current!.produce({
                codecOptions: {
                  videoGoogleStartBitrate: 1000,
                },
                track: localVideo,
              });

            globalLocalVideo.current = new MediaStream([localVideo]);

            globalAudioProducer.current.on("trackended", () => {
              globalSendStreamLoader.current = "trackEnded";
              console.log("audio track ended");
              // close audio track
            });

            globalAudioProducer.current.on("transportclose", () => {
              globalSendStreamLoader.current = "producerClosed";
              console.log("audio transport ended");
              // close audio track
            });

            globalVideoProducer.current.on("trackended", () => {
              globalSendStreamLoader.current = "trackEnded";
              console.log("video track ended");
              // close video track
            });

            globalVideoProducer.current.on("transportclose", () => {
              globalSendStreamLoader.current = "producerClosed";
              console.log("video transport ended");

              // close video track
            });
            console.log("tracks sent.");
            setEvent({
              type: StreamEventEnum.ON_UPDATE_VIDEO_STREAM,
              data: null,
            });
          } else throw new Error("producer is closed");
        } else throw new Error("invalid local streams");
      } else throw new Error("cannot use video or audio");
    } catch (error) {
      throw error;
    }
  };

  const hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const toggleMessagePermission = (userId: string): void => {
    if (globalIsOwner.current) {
      globalSocket.current!.emit("toggle-messaging-permission", {
        broadcastId: globalBroadcastId.current,
        userId: userId,
      });
    } else throw new Error("forbidden");
  };

  const kickUser = (userId: string): void => {
    if (globalIsOwner.current) {
      globalSocket.current!.emit("kick-user", {
        broadcastId: globalBroadcastId.current,
        userId,
      });
    } else throw new Error("forbidden");
  };

  const toggleMute = (): void => {
    if (globalAudioProducer.current) {
      if (globalAudioProducer.current.paused) {
        globalAudioProducer.current.resume();
      } else {
        globalAudioProducer.current.pause();
      }
    }
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

  const closeProducer = () => {
    if (globalAudioProducer.current) {
      globalAudioProducer.current.close();
      globalVideoProducer.current?.close();
      globalProducerTransport.current?.close();
      globalAudioProducer.current = null;
      globalVideoProducer.current = null;
      globalProducerTransport.current = null;
    }
  };

  const closeSubscription = (key: keyof typeof StreamSubscriptionEnum) => {
    if (subscriptionAgents[key]) {
      subscriptionAgents[key].unsubscribe();
      setSubscriptionAgents((prev) => ({
        ...prev,
        [key]: null,
      }));
    }
  };

  const close = () => {
    closeProducer();
    globalConsumersAudio.current.forEach((consumer: Consumer) => {
      consumer.close();
    });

    globalConsumersVideo.current.forEach((consumer: Consumer) => {
      consumer.close();
    });

    globalConsumersVideo.current.clear();
    globalConsumersAudio.current.clear();
    globalConsumersVideoStream.current.clear();
    globalConsumersVideoStream.current.clear();
    globalSocket.current?.close();
    globalSocket.current?.disconnect();
  };

  return {
    toast,
    event,
    audioProducer: globalAudioProducer.current,
    videoProducer: globalVideoProducer.current,
    consumersAudio: globalConsumersAudio.current,
    consumersVideo: globalConsumersVideo.current,
    globalIsOwner: globalIsOwner.current,
    createRoom,
    joinRoom,
    getStatuses,
    invite,
    kickUser,
    toggleMute,
    toggleMessagePermission,
    closeSubscription,
    close,
    leave,
  };
};
