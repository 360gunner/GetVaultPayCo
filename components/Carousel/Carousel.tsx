"use client";
import React from "react";
import * as s from "./Carousel.css";
import AppImage, { AppImageProps } from "../Image/AppImage";

export interface CarouselSlideImage
  extends Omit<AppImageProps, "wrapperClassName"> {
  wrapperClassName?: string;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: CarouselSlideImage[];
  intervalMs?: number;
  autoPlay?: boolean;
  loop?: boolean;
  startIndex?: number;
  showDots?: boolean;
  showArrows?: boolean;
  renderSlide?: (index: number) => React.ReactNode; // for custom slides
}

export const Carousel: React.FC<CarouselProps> = ({
  images,
  intervalMs = 3500,
  autoPlay = true,
  loop = true,
  startIndex = 0,
  showDots = true,
  showArrows = true,
  renderSlide,
  className,
  children,
  ...rest
}) => {
  const total = images?.length ?? React.Children.count(children);
  const [index, setIndex] = React.useState(() =>
    startIndex >= 0 ? startIndex % Math.max(total, 1) : 0
  );
  const [paused, setPaused] = React.useState(false);

  const next = React.useCallback(() => {
    setIndex((i) => {
      if (total <= 0) return 0;
      const ni = i + 1;
      if (ni >= total) return loop ? 0 : i;
      return ni;
    });
  }, [total, loop]);

  const prev = React.useCallback(() => {
    setIndex((i) => {
      if (total <= 0) return 0;
      const pi = i - 1;
      if (pi < 0) return loop ? Math.max(total - 1, 0) : i;
      return pi;
    });
  }, [total, loop]);

  React.useEffect(() => {
    if (!autoPlay || paused || total <= 1) return;
    const id = window.setInterval(next, intervalMs);
    return () => window.clearInterval(id);
  }, [autoPlay, paused, total, intervalMs, next]);

  const onDotClick = (i: number) => setIndex(i);

  const slides = React.useMemo(() => {
    if (images && images.length > 0) {
      return images.map((img, i) => (
        <div className={s.slide} key={i} aria-hidden={i !== index}>
          <AppImage {...img} />
        </div>
      ));
    }
    if (renderSlide && total > 0) {
      return Array.from({ length: total }).map((_, i) => (
        <div className={s.slide} key={i} aria-hidden={i !== index}>
          {renderSlide(i)}
        </div>
      ));
    }
    return React.Children.map(children, (child, i) => (
      <div className={s.slide} key={i} aria-hidden={i !== index}>
        {child}
      </div>
    ));
  }, [images, children, index, renderSlide, total]);

  return (
    <div
      className={[s.root, className].filter(Boolean).join(" ")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      {...rest}
    >
      <div
        className={s.track}
        style={{
          width: `${Math.max(total, 1) * 100}%`,
          transform: `translateX(-${index * (100 / Math.max(total, 1))}%)`,
        }}
      >
        {slides}
      </div>

      {showArrows && total > 1 && (
        <div className={s.controls} aria-hidden>
          <button
            type="button"
            className={s.controlBtn}
            onClick={prev}
            aria-label="Previous slide"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className={s.controlBtn}
            onClick={next}
            aria-label="Next slide"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {showDots && total > 1 && (
        <div className={s.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              className={i === index ? s.dot.on : s.dot.off}
              onClick={() => onDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
