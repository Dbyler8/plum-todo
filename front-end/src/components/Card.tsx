'use client';

import { CalendarDays, CircleAlert, UserRound } from 'lucide-react';
import { MutableRefObject, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  TCard,
} from '../utils/board-helpers';
import { idleCardState, TCardState, useCardDragDrop } from '../hooks/useCardDragDrop';

const innerStyles: { [Key in TCardState['type']]?: string } = {
  idle: 'card-item--idle',
  'is-dragging': 'card-item--is-dragging',
};

const outerStyles: { [Key in TCardState['type']]?: string } = {
  'is-dragging-and-left-self': 'card-row--is-dragging-and-left-self',
};

function getPriorityClassName(priority: TCard['priority']): string {
  return `card-item__priority--${priority.toLowerCase()}`;
}

const TAG_COLOR_COUNT = 10;

function getTagClassName(color: number): string {
  const boundedColor = Math.min(TAG_COLOR_COUNT, Math.max(1, Math.floor(color)));
  const colorIndex = boundedColor as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  return `card-item__tag--color-${colorIndex}`;
}

function getAvatarClassName(color: number): string {
  const boundedColor = Math.min(TAG_COLOR_COUNT, Math.max(1, Math.floor(color)));
  const colorIndex = boundedColor as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  return `card-item__avatar--color-${colorIndex}`;
}

export function CardShadow({ dragging }: { dragging: DOMRect }) {
  return <div className="card-shadow" style={{ height: dragging.height }} />;
}

export function CardDisplay({
  card,
  state,
  onOpen,
  outerRef,
  innerRef,
}: {
  card: TCard;
  state: TCardState;
  onOpen?: () => void;
  outerRef?: React.MutableRefObject<HTMLDivElement | null>;
  innerRef?: MutableRefObject<HTMLDivElement | null>;
}) {
  const canOpen = state.type === 'idle';

  return (
    <div ref={outerRef} className={`card-row ${outerStyles[state.type] ?? ''}`}>
      {state.type === 'is-over' && state.closestEdge === 'top' ? (
        <CardShadow dragging={state.dragging} />
      ) : null}
      <div
        className={`card-item accent-surface ${innerStyles[state.type] ?? ''}`}
        ref={innerRef}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (canOpen) {
            onOpen?.();
          }
        }}
        onKeyDown={(event) => {
          if (!canOpen) {
            return;
          }
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen?.();
          }
        }}
        style={
          state.type === 'preview'
            ? {
                width: state.dragging.width,
                height: state.dragging.height,
                transform: 'rotate(4deg)',
              }
            : undefined
        }
      >
        <div className="card-item__body">
          <div className="card-item__title">{card.title}</div>
          <div className="card-item__description">{card.description}</div>
        </div>

        <div className="card-item__meta">
          <span className="card-item__due-date">
            <CalendarDays size={12} />
            {card.dueDate}
          </span>
          <div className="card-item__tags">
            {card.tags.map((tag) => (
              <span
                key={`${tag.label}-${tag.color}`}
                className={`card-item__tag ${getTagClassName(tag.color)}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="card-item__footer">
          <div className="card-item__assignee">
            <span
              className={`card-item__avatar ${getAvatarClassName(card.assignee.avatarColor)}`}
              aria-hidden="true"
            >
              <UserRound size={12} />
            </span>
            <span className="card-item__assignee-name">{card.assignee.name}</span>
          </div>
          <span className={`card-item__priority ${getPriorityClassName(card.priority)}`}>
            <CircleAlert size={12} />
            {card.priority}
          </span>
        </div>
      </div>
      {state.type === 'is-over' && state.closestEdge === 'bottom' ? (
        <CardShadow dragging={state.dragging} />
      ) : null}
    </div>
  );
}

export default function Card({ card, columnId, onOpen }: { card: TCard; columnId: string; onOpen?: () => void }) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TCardState>(idleCardState);

  useCardDragDrop({ card, columnId, outerRef, innerRef, setState });

  return (
    <>
      <CardDisplay outerRef={outerRef} innerRef={innerRef} state={state} card={card} onOpen={onOpen} />
      {state.type === 'preview'
        ? createPortal(<CardDisplay state={state} card={card} />, state.container)
        : null}
    </>
  );
}
