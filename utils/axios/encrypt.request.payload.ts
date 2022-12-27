import { publicEncrypt } from "public-encrypt";

import publicKey from "./public.key.json";

export const encryptReqPayload = (payload: object | undefined | null) => {
  if (payload == null) return payload;

  const buffer = Buffer.from(JSON.stringify(payload));
  const encrypted = publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};
