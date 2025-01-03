import { CreateBroadcastDto } from "@/stream/types/Broadcast";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import { areStringsEquals } from "@/stream/utils/string.utils";
import { Transport } from "mediasoup-client/lib/Transport";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { TState } from "@/stream/types/interfaces";

export const useAMA = (
  socketInstance: Socket,
  deviceInstance: mediasoupClient.Device
) => {
  const globalConsumersAudioStream = useRef<Map<string, MediaStream>>(
    new Map()
  );
  const globalConsumersAudio = useRef<Map<string, Consumer>>(new Map());
  const globalAudioProducer = useRef<Producer | null>(null);
  const globalSocket = useRef<Socket | null>(socketInstance);
  const globalDevice = useRef<mediasoupClient.Device | null>(deviceInstance);
  const globalUserId = useRef<string | null>(null);
  const globalBroadcastId = useRef<string | null>(null);
  const globalRtpCapabilities = useRef<any>(null);
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

  useEffect(() => {
    globalSocket.current = socketInstance;
    globalDevice.current = deviceInstance;
  }, [deviceInstance, socketInstance]);

  const createRoom = (input: CreateBroadcastDto, userId: string) => {
    return new Promise((res, rej) => {
      if (!globalSocket.current) {
        rej();
        return;
      }
      globalSocket.current.emit("create-room", input, async (data: any) => {
        if (!data) {
          rej();

          return;
        }

        globalUserId.current = userId;
        globalBroadcastId.current = data.id;
        globalRtpCapabilities.current = data.rtpCapabilities;
        if (!globalDevice.current!.loaded) {
          try {
            await globalDevice.current!.load({
              routerRtpCapabilities: globalRtpCapabilities.current,
            });
          } catch (error) {
            leave();
            rej(error);

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
          rej(error);

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
          // this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
          //   message: "AMA has been finished",
          //   type: "info",
          // });
        });

        globalSocket.current!.on("user-disconnected", async (data: any) => {
          if (areStringsEquals(globalUserId.current!, data.id)) {
            close();
            // this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
            //   message: "AMA has been finished",
            //   type: "info",
            // });
          } else {
            closeConsumer(data.id);
            // this.emitterService.emit(
            //   EventNameEnum.ON_USER_DISCONNECTED_FROM_TALK,
            //   data
            // );
          }
        });

        // this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
        //   message: "AMA started",
        //   type: "info",
        // });
        res(true);
      });
    });
  };

  const joinRoom = (id: string, userId: string) => {
    return new Promise((res, rej) => {
      globalSocket.current!.emit(
        "join-room",
        { broadcastId: id, device: "" },
        async (data: { rtpCapabilities: any }) => {
          if (!data) {
            rej();

            return;
          }

          globalUserId.current = userId;
          globalBroadcastId.current = id;
          globalRtpCapabilities.current = data.rtpCapabilities;
          if (!globalDevice || !globalDevice.current!.loaded) {
            try {
              await globalDevice.current!.load({
                routerRtpCapabilities: globalRtpCapabilities.current,
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
            // this.emitterService.emit(EmitterEnum.ON_UPDATE_CONSUMER);
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
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

    // this.emitterService.emit(EmitterEnum.ON_UPDATE_CONSUMER);
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
    // this.emitterService.emit(EmitterEnum.ON_FINISH_BROADCAST)
  };

  const hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  return {
    toast,
    createRoom,
    joinRoom,
    invite,
    toggleMemberTalkPermission,
    toggleMessagePermission,
    kickUser,
    toggleMute,
    leave,
  };
};
