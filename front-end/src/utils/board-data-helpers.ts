import { createTag, type TBoard, type TCard, type TPriority, type TTagColor } from './board-helpers';

export type TTaskStatus = 'To Do' | 'In Progress' | 'Blocked' | 'Done';

export const columnIdToStatus: Record<string, TTaskStatus> = {
  'column:a': 'To Do',
  'column:b': 'In Progress',
  'column:c': 'Blocked',
  'column:d': 'Done',
};

export type TApiTask = {
  id: number;
  userId: number;
  tag: string | null;
  tagColor: number | null;
  title: string;
  description: string | null;
  status: TTaskStatus;
  dueDate: string | null;
  priority: TPriority;
};

export type TApiUser = {
  id: number;
  email: string;
  name: string;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function toTagColor(value: number | null): TTagColor {
  if (typeof value !== 'number') {
    return 1;
  }
  const bounded = Math.min(10, Math.max(1, Math.floor(value)));
  return bounded as TTagColor;
}

function formatDueDate(value: string | null): string {
  if (!value) {
    return 'No due date';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'No due date';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function createEmptyBoard(): TBoard {
  return {
    columns: [
      { id: 'column:a', title: 'Backlog', color: 1, cards: [] },
      { id: 'column:b', title: 'In Progress', color: 6, cards: [] },
      { id: 'column:c', title: 'Blocked', color: 3, cards: [] },
      { id: 'column:d', title: 'Completed', color: 10, cards: [] },
    ],
  };
}

export function buildBoardFromApi(tasks: TApiTask[], users: TApiUser[]): TBoard {
  const usersById = new Map(users.map((user) => [user.id, user]));

  const toCard = (task: TApiTask): TCard => {
    const user = usersById.get(task.userId);
    const assigneeName = user?.name ?? 'Unassigned';
    const tagColor = toTagColor(task.tagColor);

    return {
      id: `task:${task.id}`,
      title: task.title,
      description: task.description ?? 'No description provided.',
      assignee: {
        name: assigneeName,
        initials: getInitials(assigneeName) || 'NA',
        avatarColor: tagColor,
      },
      priority: task.priority,
      tags: task.tag ? [createTag(task.tag, tagColor)] : [],
      dueDate: formatDueDate(task.dueDate),
    };
  };

  return {
    columns: [
      {
        id: 'column:a',
        title: 'Backlog',
        color: 1,
        cards: tasks.filter((task) => task.status === 'To Do').map(toCard),
      },
      {
        id: 'column:b',
        title: 'In Progress',
        color: 6,
        cards: tasks.filter((task) => task.status === 'In Progress').map(toCard),
      },
      {
        id: 'column:c',
        title: 'Blocked',
        color: 3,
        cards: tasks.filter((task) => task.status === 'Blocked').map(toCard),
      },
      {
        id: 'column:d',
        title: 'Completed',
        color: 10,
        cards: tasks.filter((task) => task.status === 'Done').map(toCard),
      },
    ],
  };
}
