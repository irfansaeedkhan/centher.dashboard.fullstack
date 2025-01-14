import * as mediasoupClient from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { Transport } from "mediasoup-client/lib/Transport";
import { Socket } from "socket.io-client";
import { CreateBroadcastDto } from "../types/Broadcast";
import { EventNameEnum } from "../enum/event-name.enum";
import { TState } from "../types/interfaces";
import { IEventBus } from "../types/event-bus";

export class LiveAgent<T extends IEventBus, K extends Socket> {
  private rtpCapabilities!: any;
  private socket!: K;
  private device!: mediasoupClient.Device;

  private producerTransport!: Transport | null;
  private consumerTransport!: Transport;

  private audioProducer!: Producer | null;
  private videoProducer!: Producer | null;

  private consumersVideo: Map<string, Consumer> = new Map();
  private consumersAudio: Map<string, Consumer> = new Map();

  public consumersVideoStream: Map<string, MediaStream> = new Map();
  public consumersAudioStream: Map<string, MediaStream> = new Map();

  public hasTalkRequest = false;

  public localAudio!: MediaStream;
  public localVideo!: MediaStream;

  public sendStreamLoader:
    | "connecting"
    | "connected"
    | "failed"
    | "trackEnded"
    | "producerClosed"
    | "none" = "none";
  public receiveStreamLoader: "connecting" | "connected" | "failed" | "none" =
    "none";

  public isOwner = false;
  private emitterService: T;
  broadcastId!: string;

  constructor(socket: K, emitterService: T) {
    this.socket = socket;
    this.device = new mediasoupClient.Device();
    this.emitterService = emitterService;
  }

  public getStatuses(): {
    sendStreamLoader: string;
    receiveStreamLoader: string;
  } {
    return {
      sendStreamLoader: this.sendStreamLoader,
      receiveStreamLoader: this.receiveStreamLoader,
    };
  }

  public get isMuted() {
    return this.audioProducer ? this.audioProducer.paused : true;
  }

  public async createRoom(input: CreateBroadcastDto) {
    return new Promise((res, rej) => {
      this.socket.emit("create-room", input, async (data: any) => {
        if (!data) {
          rej();

          return;
        }

        this.broadcastId = data.id;
        this.rtpCapabilities = data.rtpCapabilities.rtpCapabilities;
        if (!this.device.loaded) {
          try {
            await this.device.load({
              routerRtpCapabilities: this.rtpCapabilities,
            });
          } catch (error) {
            await this.leave();
            rej(error);

            return;
          }
        }

        try {
          await this.createProducerTransport();
          await this.createConsumerTransport();
          await this.connectSendTransport();
          this.isOwner = true;
        } catch (error) {
          await this.leave();
          rej(error);

          return;
        }

        this.socket.on("broadcast-finished", async () => {
          this.close();
        });

        this.socket.on("user-disconnected", async (data: any) => {
          this.emitterService.emit(
            EventNameEnum.ON_USER_DISCONNECTED_FROM_TALK,
            data
          );
        });

        res(true);
      });
    });
  }

  public async joinRoom(id: string) {
    return new Promise((res, rej) => {
      this.socket.emit(
        "join-room",
        { broadcastId: id, device: "" },
        async (data: any) => {
          if (!data) {
            rej();

            return;
          }

          this.broadcastId = id;
          this.rtpCapabilities = data.rtpCapabilities;
          if (!this.device.loaded) {
            try {
              await this.device.load({
                routerRtpCapabilities: this.rtpCapabilities,
              });
            } catch (error) {
              await this.leave();
              rej(error);
            }
          }

          try {
            await this.createConsumerTransport();
          } catch (error) {
            await this.leave();

            rej(error);
          }

          this.socket.emit(
            "media",
            {
              broadcastId: this.broadcastId,
              msg: { event: "get-producers", data: null },
            },
            (data: any) => {
              data.forEach((producer: any) => {
                this.newProducerJoined(producer, "video").then();
                this.newProducerJoined(producer, "audio").then();
              });
            }
          );

          this.socket.on("consumer-closed", async (data: any) => {
            this.closeConsumer(data.user_id);
          });

          this.socket.on("broadcast-finished", async () => {
            this.close();
          });

          this.socket.on("user-kicked", async () => {
            this.close();
          });

          this.socket.on("user-disconnected", async (data: any) => {
            this.closeConsumer(data.id);
          });

          res(true);
        }
      );
    });
  }
  public async invite(users: string[]): Promise<void> {
    if (this.isOwner) {
      this.socket.emit("invite-members", {
        users,
      });
    } else throw new Error("forbidden");
  }

