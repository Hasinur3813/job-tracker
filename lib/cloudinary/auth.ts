export async function getAuthenticatedUid(
  request: Request,
): Promise<string | null> {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) return null;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    console.error("Firebase web API key is not configured for token verification.");
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: match[1] }),
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      users?: Array<{ localId?: string }>;
    };
    return payload.users?.[0]?.localId ?? null;
  } catch (error) {
    console.error("Firebase ID token verification failed:", error);
    return null;
  }
}
