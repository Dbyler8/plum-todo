'use client';

import {
  memo,
  useRef,
  useState,
} from 'react';
import { Copy, Ellipsis, Plus } from 'lucide-react';
import Card, { CardShadow } from './Card';
import {
  TColumn,
} from '../utils/board-helpers';
import {
  idleColumnState,
  TColumnState,
  useColumnDragDrop,
} from '../hooks/useColumnDragDrop';

const blockBoardPanningAttr = 'data-block-board-panning' as const;

const stateStyles: { [Key in TColumnState['type']]: string } = {
  idle: 'column--idle',
  'is-card-over': 'column--is-card-over',
  'is-dragging': 'column--is-dragging',
  'is-column-over': 'column--is-column-over',
};

const COLUMN_COLOR_COUNT = 10;

function getColumnColorClassName(color: number): string {
  const boundedColor = Math.min(COLUMN_COLOR_COUNT, Math.max(1, Math.floor(color)));
  const colorIndex = boundedColor as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  return `column__header--color-${colorIndex}`;
}

/**
 * A memoized component for rendering out the card.
 *
 * Created so that state changes to the column don't require all cards to be rendered
 */
const CardList = memo(function CardList({
  column,
  onCardClick,
}: {
  column: TColumn;
  onCardClick?: (cardId: string) => void;
}) {
  return column.cards.map((card) => (
    <Card
      key={card.id}
      card={card}
      columnId={column.id}
      onOpen={onCardClick ? () => onCardClick(card.id) : undefined}
    />
  ));
});

export default function Column({
  column,
  onAddCard,
  onCardClick,
}: {
  column: TColumn;
  onAddCard?: () => void;
  onCardClick?: (cardId: string) => void;
}) {
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const outerFullHeightRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TColumnState>(idleColumnState);

  useColumnDragDrop({
    column,
    outerRef: outerFullHeightRef,
    scrollableRef,
    headerRef,
    innerRef,
    setState,
  });

  return (
    <div className="column" ref={outerFullHeightRef}>
      <div
        className={`column__inner ${stateStyles[state.type]}`}
        ref={innerRef}
        {...{ [blockBoardPanningAttr]: true }}
      >
        {/* Extra wrapping element to make it easy to toggle visibility of content when a column is dragging over */}
        <div
          className={`column__content ${state.type === 'is-column-over' ? 'column__content--hidden' : ''}`}
        >
          <div className={`column__header ${getColumnColorClassName(column.color)}`} ref={headerRef}>
            <div className="column__title">{column.title}</div>
            <button
              type="button"
              className="column__icon-btn accent-control"
              aria-label="More actions"
            >
              <Ellipsis size={16} />
            </button>
          </div>
          <div className="column__cards" ref={scrollableRef}>
            <CardList column={column} onCardClick={onCardClick} />
            {state.type === 'is-card-over' && !state.isOverChildCard ? (
              <div className="column__shadow-slot">
                <CardShadow dragging={state.dragging} />
              </div>
            ) : null}
          </div>
          <div className="column__footer">
            <button type="button" className="column__add-btn btn btn--primary" onClick={onAddCard}>
              <Plus size={16} />
              <div>Add a card</div>
            </button>
            <button
              type="button"
              className="column__icon-btn accent-control"
              aria-label="Create card from template"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
