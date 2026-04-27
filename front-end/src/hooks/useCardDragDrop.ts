import { useEffect } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import {
  type Edge,
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import invariant from 'tiny-invariant';
import {
  getCardData,
  getCardDropTargetData,
  isCardData,
  isDraggingACard,
  type TCard,
} from '../utils/board-helpers';

export type TCardState =
  | {
      type: 'idle';
    }
  | {
      type: 'is-dragging';
    }
  | {
      type: 'is-dragging-and-left-self';
    }
  | {
      type: 'is-over';
      dragging: DOMRect;
      closestEdge: Edge;
    }
  | {
      type: 'preview';
      container: HTMLElement;
      dragging: DOMRect;
    };

export const idleCardState = { type: 'idle' } satisfies TCardState;

type UseCardDragDropArgs = {
  card: TCard;
  columnId: string;
  outerRef: RefObject<HTMLDivElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
  setState: Dispatch<SetStateAction<TCardState>>;
};

export function useCardDragDrop({
  card,
  columnId,
  outerRef,
  innerRef,
  setState,
}: UseCardDragDropArgs) {
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    invariant(outer && inner);

    return combine(
      draggable({
        element: inner,
        getInitialData: ({ element }) =>
          getCardData({ card, columnId, rect: element.getBoundingClientRect() }),
        onGenerateDragPreview({ nativeSetDragImage, location, source }) {
          const data = source.data;
          invariant(isCardData(data));
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({ element: inner, input: location.current.input }),
            render({ container }) {
              setState({
                type: 'preview',
                container,
                dragging: inner.getBoundingClientRect(),
              });
            },
          });
        },
        onDragStart() {
          setState({ type: 'is-dragging' });
        },
        onDrop() {
          setState(idleCardState);
        },
      }),
      dropTargetForElements({
        element: outer,
        getIsSticky: () => true,
        canDrop: isDraggingACard,
        getData: ({ element, input }) => {
          const data = getCardDropTargetData({ card, columnId });
          return attachClosestEdge(data, { element, input, allowedEdges: ['top', 'bottom'] });
        },
        onDragEnter({ source, self }) {
          if (!isCardData(source.data) || source.data.card.id === card.id) {
            return;
          }

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }

          setState({ type: 'is-over', dragging: source.data.rect, closestEdge });
        },
        onDrag({ source, self }) {
          if (!isCardData(source.data) || source.data.card.id === card.id) {
            return;
          }

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }

          const proposed: TCardState = {
            type: 'is-over',
            dragging: source.data.rect,
            closestEdge,
          };

          setState((current) => {
            if (
              current.type === 'is-over' &&
              current.dragging === proposed.dragging &&
              current.closestEdge === proposed.closestEdge
            ) {
              return current;
            }

            return proposed;
          });
        },
        onDragLeave({ source }) {
          if (!isCardData(source.data)) {
            return;
          }

          if (source.data.card.id === card.id) {
            setState({ type: 'is-dragging-and-left-self' });
            return;
          }

          setState(idleCardState);
        },
        onDrop() {
          setState(idleCardState);
        },
      }),
    );
  }, [card, columnId, innerRef, outerRef, setState]);
}