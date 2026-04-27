type TLogEvent =
  | { event: "APP_STARTED" }
  | { event: "BACKEND_CONNECTED"; taskCount: number; userCount: number }
  | { event: "USER_SIGNED_IN" }
  | { event: "TASK_STATUS_CHANGED"; taskId: number; status: string };

export function log(entry: TLogEvent): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${entry.event}`, entry);
}
