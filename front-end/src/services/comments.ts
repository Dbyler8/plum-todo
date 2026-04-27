const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5222";

export type TApiComment = {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type TCreateCommentPayload = {
  taskId: number;
  userId: number;
  content: string;
};

export async function fetchComments(): Promise<TApiComment[]> {
  const response = await fetch(`${API_BASE_URL}/comments`);

  if (!response.ok) {
    throw new Error("Unable to load comments from backend.");
  }

  return (await response.json()) as TApiComment[];
}

export async function fetchCommentsByTaskId(taskId: number): Promise<TApiComment[]> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`);

  if (!response.ok) {
    throw new Error("Unable to load comments for task.");
  }

  return (await response.json()) as TApiComment[];
}

export async function createComment(payload: TCreateCommentPayload): Promise<TApiComment> {
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to create comment.");
  }

  return (await response.json()) as TApiComment;
}