  //only owner
  public async toggleMessagePermission(userId: string) {
    if (this.isOwner) {
      this.socket.emit("toggle-messaging-permission", {
        broadcastId: this.broadcastId,
        userId: userId,
      });
    } else throw new Error("forbidden");
  }

  //only owner
  public async kickUser(userId: string) {
    if (this.isOwner) {
      this.socket.emit("kick-user", {
        broadcastId: this.broadcastId,
        userId,
      });
    } else throw new Error("forbidden");
  }

  public async toggleMute() {
    if (this.audioProducer) {
      if (this.audioProducer.paused) {
        this.audioProducer.resume();
      } else {
        this.audioProducer.pause();
      }
    }
  }

  // for owner it finished broadcast, for participants its leave room
  public async leave() {
    this.socket.emit("leave-room", {
      broadcastId: this.broadcastId,
    });
  }

  private async newProducerJoined(producerId: string, kind: string) {
    try {
      const { rtpCapabilities } = this.device;
      if (kind === "video") {
        await this.socket.emit(
          "media",
          {
            broadcastId: this.broadcastId,

            msg: {
              event: "consume",
              data: { rtpCapabilities, user_id: producerId, kind: "video" },
            },
          },
          async (consumeData: any) => {
            const consumer = await this.consumerTransport.consume(consumeData);

            // 'trackended' | 'transportclose'
            consumer.on("transportclose", () => {
              console.log("remote producer closed");
              this.consumersVideoStream.delete(producerId);
              this.consumersVideo.delete(producerId);
            });

            this.consumersVideo.set(producerId, consumer);
            const stream = new MediaStream();
            stream.addTrack(consumer.track);
            this.consumersVideoStream.set(producerId, stream);
            this.emitterService.emit(EventNameEnum.ON_UPDATE_VIDEO_STREAM);
          }
        );
      }

      if (kind === "audio") {
        await this.socket.emit(
          "media",
          {
            broadcastId: this.broadcastId,
            msg: {
              event: "consume",
              data: { rtpCapabilities, user_id: producerId, kind: "audio" },
            },
          },
          async (consumeData: any) => {
            const consumer = await this.consumerTransport.consume(consumeData);

            // 'trackended' | 'transportclose'
            consumer.on("transportclose", () => {
              console.log("remote producer closed");
              this.consumersAudioStream.delete(producerId);
              this.consumersAudio.delete(producerId);
            });

            this.consumersAudio.set(producerId, consumer);
            const stream = new MediaStream();
            stream.addTrack(consumer.track);
            this.consumersAudioStream.set(producerId, stream);
            this.emitterService.emit(EventNameEnum.ON_UPDATE_VIDEO_STREAM);
          }
        );
      }
    } catch (error: any) {
      console.error(error.message, error.stack);
    }
  }
  private async createProducerTransport(): Promise<void> {
    return new Promise(async (res, rej) => {
      try {
        await this.socket.emit(
          "media",
          {
            broadcastId: this.broadcastId,
            msg: {
              event: "createWebRtcTransport",
              data: { type: "producer" },
            },
          },
          (data: any) => {
            this.producerTransport = this.device.createSendTransport(
              data.params
            );

            // 'connect' | 'produce' | 'producedata' | 'connectionstatechange'
            this.producerTransport.on(
              "connect",
              async ({ dtlsParameters }: any, callback: any, errback: any) => {
                try {
                  await this.socket.emit("media", {
                    broadcastId: this.broadcastId,
                    msg: {
                      event: "connectWebRtcTransport",
                      data: { dtlsParameters, type: "producer" },
                    },
                  });
                  callback();
                } catch (error) {
                  errback(error);
                }
              }
            );

            this.producerTransport.on(
              "produce",
              async (parameters: any, callback: any, errback: any) => {
                try {
                  await this.socket.emit(
                    "media",
                    {
                      broadcastId: this.broadcastId,
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
                      callback({ id });
                    }
                  );
                } catch (error) {
                  errback(error);
                }
              }
            );

            this.producerTransport.on(
              "connectionstatechange",
              async (state: TState) => {
                switch (state) {
                  case "connecting":
                    console.log("producer connecting...");
                    this.sendStreamLoader = "connecting";
                    break;
                  case "connected":
                    console.log("producer connected");
                    this.sendStreamLoader = "connected";
                    break;
                  case "failed":
                    console.log("producer failed");
                    this.sendStreamLoader = "failed";
                    this.producerTransport?.close();
                    await this.leave();
                    break;
                  default:
                    break;
                }
              }
            );
            res();
          }
        );
      } catch (error: any) {
        console.error("ERROR:::", error.message, error.stack);
        rej(error);
      }
    });
  }
  private async createConsumerTransport(): Promise<void> {
    return new Promise(async (res, rej) => {
      try {
        await this.socket.emit(
          "media",
          {
            broadcastId: this.broadcastId,
            msg: {
              event: "createWebRtcTransport",
              data: { type: "consumer" },
            },
          },
          (data: any) => {
            this.consumerTransport = this.device.createRecvTransport(
              data.params
            );

            // 'connect' | 'connectionstatechange'
            this.consumerTransport.on(
              "connect",
              async ({ dtlsParameters }: any, callback: any, errback: any) => {
                try {
                  this.socket.emit(
                    "media",
                    {
                      broadcastId: this.broadcastId,
                      msg: {
                        event: "connectWebRtcTransport",
                        data: { dtlsParameters, type: "consumer" },
                      },
                    },
                    () => {
                      callback();
                    }
                  );
                } catch (error) {
                  errback(error);
                }
              }
            );

            this.consumerTransport.on(
              "connectionstatechange",
              async (state: TState) => {
                switch (state) {
                  case "connecting":
                    console.log("consumer connecting...");
                    this.receiveStreamLoader = "connecting";
                    break;
                  case "connected":
                    console.log("consumer connected.");
                    this.receiveStreamLoader = "connected";
                    break;
                  case "failed":
                    console.log("consumer failed.");
                    this.receiveStreamLoader = "failed";
                    this.consumerTransport.close();
                    await this.leave();
                    break;
                  default:
                    break;
                }
              }
            );

            res();
          }
        );
      } catch (error: any) {
        console.error(error.message, error.stack);
        rej(error);
      }
    });
  }
  private async connectSendTransport(): Promise<void> {
    try {
      if (this.device.canProduce("video") && this.device.canProduce("audio")) {
        if (!this.hasGetUserMedia()) {
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
          if (this.producerTransport && !this.producerTransport.closed) {
            this.audioProducer = await this.producerTransport.produce({
              track: localAudio,
            });
            this.localAudio = new MediaStream([localAudio]);
            this.videoProducer = await this.producerTransport.produce({
              codecOptions: {
                videoGoogleStartBitrate: 1000,
              },
              track: localVideo,
            });

            this.localVideo = new MediaStream([localVideo]);

            this.audioProducer.on("trackended", () => {
              this.sendStreamLoader = "trackEnded";
              console.log("audio track ended");
              // close audio track
            });

            this.audioProducer.on("transportclose", () => {
              this.sendStreamLoader = "producerClosed";
              console.log("audio transport ended");
              // close audio track
            });

            this.videoProducer.on("trackended", () => {
              this.sendStreamLoader = "trackEnded";
              console.log("video track ended");
              // close video track
            });

            this.videoProducer.on("transportclose", () => {
              this.sendStreamLoader = "producerClosed";
              console.log("video transport ended");

              // close video track
            });
            console.log("tracks sent.");
            this.emitterService.emit(EventNameEnum.ON_UPDATE_VIDEO_STREAM);
          } else throw new Error("producer is closed");
        } else throw new Error("invalid local streams");
      } else throw new Error("cannot use video or audio");
    } catch (error) {
      throw error;
    }
  }
  private closeConsumer(producerId: string) {
    const videoConsumer = this.consumersVideo.get(producerId);
    const audioConsumer = this.consumersAudio.get(producerId);

    if (videoConsumer && audioConsumer) {
      videoConsumer.close();
      audioConsumer.close();
      this.consumersVideo.delete(producerId);
      this.consumersAudio.delete(producerId);
      this.consumersVideoStream.delete(producerId);
      this.consumersVideoStream.delete(producerId);
    }
  }
  private closeProducer() {
    if (this.audioProducer) {
      this.audioProducer.close();
      this.videoProducer?.close();
      this.producerTransport?.close();
      this.audioProducer = null;
      this.videoProducer = null;
      this.producerTransport = null;
    }
  }
  private close() {
    this.closeProducer();
    this.consumersAudio.forEach((e) => {
      e.close();
    });

    this.consumersVideo.forEach((e) => {
      e.close();
    });

    this.consumersVideo.clear();
    this.consumersAudio.clear();
    this.consumersVideoStream.clear();
    this.consumersVideoStream.clear();
    this.socket.close();
    this.socket.disconnect();
    this.emitterService.emit(EventNameEnum.ON_FINISH_BROADCAST);
  }
  private hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}
