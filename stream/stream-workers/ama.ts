import * as mediasoupClient from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { Transport } from "mediasoup-client/lib/Transport";
import { Socket } from "socket.io-client";
import { CreateBroadcastDto } from "../types/Broadcast";
import { areStringsEquals } from "../utils/string.utils";
import { EventNameEnum } from "../enum/event-name.enum";
import { TState } from "../types/interfaces";
import { IEventBus } from "../types/event-bus";

export class AmaAgent<T extends IEventBus, K extends Socket> {
  public consumersAudioStream: Map<string, MediaStream> = new Map();
  public hasTalkRequest = false;
  public localAudio!: MediaStream;
  public broadcastId!: string;
  public sendStreamLoader:
    | "connecting"
    | "connected"
    | "failed"
    | "trackEnded"
    | "producerClosed"
    | "none" = "none";
  public receiveStreamLoader: "connecting" | "connected" | "failed" | "none" =
    "none";

  private rtpCapabilities!: any;
  private socket: K;
  private device: mediasoupClient.Device;
  private producerTransport!: Transport | null;
  private consumerTransport!: Transport;
  private audioProducer!: Producer | null;
  private consumersAudio: Map<string, Consumer> = new Map();
  public isOwner = false;
  private emitterService: T;
  private userId!: string;

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

