import { useRef, useState } from "react";
import { Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import { Transport } from "mediasoup-client/lib/Transport";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { CreateBroadcastDto } from "@/stream/types/Broadcast";
import { areStringsEquals } from "@/stream/utils/string.utils";
import { TState } from "@/stream/types/interfaces";
import { SocketClientService } from "@/stream/clients/socket-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { StreamEventEnum, StreamSubscriptionEnum } from "@/stream/model";
import { IStreamEvent } from "./interfaces";

export interface AMAStreamType {
  toast: string;
  event: IStreamEvent | null;
  consumersAudio: Map<string, Consumer>;
  audioProducer: Producer | null;
  createRoom: (input: CreateBroadcastDto, userId: string) => Promise<any>;
  joinRoom: (id: string, userId: string) => Promise<any>;
  invite: (users: string[]) => void;
  toggleMemberTalkPermission: (userId: string) => void;
  toggleMessagePermission: (userId: string) => void;
  kickUser: (userId: string) => void;
  toggleMute: () => void;
  leave: () => void;
  requestToTalk: (request: boolean) => void;
  closeSubscription: (key: keyof typeof StreamSubscriptionEnum) => void;
  globalIsOwner: boolean;
}

export interface AMAHookParams {
  deviceInstance: mediasoupClient.Device;
}

export type AMAHook = (params: AMAHookParams) => AMAStreamType;

export const useAMA: AMAHook = ({ deviceInstance }) => {
  const globalConsumersAudioStream = useRef<Map<string, MediaStream>>(
    new Map()
  );
  const globalConsumersAudio = useRef<Map<string, Consumer>>(new Map());
  const globalAudioProducer = useRef<Producer | null>(null);
  const globalSocket = useRef<Socket | null>(null);
  const globalDevice = useRef<mediasoupClient.Device>(deviceInstance);
  const globalUserId = useRef<string | null>(null);
  const globalBroadcastId = useRef<string | null>(null);
  const globalRtpCapabilities = useRef<RtpCapabilities | null>(null);
  const globalIsOwner = useRef<boolean>(false);
  const globalHasTalkRequest = useRef<boolean>(false);
  const globalProducerTransport = useRef<Transport | null>(null);
  const globalConsumerTransport = useRef<Transport | null>(null);
  const globalLocalAudio = useRef<MediaStream | null>(null);
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

  const createRoom = async (input: CreateBroadcastDto, userId: string) => {
    if (!globalSocket.current) {
      await initSocketClient();
    }

    globalSocket.current!.emit("create-room", input, async (data: any) => {
      if (!data) {
        return;
      }

      setEvent({
        data,
        type: StreamEventEnum.ON_CREATE_CENTALK,
      });

      globalUserId.current = userId;
      globalBroadcastId.current = data.id;
      globalRtpCapabilities.current = data.rtpCapabilities;
      if (!globalDevice.current!.loaded) {
        try {
          await globalDevice.current!.load({
            routerRtpCapabilities: globalRtpCapabilities.current!,
          });
        } catch (error) {
          leave();
          console.error(error);
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

      globalSocket.current!.on("new-producer-joined", (data: any) => {
        newProducerJoined(data.user_id, data.kind);
      });

      globalSocket.current!.on("consumer-closed", async (data: any) => {
        if (areStringsEquals(globalUserId.current!, data.user_id)) {
          closeProducer();
        } else {
          closeConsumer(data.user_id);
        }
      });

      globalSocket.current!.on("broadcast-finished", async () => {
        close();
        setToast("AMA has been finished");
      });

      globalSocket.current!.on("user-disconnected", async (data: any) => {
        if (areStringsEquals(globalUserId.current!, data.id)) {
          close();
          setToast("AMA has been finished");
        } else {
          closeConsumer(data.id);
          setEvent({
            data: data,
            type: StreamEventEnum.ON_USER_DISCONNECTED_FROM_TALK,
          });
        }
      });

      setToast("AMA started");
    });
  };

  const joinRoom = (id: string, userId: string) => {
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

          globalUserId.current = userId;
          globalBroadcastId.current = id;
          globalRtpCapabilities.current = data.rtpCapabilities;
          if (!globalDevice || !globalDevice.current!.loaded) {
            try {
              await globalDevice.current!.load({
                routerRtpCapabilities: globalRtpCapabilities.current!,
              });
            } catch (error) {
              await leave();
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
            (data: any) => {
              data.forEach((producer: any) => {
                newProducerJoined(producer, "audio");
              });
            }
          );

          globalSocket.current!.on("toggle-talk-permission", async (data) => {
            if (data && globalHasTalkRequest.current) {
              globalHasTalkRequest.current = false;
              await createProducerTransport();
              await connectSendTransport();
              // toast.showInfo("Owner opened your talk");
              setToast("Owner opened your talk");
            } else {
              closeProducer();
              // toast.showInfo("Owner muted you");
              setToast("Owner muted you");
            }
          });

          globalSocket.current!.on("new-producer-joined", async (data) => {
            newProducerJoined(data.user_id, data.kind);
          });

          globalSocket.current!.on("consumer-closed", async (data) => {
            if (areStringsEquals(globalUserId.current!, data.user_id)) {
              closeProducer();
            } else {
              closeConsumer(data.user_id);
            }
          });

          globalSocket.current!.on("broadcast-finished", async () => {
            close();
            // toast.showInfo("AMA has been finished");
            setToast("AMA has been finished");
          });

          globalSocket.current!.on("user-kicked", async () => {
            close();
            // toast.showInfo("Owner has kicked you");
            setToast("Owner has kicked you");
          });

          globalSocket.current!.on("user-disconnected", async (data) => {
            if (areStringsEquals(globalUserId.current!, data.id)) {
              close();
              // toast.showInfo("AMA has been finished");
              setToast("AMA has been finished");
            } else {
              closeConsumer(data.id);
            }
          });

          // toast.showSuccess("Joined");
          setToast("Joined");
          res(true);
        }
      );
    });
  };

  const invite = (users: string[]): void => {
    if (globalIsOwner.current) {
      globalSocket.current!.emit("invite-members", {
        users,
      });
    } else throw new Error("forbidden");
  };

  //only owner
  const toggleMemberTalkPermission = (userId: string) => {
    if (globalIsOwner.current) {
      globalSocket.current!.emit("media", {
        broadcastId: globalBroadcastId.current,
        msg: { event: "toggleMemberTalkPermission", data: { user_id: userId } },
      });
    } else throw new Error("forbidden");
  };

  //only owner
  const toggleMessagePermission = (userId: string) => {
    if (globalIsOwner.current) {
      globalSocket.current!.emit("toggle-messaging-permission", {
        broadcastId: globalBroadcastId.current,
        userId,
      });
    } else throw new Error("forbidden");
  };

  //only owner
  const kickUser = (userId: string) => {
    if (globalIsOwner.current) {
      globalSocket.current!.emit("kick-user", {
        broadcastId: globalBroadcastId.current,
        userId,
      });
    } else throw new Error("forbidden");
  };

  const toggleMute = () => {
    if (globalAudioProducer.current!.paused) {
      globalAudioProducer.current!.resume();
    } else {
      globalAudioProducer.current!.pause();
    }
  };

  // for owner it finished broadcast, for participants its leave room
  const leave = () => {
    globalSocket.current!.emit("leave-room", {
      broadcastId: globalBroadcastId,
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
          (data: { params: any }) => {
            console.log("createWebRtcTransport", data);
            globalProducerTransport.current =
              globalDevice.current.createSendTransport(data.params);

            // 'connect' | 'produce' | 'producedata' | 'connectionstatechange'
            globalProducerTransport.current.on(
              "connect",
              async ({ dtlsParameters }, callback, errback) => {
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
              async (parameters, callback, errback) => {
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
              async ({ dtlsParameters }, callback, errback) => {
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

  const newProducerJoined = (producerId: string, kind: string) => {
    try {
      const { rtpCapabilities } = globalDevice.current!;
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
              console.log("remote producer closed.");
              globalConsumersAudioStream.current.delete(producerId);
              globalConsumersAudio.current.delete(producerId);
            });

            globalConsumersAudio.current.set(producerId, consumer);
            const stream = new MediaStream();
            stream.addTrack(consumer.track);
            globalConsumersAudioStream.current.set(producerId, stream);
            setEvent({
              data: null,
              type: StreamEventEnum.ON_UPDATE_CONSUMER,
            });
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const requestToTalk = (request: boolean) => {
    globalHasTalkRequest.current = request;
    globalSocket.current!.emit("request-to-talk", { request });
    setToast("Talk request has been sent to owner");
  };

  const closeProducer = () => {
    if (globalAudioProducer.current) {
      globalAudioProducer.current.close();
      globalProducerTransport.current!.close();
      globalAudioProducer.current = null;
      globalProducerTransport.current = null;
    }
  };

  const closeConsumer = (producerId: string) => {
    const audioConsumer = globalConsumersAudio.current.get(producerId);

    if (audioConsumer) {
      audioConsumer.close();
      globalConsumersAudio.current.delete(producerId);
      globalConsumersAudioStream.current.delete(producerId);
    }

    setEvent({
      data: null,
      type: StreamEventEnum.ON_UPDATE_CONSUMER,
    });
  };

  const close = () => {
    closeProducer();
    globalConsumersAudio.current.forEach((e) => {
      e.close();
    });

    globalConsumersAudio.current.clear();
    globalConsumersAudioStream.current.clear();
    globalSocket.current!.close();
    globalSocket.current!.disconnect();

    setEvent({
      data: null,
      type: StreamEventEnum.ON_FINISH_BROADCAST,
    });
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

  const hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const initSocketClient = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        globalSocket.current = await SocketClientService.build();

        globalSocket.current.on("connection-accepted", () => {
          resolve();
        });

        globalSocket.current.on("error", ({ data }: any) => {
          setEvent({
            data,
            type: StreamEventEnum.STREAM_INITIALIZATION_ERROR,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  return {
    toast,
    event,
    audioProducer: globalAudioProducer.current,
    consumersAudio: globalConsumersAudio.current,
    globalIsOwner: globalIsOwner.current,
    createRoom,
    joinRoom,
    invite,
    toggleMemberTalkPermission,
    toggleMessagePermission,
    kickUser,
    toggleMute,
    leave,
    requestToTalk,
    closeSubscription,
  };
};
