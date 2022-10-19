import { NODE_API_URL } from "@/constants/common";

// Get logged in user from Node JS API using session id
export async function getSessionUser(sessionId: string | undefined) {
  if (!sessionId) return null;

  try {
    const res = await fetch(`${NODE_API_URL}/api/auth/session`, {
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
