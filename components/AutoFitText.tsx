"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type AutoFitTextProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  maxSize: number;
  minSize?: number;
  lines?: number;
  lineHeight?: number;
  style?: CSSProperties;
};

export function AutoFitText({
  as: Tag = "span",
  children,
  className = "",
  maxSize,
  minSize = 16,
  lines = 1,
  lineHeight = 1,
  style,
}: AutoFitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [fontSize, setFontSize] = useState(maxSize);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const textFits = () => {
      const maxHeightValue = Number.parseFloat(window.getComputedStyle(element).maxHeight);
      const heightIsConstrained = Number.isFinite(maxHeightValue) && element.clientHeight >= maxHeightValue - 1;

      return (
        element.scrollWidth <= element.clientWidth + 1 &&
        (!heightIsConstrained || element.scrollHeight <= element.clientHeight + 1)
      );
    };

    const fit = () => {
      element.style.setProperty("--auto-fit-size", `${maxSize}px`);

      let low = minSize;
      let high = maxSize;
      let best = minSize;

      for (let index = 0; index < 9; index += 1) {
        const mid = (low + high) / 2;
        element.style.setProperty("--auto-fit-size", `${mid}px`);

        if (textFits()) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      element.style.setProperty("--auto-fit-size", `${best}px`);
      setFontSize(Math.floor(best * 10) / 10);
    };

    const scheduleFit = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(fit);
    };

    scheduleFit();

    const resizeObserver = new ResizeObserver(scheduleFit);
    resizeObserver.observe(element);

    document.fonts?.ready.then(scheduleFit);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [children, lineHeight, lines, maxSize, minSize]);

  return (
    <Tag
      ref={ref}
      className={`auto-fit-text ${lines === 1 ? "auto-fit-text-single" : ""} ${className}`}
      style={{
        ...style,
        "--auto-fit-size": `${fontSize}px`,
        "--auto-fit-lines": lines,
        "--auto-fit-line-height": lineHeight,
      } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
