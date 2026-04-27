import type { TApiTask, TApiUser, TTaskStatus } from "../utils/board-data-helpers";
import { fetchUsers } from "./users";
import { log } from "../utils/logger";
import type { TPriority } from "../utils/board-helpers";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5222";

type TCreateTaskPayload = {
  userId: number;
  title: string;
  description?: string;
  status: TTaskStatus;
  dueDate?: string;
  priority: TPriority;
  tag?: string;
};

export async function fetchTasks(): Promise<TApiTask[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Unable to load tasks from backend.");
  }

  return (await response.json()) as TApiTask[];
}

export async function fetchBoardData(): Promise<{ tasks: TApiTask[]; users: TApiUser[] }> {
  const [tasks, users] = await Promise.all([fetchTasks(), fetchUsers()]);
  return { tasks, users };
}

export async function updateTaskStatus(taskId: number, status: TTaskStatus): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task status: ${response.statusText}`);
  }

  log({ event: 'TASK_STATUS_CHANGED', taskId, status });
}

export async function createTask(payload: TCreateTaskPayload): Promise<TApiTask> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  return (await response.json()) as TApiTask;
}
