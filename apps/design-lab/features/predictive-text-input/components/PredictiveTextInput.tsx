import { cn } from '@repo/ui/utils';
import mergeRefs from 'merge-refs';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEventHandler
} from 'react';

function clearPredictions(el: HTMLDivElement) {
  const predictionSpans = el.querySelectorAll('[data-id="prediction-text"]');
  predictionSpans.forEach((span) => span.remove());
}

const GHOST_TEXT_CLASSES =
  'pointer-events-none select-none text-gray-400/55 dark:text-gray-400/45';

interface PredictiveTextInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'contentEditable' | 'onChange' | 'suppressContentEditableWarning'
> {
  keywords: string[];
  onChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
}

export const PredictiveTextInput = forwardRef<
  HTMLDivElement,
  PredictiveTextInputProps
>(
  (
    { keywords, onChange, placeholder, value = '', className, ...props },
    ref
  ) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const isUpdatingRef = useRef(false);

    const getCleanText = useCallback(() => {
      if (!contentRef.current) {
        return '';
      }

      const clone = contentRef.current.cloneNode(true) as HTMLDivElement;
      clearPredictions(clone);

      return clone.textContent ?? '';
    }, []);

    const getCursorPosition = useCallback(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !contentRef.current) {
        return 0;
      }

      const range = selection.getRangeAt(0);
      if (!contentRef.current.contains(range.startContainer)) {
        return 0;
      }

      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(contentRef.current);
      preCaretRange.setEnd(range.startContainer, range.startOffset);

      const tempDiv = document.createElement('div');
      tempDiv.appendChild(preCaretRange.cloneContents());
      clearPredictions(tempDiv);

      return tempDiv.textContent?.length || 0;
    }, []);

    const setCursorPosition = useCallback((position: number) => {
      if (!contentRef.current) return;

      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      const textNode = contentRef.current.firstChild;

      if (textNode) {
        const clampedPos = Math.min(
          position,
          textNode.textContent?.length || 0
        );
        range.setStart(textNode, clampedPos);
        range.setEnd(textNode, clampedPos);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, []);

    const setCursorAfterNode = useCallback((node: Node) => {
      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      range.setStartAfter(node);
      range.setEndAfter(node);
      selection.removeAllRanges();
      selection.addRange(range);
    }, []);

    const removePredictionSpan = useCallback(() => {
      const existingSpan = contentRef.current?.querySelector(
        '[data-id="prediction-text"]'
      );
      existingSpan?.remove();
    }, []);

    const findPrediction = useCallback(
      (partialWord: string) => {
        if (partialWord.length === 0) return '';

        const match = keywords.find(
          (keyword) =>
            keyword.toLowerCase().startsWith(partialWord.toLowerCase()) &&
            keyword.toLowerCase() !== partialWord.toLowerCase()
        );

        return match ? match.substring(partialWord.length) : '';
      },
      [keywords]
    );

    const insertPredictionSpan = useCallback(
      (predictionText: string) => {
        if (!contentRef.current || isUpdatingRef.current) {
          return;
        }

        removePredictionSpan();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          return;
        }

        const range = selection.getRangeAt(0);
        if (!contentRef.current.contains(range.startContainer)) {
          return;
        }

        const span = document.createElement('span');
        span.dataset.id = 'prediction-text';
        span.className = GHOST_TEXT_CLASSES;
        span.textContent = predictionText;

        try {
          isUpdatingRef.current = true;
          range.insertNode(span);

          const newRange = document.createRange();
          newRange.setStartBefore(span);
          newRange.setEndBefore(span);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } finally {
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 0);
        }
      },
      [removePredictionSpan]
    );

    const getCurrentWord = useCallback(() => {
      const cursorPos = getCursorPosition();
      const text = getCleanText();
      const beforeCursor = text.substring(0, cursorPos);

      const wordStart = Math.max(
        0,
        beforeCursor.search(/\W(?:\w(?!\W))+$/) + 1
      );

      const afterCursor = text.substring(cursorPos);
      const nextSpaceIndex = afterCursor.search(/[\s\n]/);
      const isAtWordEnd =
        nextSpaceIndex === -1
          ? cursorPos === text.length
          : afterCursor.substring(0, nextSpaceIndex).trim() === '';

      const wordAtCursor = beforeCursor.substring(wordStart);

      return {
        wordAtCursor,
        wordStart,
        cursorPos,
        isAtWordEnd: isAtWordEnd && wordAtCursor.length > 0,
        cleanText: text
      };
    }, [getCursorPosition, getCleanText]);

    const updatePrediction = useCallback(() => {
      if (isUpdatingRef.current) {
        return;
      }

      const { wordAtCursor, isAtWordEnd } = getCurrentWord();

      if (!isAtWordEnd) {
        removePredictionSpan();
        return;
      }

      const prediction = findPrediction(wordAtCursor);

      if (prediction) {
        insertPredictionSpan(prediction);
      } else {
        removePredictionSpan();
      }
    }, [
      getCurrentWord,
      findPrediction,
      insertPredictionSpan,
      removePredictionSpan
    ]);

    const handleInput = useCallback(() => {
      if (isUpdatingRef.current) {
        return;
      }

      onChange?.(getCleanText());
      updatePrediction();
    }, [onChange, getCleanText, updatePrediction]);

    const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
      (event) => {
        const predictionSpan = contentRef.current?.querySelector(
          '[data-id="prediction-text"]'
        ) as HTMLElement | null;

        if (event.key === 'Enter') {
          event.preventDefault();
        } else if (
          (event.key === 'Tab' || event.key === 'ArrowRight') &&
          predictionSpan
        ) {
          event.preventDefault();

          isUpdatingRef.current = true;

          const predictionText = predictionSpan.textContent || '';
          const textNode = document.createTextNode(predictionText);
          predictionSpan.parentNode?.replaceChild(textNode, predictionSpan);

          setCursorAfterNode(textNode);
          onChange?.(getCleanText());
          isUpdatingRef.current = false;
        } else if (
          event.key === 'Backspace' ||
          event.key === 'Delete' ||
          (event.key.length === 1 && !event.ctrlKey && !event.metaKey)
        ) {
          removePredictionSpan();
        }
      },
      [removePredictionSpan, setCursorAfterNode, onChange, getCleanText]
    );

    useEffect(() => {
      let timeoutId: ReturnType<typeof setTimeout>;

      const handleSelectionChange = () => {
        if (isUpdatingRef.current) {
          return;
        }

        const selection = window.getSelection();
        if (
          selection &&
          contentRef.current &&
          contentRef.current.contains(selection.focusNode)
        ) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(updatePrediction, 50);
        }
      };

      document.addEventListener('selectionchange', handleSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
        clearTimeout(timeoutId);
      };
    }, [updatePrediction]);

    useEffect(() => {
      if (!isUpdatingRef.current && contentRef.current) {
        const currentText = getCleanText();
        if (currentText !== value) {
          const cursorPos = getCursorPosition();

          isUpdatingRef.current = true;
          contentRef.current.textContent = value;

          setTimeout(() => {
            setCursorPosition(Math.min(cursorPos, value.length));
            isUpdatingRef.current = false;
          }, 0);
        }
      }
    }, [value, getCleanText, getCursorPosition, setCursorPosition]);

    return (
      <div
        ref={mergeRefs(ref, contentRef)}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          'min-h-13 w-full overflow-x-auto rounded-lg border-2 border-gray-300 bg-transparent p-4 text-base whitespace-nowrap text-gray-900 caret-blue-500 transition-all duration-300 outline-none selection:bg-blue-500/25 empty:before:pointer-events-none empty:before:text-gray-500 empty:before:content-[attr(data-placeholder)] focus:border-blue-500 dark:border-gray-700 dark:text-gray-100 dark:empty:before:text-gray-400 dark:focus:border-blue-400',
          className
        )}
        data-placeholder={value ? undefined : placeholder}
        {...props}
      />
    );
  }
);

PredictiveTextInput.displayName = 'PredictiveTextInput';
