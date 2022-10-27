const ApiHost = process.env.NEXT_PUBLIC_NODE_API_HOST;

let NodeApiUrl;
let SocketIoUrl;

if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
  NodeApiUrl = "http://" + ApiHost;
  SocketIoUrl = "ws://" + ApiHost;
} else {
  NodeApiUrl = "https://" + ApiHost;
  SocketIoUrl = "wss://" + ApiHost;
}

export const NODE_API_URL = NodeApiUrl;
export const SOCKET_IO_URL = SocketIoUrl;
