import { FormEvent, useEffect, useRef, useState } from "react";
import type { TApiUser, TTaskStatus } from "../utils/board-data-helpers";
import type { TPriority } from "../utils/board-helpers";
import { createTask } from "../services/tasks";
import SectionHeader from "../components/SectionHeader";
import "./TaskModalShared.css";

type TNewTaskModalProps = {
  initialStatus: TTaskStatus;
  users: TApiUser[];
  onClose: () => void;
  onCreated: () => void;
};

const STATUS_LABELS: Record<TTaskStatus, string> = {
  "To Do": "Backlog",
  "In Progress": "In Progress",
  "Blocked": "Blocked",
  "Done": "Completed",
};

const STATUS_CLASS: Record<TTaskStatus, string> = {
  "To Do": "task-modal__status--to-do",
  "In Progress": "task-modal__status--in-progress",
  "Blocked": "task-modal__status--blocked",
  "Done": "task-modal__status--done",
};

export default function NewTaskModal({ initialStatus, users, onClose, onCreated }: TNewTaskModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TPriority>("Medium");
  const [userId, setUserId] = useState<number>(users[0]?.id ?? 0);
  const [dueDate, setDueDate] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      onClose();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (userId === 0) {
      setError("Please select an assignee.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createTask({
        userId,
        title: title.trim(),
        description: description.trim() || undefined,
        status: initialStatus,
        priority,
        dueDate: dueDate || undefined,
        tag: tag.trim() || undefined,
      });

      onCreated();
    } catch {
      setError("Failed to create task. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="task-modal"
      onCancel={onClose}
      onClick={handleBackdropClick}
    >
      <div className="task-modal__panel panel-surface">
        <div className="task-modal__header">
          <SectionHeader
            variant="modal"
            kicker="Task"
            title="New Task"
          />
          <button
            type="button"
            className="task-modal__close accent-control"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form className="task-modal__form" onSubmit={handleSubmit}>
          <div className="task-modal__row">
            <label className="task-modal__label" htmlFor="nt-status">Status</label>
            <div className={`task-modal__status ${STATUS_CLASS[initialStatus]}`}>{STATUS_LABELS[initialStatus]}</div>
          </div>

          <div className="task-modal__row">
            <label className="task-modal__label" htmlFor="nt-title">Title <span aria-hidden="true">*</span></label>
            <input
              id="nt-title"
              className="task-modal__control"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div className="task-modal__row task-modal__row--top">
            <label className="task-modal__label" htmlFor="nt-description">Description</label>
            <textarea
              id="nt-description"
              className="task-modal__control task-modal__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="task-modal__row">
            <label className="task-modal__label" htmlFor="nt-priority">Priority</label>
            <select
              id="nt-priority"
              className="task-modal__control"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TPriority)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="task-modal__row">
            <label className="task-modal__label" htmlFor="nt-assignee">Assignee</label>
            <select
              id="nt-assignee"
              className="task-modal__control"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="task-modal__row">
            <label className="task-modal__label" htmlFor="nt-duedate">Due Date</label>
            <input
              id="nt-duedate"
              className="task-modal__control"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="task-modal__row">
            <label className="task-modal__label" htmlFor="nt-tag">Tag</label>
            <input
              id="nt-tag"
              className="task-modal__control"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Optional tag"
            />
          </div>

          {error ? <p className="task-modal__error">{error}</p> : null}

          <div className="task-modal__actions">
            <button
              type="button"
              className="task-modal__button btn btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="task-modal__button btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
