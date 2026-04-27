import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert, UserRound } from "lucide-react";
import type { TApiTask, TApiUser } from "../utils/board-data-helpers";
import { createComment, fetchCommentsByTaskId, type TApiComment } from "../services/comments";
import SectionHeader from "../components/SectionHeader";
import "./TaskModalShared.css";
import "./TaskDetailsModal.css";

type TTaskDetailsModalProps = {
  task: TApiTask;
  users: TApiUser[];
  currentUserEmail: string | null;
  onClose: () => void;
};

const COMMENT_AUTHOR_NAME = "Donovan Byler";
const COMMENT_AUTHOR_EMAIL = "donovanbyler@gmail.com";

const STATUS_CLASS: Record<TApiTask["status"], string> = {
  "To Do": "task-modal__status--to-do",
  "In Progress": "task-modal__status--in-progress",
  "Blocked": "task-modal__status--blocked",
  "Done": "task-modal__status--done",
};

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }
  return date.toLocaleString();
}

function toStatusTagColor(status: TApiTask["status"]): number {
  if (status === "To Do") return 1;
  if (status === "In Progress") return 6;
  if (status === "Blocked") return 3;
  return 10;
}

function toAvatarColor(task: TApiTask): number {
  if (typeof task.tagColor === "number") {
    return Math.min(10, Math.max(1, Math.floor(task.tagColor)));
  }
  return toStatusTagColor(task.status);
}

export default function TaskDetailsModal({
  task,
  users,
  onClose,
}: TTaskDetailsModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [comments, setComments] = useState<TApiComment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user.name])), [users]);
  const commentAuthor = useMemo(() => {
    const byEmail = users.find((user) => user.email.toLowerCase() === COMMENT_AUTHOR_EMAIL);
    if (byEmail) {
      return byEmail;
    }
    return users.find((user) => user.name.trim().toLowerCase() === COMMENT_AUTHOR_NAME.toLowerCase()) ?? null;
  }, [users]);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      setIsLoading(true);
      setError(null);

      try {
        const loaded = await fetchCommentsByTaskId(task.id);
        if (isMounted) {
          setComments(loaded);
        }
      } catch {
        if (isMounted) {
          setError("Could not load comments.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [task.id]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      onClose();
    }
  }

  async function handleCreateComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = commentInput.trim();
    if (!content) {
      return;
    }

    if (!commentAuthor) {
      setError(`Could not find comment author ${COMMENT_AUTHOR_NAME} (${COMMENT_AUTHOR_EMAIL}).`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await createComment({
        taskId: task.id,
        userId: commentAuthor.id,
        content,
      });
      setComments((current) => [...current, created]);
      setCommentInput("");
    } catch {
      setError("Could not create comment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog ref={dialogRef} className="task-modal task-details" onCancel={onClose} onClick={handleBackdropClick}>
      <div className="task-modal__panel panel-surface task-details__panel">
        <div className="task-modal__header">
          <SectionHeader
            variant="modal"
            kicker="Task Details"
            title={task.title}
          />
          <button type="button" className="task-modal__close accent-control" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="task-modal__form" onSubmit={handleCreateComment}>
          <div className="task-modal__row">
            <label className="task-modal__label" htmlFor="td-status">Status</label>
            <div id="td-status" className={`task-modal__status ${STATUS_CLASS[task.status]}`}>
              {task.status}
            </div>
          </div>

          <div className="task-modal__row">
            <label className="task-modal__label" htmlFor="td-priority">Priority</label>
            <div id="td-priority" className={`task-details__chip task-details__chip--priority-${task.priority.toLowerCase()}`}>
              <CircleAlert size={12} />
              {task.priority}
            </div>
          </div>

          <div className="task-modal__row">
            <label className="task-modal__label" htmlFor="td-assignee">Assignee</label>
            <div id="td-assignee" className="task-details__chip task-details__chip--assignee">
              <span className={`task-details__avatar card-item__avatar card-item__avatar--color-${toAvatarColor(task)}`}>
                <UserRound size={12} />
              </span>
              <span>{usersById.get(task.userId) ?? "Unknown"}</span>
            </div>
          </div>

          <div className="task-modal__row task-modal__row--top">
            <label className="task-modal__label" htmlFor="td-description">Description</label>
            <div id="td-description" className="task-details__content task-details__content--body">
              {task.description?.trim() ? task.description : "No description"}
            </div>
          </div>

          <div className="task-modal__row task-modal__row--top">
            <label className="task-modal__label" htmlFor="td-comments">Comments</label>
            <div id="td-comments" className="task-details__content task-details__content--comments">
              {isLoading ? <p className="task-details__empty-state">Loading comments...</p> : null}
              {!isLoading && comments.length === 0 ? (
                <p className="task-details__empty-state">No comments yet.</p>
              ) : null}
              {!isLoading && comments.length > 0 ? (
                <div className="task-details__comments-list">
                  {comments.map((comment) => (
                    <article key={comment.id} className="task-details__comment">
                      <div className="task-details__comment-head">
                        <strong>{usersById.get(comment.userId) ?? `User ${comment.userId}`}</strong>
                        <span>{formatTimestamp(comment.createdAt)}</span>
                      </div>
                      <p className="task-details__comment-body">{comment.content}</p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="task-modal__row task-modal__row--top">
            <label className="task-modal__label" htmlFor="task-comment">Add Comment</label>
            <textarea
              id="task-comment"
              className="task-modal__control task-modal__textarea task-details__composer-input"
              rows={3}
              value={commentInput}
              onChange={(event) => setCommentInput(event.target.value)}
              placeholder="Write a comment..."
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
              Close
            </button>
            <button
              type="submit"
              className="task-modal__button btn btn--primary"
              disabled={isSubmitting || !commentInput.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
