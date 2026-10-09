import type { NextApiRequest, NextApiResponse } from "next";
import { createHonoApp } from "@/server/hono/app";

export const config = {
  api: {
    bodyParser: false,
  },
};

const app = createHonoApp();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const protoHeader = req.headers["x-forwarded-proto"];
  const proto =
    (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader) || "http";
  const origin = `${proto}://${req.headers.host}`;
  const url = new URL(req.url || "/api", origin);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    } else {
      headers.set(key, value);
    }
  }

  let body: BodyInit | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    body = Buffer.concat(chunks);
  }

  const request = new Request(url, {
    method: req.method,
    headers,
    body,
  });

  const response = await app.fetch(request);
  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  const buf = Buffer.from(await response.arrayBuffer());
  res.send(buf);
};

export default handler;
