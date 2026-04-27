import type { TApiUser } from "../utils/board-data-helpers";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5222";

export async function fetchUsers(): Promise<TApiUser[]> {
  const response = await fetch(`${API_BASE_URL}/users`);

  if (!response.ok) {
    throw new Error("Unable to load users from backend.");
  }

  return (await response.json()) as TApiUser[];
}
