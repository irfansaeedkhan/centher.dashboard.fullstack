import { getBackendUrl } from "@/constants/common";

const BACKEND_HTTP_URL = getBackendUrl("http", "backend-to-backend");

// Get logged in user from Node JS API using session id
export async function getSessionUser(sessionId: string | undefined) {
  if (!sessionId) return null;

  try {
    const res = await fetch(`${BACKEND_HTTP_URL}/api/auth/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `sid=${sessionId}`,
      },
    });
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.log(err);
    return null;
  }
}
