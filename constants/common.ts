type CommunicationProtocol = "http" | "ws";
type CommunicationChannel = "backend-to-backend" | "frontend-to-backend";

export const getBackendUrl = (
  protocol: CommunicationProtocol,
  communicationChannel: CommunicationChannel
) => {
  if (communicationChannel === "backend-to-backend" && protocol === "http") {
    if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
      return `http://${process.env.NEXT_PUBLIC_NODE_API_HOST_CONTAINER}`;
    } else {
      return `https://${process.env.NEXT_PUBLIC_NODE_API_HOST}`;
    }
  } else if (
    communicationChannel === "backend-to-backend" &&
    protocol === "ws"
  ) {
    if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
      return `ws://${process.env.NEXT_PUBLIC_NODE_API_HOST_CONTAINER}`;
    } else {
      return `wss://${process.env.NEXT_PUBLIC_NODE_API_HOST}`;
    }
  } else if (
    communicationChannel === "frontend-to-backend" &&
    protocol === "ws"
  ) {
    if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
      return `ws://${process.env.NEXT_PUBLIC_NODE_API_HOST}`;
    } else {
      return `wss://${process.env.NEXT_PUBLIC_NODE_API_HOST}`;
    }
  }

  if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
    return `http://${process.env.NEXT_PUBLIC_NODE_API_HOST}`;
  } else {
    return `https://${process.env.NEXT_PUBLIC_NODE_API_HOST}`;
  }
};
