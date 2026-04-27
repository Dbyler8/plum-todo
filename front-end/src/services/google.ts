const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5222";

const GOOGLE_AUTH_VERIFY_URL = `${API_BASE_URL}/auth/google`;

export type TGoogleAuthVerificationResponse = {
  email?: string;
  [key: string]: unknown;
};

export async function verifyGoogleAuthCode(code: string): Promise<TGoogleAuthVerificationResponse> {
  const response = await fetch(GOOGLE_AUTH_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const payload = (await response.json().catch(() => null)) as TGoogleAuthVerificationResponse | null;

  if (!response.ok) {
    throw new Error("Google auth verification request failed.");
  }

  return payload ?? {};
}