  public async createRoom(input: CreateBroadcastDto, userId: string) {
    return new Promise((res, rej) => {
      this.socket.emit("create-room", input, async (data: any) => {
        if (!data) {
          rej();

          return;
        }

        this.userId = userId;
        this.broadcastId = data.id;
        this.rtpCapabilities = data.rtpCapabilities;
        if (!this.device.loaded) {
          try {
            await this.device.load({
              routerRtpCapabilities: this.rtpCapabilities,
            });
          } catch (error) {
            this.leave();
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

        this.socket.on("new-producer-joined", async (data: any) => {
          await this.newProducerJoined(data.user_id, data.kind);
        });

        this.socket.on("consumer-closed", async (data: any) => {
          if (areStringsEquals(this.userId, data.user_id)) {
            this.closeProducer();
          } else {
            this.closeConsumer(data.user_id);
          }
        });

        this.socket.on("broadcast-finished", async () => {
          this.close();
          this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
            message: "AMA has been finished",
            type: "info",
          });
        });

        this.socket.on("user-disconnected", async (data: any) => {
          if (areStringsEquals(this.userId, data.id)) {
            this.close();
            this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
              message: "AMA has been finished",
              type: "info",
            });
          } else {
            this.closeConsumer(data.id);
            this.emitterService.emit(
              EventNameEnum.ON_USER_DISCONNECTED_FROM_TALK,
              data
            );
          }
        });

        this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
          message: "AMA started",
          type: "info",
        });
        res(true);
      });
    });
  }

  public async joinRoom(id: string, userId: string) {
    return new Promise((res, rej) => {
      this.socket.emit(
        "join-room",
        { broadcastId: id, device: "" },
        async (data: any) => {
          if (!data) {
            rej();

            return;
          }

          this.userId = userId;
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
            (data: any[]) => {
              data.forEach((producer) => {
                this.newProducerJoined(producer, "audio").then();
              });
            }
          );

          this.socket.on("toggle-talk-permission", async (data: any[]) => {
            if (data && this.hasTalkRequest) {
              this.hasTalkRequest = false;
              await this.createProducerTransport();
              await this.connectSendTransport();
              this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
                message: "Owner opened your talk",
                type: "info",
              });
            } else {
              this.closeProducer();
              this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
                message: "Owner muted you",
                type: "info",
              });
            }
          });

          this.socket.on("new-producer-joined", async (data: any) => {
            await this.newProducerJoined(data.user_id, data.kind);
          });

          this.socket.on("consumer-closed", async (data: any) => {
            if (areStringsEquals(this.userId, data.user_id)) {
              this.closeProducer();
            } else {
              this.closeConsumer(data.user_id);
            }
          });

          this.socket.on("broadcast-finished", async () => {
            this.close();
            this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
              message: "AMA has been finished",
              type: "info",
            });
          });

          this.socket.on("user-kicked", async () => {
            this.close();
            this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
              message: "Owner has kicked you",
              type: "info",
            });
          });

          this.socket.on("user-disconnected", async (data: any) => {
            if (areStringsEquals(this.userId, data.id)) {
              this.close();
              this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
                message: "AMA has been finished",
                type: "info",
              });
            } else {
              this.closeConsumer(data.id);
            }
          });

          this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
            message: "Successfully joined!",
            type: "info",
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
  public async toggleMemberTalkPermission(userId: string) {
    if (this.isOwner) {
      this.socket.emit("media", {
        broadcastId: this.broadcastId,
        msg: { event: "toggleMemberTalkPermission", data: { user_id: userId } },
      });
    } else throw new Error("forbidden");
  }

  //only owner
  public async toggleMessagePermission(userId: string) {
    if (this.isOwner) {
      this.socket.emit("toggle-messaging-permission", {
        broadcastId: this.broadcastId,
        userId,
      });
    } else throw new Error("forbidden");
  }

  //only owner
  public kickUser(userId: string) {
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
  public leave() {
    this.socket.emit("leave-room", {
      broadcastId: this.broadcastId,
    });
  }

  public requestToTalk(request: boolean) {
    this.hasTalkRequest = request;
    this.socket.emit("request-to-talk", { request });
    this.emitterService.emit(EventNameEnum.ON_SHOW_TOAST, {
      message: "Talk request has been sent to owner",
      type: "info",
    });
  }

  private async newProducerJoined(producerId: string, kind: string) {
    try {
      const { rtpCapabilities } = this.device;
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
              console.log("remote producer closed.");
              this.consumersAudioStream.delete(producerId);
              this.consumersAudio.delete(producerId);
            });

            this.consumersAudio.set(producerId, consumer);
            const stream = new MediaStream();
            stream.addTrack(consumer.track);
            this.consumersAudioStream.set(producerId, stream);
            this.emitterService.emit(EventNameEnum.ON_UPDATE_CONSUMER);
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
                  console.log("connectWebRtcTransport");
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
                      console.log("on produce");
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
                    console.log("transport connecting");
                    this.sendStreamLoader = "connecting";
                    break;
                  case "connected":
                    console.log("transport connected");
                    this.sendStreamLoader = "connected";
                    break;
                  case "failed":
                    console.log("transport failed");
                    this.sendStreamLoader = "failed";
                    this.producerTransport?.close();
                    await this.leave();
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
                    console.log("consumer connecting");
                    this.receiveStreamLoader = "connecting";
                    break;
                  case "connected":
                    console.log("consumer connected");
                    this.receiveStreamLoader = "connected";
                    break;
                  case "failed":
                    console.log("consumer failed");
                    this.receiveStreamLoader = "failed";
                    this.consumerTransport.close();
                    await this.leave();
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
  }

  private async connectSendTransport(): Promise<void> {
    try {
      if (this.device.canProduce("audio")) {
        if (!this.hasGetUserMedia()) {
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
          if (this.producerTransport && !this.producerTransport.closed) {
            this.audioProducer = await this.producerTransport.produce({
              track: localAudio,
            });
            this.localAudio = new MediaStream([localAudio]);
            this.audioProducer.on("trackended", () => {
              console.log("track ended");
              this.sendStreamLoader = "trackEnded";
              // close audio track
            });

            this.audioProducer.on("transportclose", () => {
              console.log("producer closed");
              this.sendStreamLoader = "producerClosed";
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
  }

  private closeConsumer(producerId: string) {
    const audioConsumer = this.consumersAudio.get(producerId);

    if (audioConsumer) {
      audioConsumer.close();
      this.consumersAudio.delete(producerId);
      this.consumersAudioStream.delete(producerId);
    }

    this.emitterService.emit(EventNameEnum.ON_UPDATE_CONSUMER);
  }

  private closeProducer() {
    if (this.audioProducer) {
      this.audioProducer.close();
      this.producerTransport?.close();
      this.audioProducer = null;
      this.producerTransport = null;
    }
  }

  private close() {
    this.closeProducer();
    this.consumersAudio.forEach((e) => {
      e.close();
    });

    this.consumersAudio.clear();
    this.consumersAudioStream.clear();
    this.socket.close();
    this.socket.disconnect();
    this.emitterService.emit(EventNameEnum.ON_FINISH_BROADCAST);
  }

  private hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}
