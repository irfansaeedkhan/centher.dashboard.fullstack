import crypto from "crypto-browserify";

import publicKey from "./public.key.json";

export const encryptReqPayload = (payload: object | undefined | null) => {
  if (payload == null) return payload;

  const buffer = Buffer.from(JSON.stringify(payload));
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};
