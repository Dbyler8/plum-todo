'use client';

import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import Column from './Column';
import {
  isCardData,
  isCardDropTargetData,
  isColumnData,
  isDraggingACard,
  isDraggingAColumn,
  TBoard,
  TColumn,
} from '../utils/board-helpers';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { updateTaskStatus } from '../services/tasks';
import { columnIdToStatus } from '../utils/board-data-helpers';
import { useBoardPanning } from '../hooks/useBoardPanning';
import './Board.css';

// Extract task ID from card ID (format: "task:123")
function extractTaskId(cardId: string): number {
  const match = cardId.match(/task:(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export default function Board({
  initial,
  onAddCard,
  onCardOpen,
}: {
  initial: TBoard;
  onAddCard?: (columnId: string) => void;
  onCardOpen?: (taskId: number) => void;
}) {
  const [data, setData] = useState(initial);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const boardScrollSpeed = 'fast' as const;

  useEffect(() => {
    setData(initial);
  }, [initial]);

  useBoardPanning(scrollableRef);

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    type DropArgs = Parameters<NonNullable<Parameters<typeof monitorForElements>[0]['onDrop']>>[0];

    function handleCardDrop({ source, location }: DropArgs) {
      const dragging = source.data;
      if (!isCardData(dragging)) {
        return;
      }

      const innerMost = location.current.dropTargets[0];

      if (!innerMost) {
        return;
      }
      const dropTargetData = innerMost.data;
      const homeColumnIndex = data.columns.findIndex(
        (column) => column.id === dragging.columnId,
      );
      const home: TColumn | undefined = data.columns[homeColumnIndex];

      if (!home) {
        return;
      }
      const cardIndexInHome = home.cards.findIndex((card) => card.id === dragging.card.id);

      // dropping on a card
      if (isCardDropTargetData(dropTargetData)) {
        const destinationColumnIndex = data.columns.findIndex(
          (column) => column.id === dropTargetData.columnId,
        );
        const destination = data.columns[destinationColumnIndex];
        // reordering in home column
        if (home === destination) {
          const cardFinishIndex = home.cards.findIndex(
            (card) => card.id === dropTargetData.card.id,
          );

          // could not find cards needed
          if (cardIndexInHome === -1 || cardFinishIndex === -1) {
            return;
          }

          // no change needed
          if (cardIndexInHome === cardFinishIndex) {
            return;
          }

          const closestEdge = extractClosestEdge(dropTargetData);

          const reordered = reorderWithEdge({
            axis: 'vertical',
            list: home.cards,
            startIndex: cardIndexInHome,
            indexOfTarget: cardFinishIndex,
            closestEdgeOfTarget: closestEdge,
          });

          const updated: TColumn = {
            ...home,
            cards: reordered,
          };
          const columns = Array.from(data.columns);
          columns[homeColumnIndex] = updated;
          setData({ ...data, columns });
          return;
        }

        // moving card from one column to another

        // unable to find destination
        if (!destination) {
          return;
        }

        const indexOfTarget = destination.cards.findIndex(
          (card) => card.id === dropTargetData.card.id,
        );

        const closestEdge = extractClosestEdge(dropTargetData);
        const finalIndex = closestEdge === 'bottom' ? indexOfTarget + 1 : indexOfTarget;

        // remove card from home list
        const homeCards = Array.from(home.cards);
        homeCards.splice(cardIndexInHome, 1);

        // insert into destination list
        const destinationCards = Array.from(destination.cards);
        destinationCards.splice(finalIndex, 0, dragging.card);

        const columns = Array.from(data.columns);
        columns[homeColumnIndex] = {
          ...home,
          cards: homeCards,
        };
        columns[destinationColumnIndex] = {
          ...destination,
          cards: destinationCards,
        };
        setData({ ...data, columns });

        // Update the task status on the backend
        const taskId = extractTaskId(dragging.card.id);
        const newStatus = columnIdToStatus[dropTargetData.columnId];
        if (taskId && newStatus) {
          updateTaskStatus(taskId, newStatus).catch((error) => {
            console.error('Failed to update task status:', error);
          });
        }
        return;
      }

      // dropping onto a column, but not onto a card
      if (isColumnData(dropTargetData)) {
        const destinationColumnIndex = data.columns.findIndex(
          (column) => column.id === dropTargetData.column.id,
        );
        const destination = data.columns[destinationColumnIndex];

        if (!destination) {
          return;
        }

        // dropping on home
        if (home === destination) {
          // move to last position
          const reordered = reorder({
            list: home.cards,
            startIndex: cardIndexInHome,
            finishIndex: home.cards.length - 1,
          });

          const updated: TColumn = {
            ...home,
            cards: reordered,
          };
          const columns = Array.from(data.columns);
          columns[homeColumnIndex] = updated;
          setData({ ...data, columns });
          return;
        }

        // remove card from home list

        const homeCards = Array.from(home.cards);
        homeCards.splice(cardIndexInHome, 1);

        // insert into destination list
        const destinationCards = Array.from(destination.cards);
        destinationCards.splice(destination.cards.length, 0, dragging.card);

        const columns = Array.from(data.columns);
        columns[homeColumnIndex] = {
          ...home,
          cards: homeCards,
        };
        columns[destinationColumnIndex] = {
          ...destination,
          cards: destinationCards,
        };
        setData({ ...data, columns });

        // Update the task status on the backend
        const taskId = extractTaskId(dragging.card.id);
        const newStatus = columnIdToStatus[dropTargetData.column.id];
        if (taskId && newStatus) {
          updateTaskStatus(taskId, newStatus).catch((error) => {
            console.error('Failed to update task status:', error);
          });
        }
        return;
      }
    }

    function handleColumnDrop({ source, location }: DropArgs) {
      const dragging = source.data;
      if (!isColumnData(dragging)) {
        return;
      }

      const innerMost = location.current.dropTargets[0];

      if (!innerMost) {
        return;
      }
      const dropTargetData = innerMost.data;

      if (!isColumnData(dropTargetData)) {
        return;
      }

      const homeIndex = data.columns.findIndex((column) => column.id === dragging.column.id);
      const destinationIndex = data.columns.findIndex(
        (column) => column.id === dropTargetData.column.id,
      );

      if (homeIndex === -1 || destinationIndex === -1) {
        return;
      }

      if (homeIndex === destinationIndex) {
        return;
      }

      const reordered = reorder({
        list: data.columns,
        startIndex: homeIndex,
        finishIndex: destinationIndex,
      });
      setData({ ...data, columns: reordered });
    }

    return combine(
      monitorForElements({ canMonitor: isDraggingACard, onDrop: handleCardDrop }),
      monitorForElements({ canMonitor: isDraggingAColumn, onDrop: handleColumnDrop }),
      autoScrollForElements({
        canScroll({ source }) {
          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getConfiguration: () => ({ maxScrollSpeed: boardScrollSpeed }),
        element,
      }),
      unsafeOverflowAutoScrollForElements({
        element,
        getConfiguration: () => ({ maxScrollSpeed: boardScrollSpeed }),
        canScroll({ source }) {
          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getOverflow() {
          return {
            forLeftEdge: {
              top: 1000,
              left: 1000,
              bottom: 1000,
            },
            forRightEdge: {
              top: 1000,
              right: 1000,
              bottom: 1000,
            },
          };
        },
      }),
    );
  }, [data]);



  return (
    <div className="board">
      <div className="board__scroller" ref={scrollableRef}>
        {data.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onAddCard={onAddCard ? () => onAddCard(column.id) : undefined}
            onCardClick={
              onCardOpen
                ? (cardId) => {
                    const taskId = extractTaskId(cardId);
                    if (taskId) {
                      onCardOpen(taskId);
                    }
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
