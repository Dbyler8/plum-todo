import BoardComponent from "../components/Board";
import { useEffect, useMemo, useState } from "react";
import {
  buildBoardFromApi,
  createEmptyBoard,
  columnIdToStatus,
  type TApiTask,
  type TApiUser,
  type TTaskStatus,
} from "../utils/board-data-helpers";
import { fetchBoardData } from "../services/tasks";
import { log } from "../utils/logger";
import NewTaskModal from "./NewTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";

type TModalState = { open: false } | { open: true; initialStatus: TTaskStatus };

export default function Board({ currentUserEmail }: { currentUserEmail: string | null }) {
  const [tasks, setTasks] = useState<TApiTask[]>([]);
  const [users, setUsers] = useState<TApiUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [modalState, setModalState] = useState<TModalState>({ open: false });
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBoardData() {
      setIsLoading(true);
      setError(null);

      try {
        const { tasks: tasksJson, users: usersJson } = await fetchBoardData();

        if (!isMounted) {
          return;
        }

        log({ event: 'BACKEND_CONNECTED', taskCount: tasksJson.length, userCount: usersJson.length });
        setTasks(tasksJson);
        setUsers(usersJson);
      } catch {
        if (isMounted) {
          setError("Could not load tasks. Make sure the backend is running on localhost:5222.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBoardData();

    return () => {
      isMounted = false;
    };
  }, [refreshTick]);

  function handleAddCard(columnId: string) {
    const status = columnIdToStatus[columnId];
    if (status) {
      setModalState({ open: true, initialStatus: status });
    }
  }

  function handleTaskCreated() {
    setModalState({ open: false });
    setRefreshTick((t) => t + 1);
  }

  const boardData = useMemo(() => buildBoardFromApi(tasks, users), [tasks, users]);
  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  if (isLoading) {
    return <p>Loading tasks from backend...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <BoardComponent
        initial={boardData ?? createEmptyBoard()}
        onAddCard={handleAddCard}
        onCardOpen={setSelectedTaskId}
      />
      {modalState.open ? (
        <NewTaskModal
          initialStatus={modalState.initialStatus}
          users={users}
          onClose={() => setModalState({ open: false })}
          onCreated={handleTaskCreated}
        />
      ) : null}
      {selectedTask ? (
        <TaskDetailsModal
          task={selectedTask}
          users={users}
          currentUserEmail={currentUserEmail}
          onClose={() => setSelectedTaskId(null)}
        />
      ) : null}
    </>
  );
}
